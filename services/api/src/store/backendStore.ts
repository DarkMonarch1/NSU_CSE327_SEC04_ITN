import {
  StudentProfile,
  CourseSection,
  ExceptionCase,
  BypassRule,
  AuditLogItem,
  AdminMetrics,
  EscalationItem,
  ScheduleReceipt
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_SECTIONS,
  INITIAL_STAGED_IDS,
  INITIAL_EXCEPTIONS,
  INITIAL_BYPASS_RULES,
  INITIAL_AUDIT_LOG,
  INITIAL_METRICS,
  INITIAL_ESCALATIONS
} from '../seedData';

export interface BackendState {
  student: StudentProfile;
  sections: CourseSection[];
  stagedSectionIds: string[];
  exceptions: ExceptionCase[];
  bypassRules: BypassRule[];
  auditLog: AuditLogItem[];
  metrics: AdminMetrics;
  escalations: EscalationItem[];
  receipt: ScheduleReceipt | null;
}

export type StoreSubscriber = (state: BackendState) => void;

function deepClone<T>(data: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(data);
  }
  return JSON.parse(JSON.stringify(data));
}

export class BackendStore {
  private state: BackendState;
  private subscribers: Set<StoreSubscriber> = new Set();
  private sectionLocks: Map<string, Promise<void>> = new Map();

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): BackendState {
    return {
      student: deepClone(INITIAL_STUDENT),
      sections: deepClone(INITIAL_SECTIONS),
      stagedSectionIds: deepClone(INITIAL_STAGED_IDS),
      exceptions: deepClone(INITIAL_EXCEPTIONS),
      bypassRules: deepClone(INITIAL_BYPASS_RULES),
      auditLog: deepClone(INITIAL_AUDIT_LOG),
      metrics: deepClone(INITIAL_METRICS),
      escalations: deepClone(INITIAL_ESCALATIONS),
      receipt: null
    };
  }

  /**
   * Returns a deep-cloned snapshot of the current state
   */
  public getState(): BackendState {
    return deepClone(this.state);
  }

  /**
   * Restores all state back to deep-cloned INITIAL_* fixtures and receipt: null
   */
  public resetState(): void {
    this.state = this.createInitialState();
    this.notifySubscribers();
  }

  /**
   * Applies atomic state mutations and notifies registered subscribers
   */
  public updateState(updater: (state: BackendState) => void): BackendState {
    updater(this.state);
    this.notifySubscribers();
    return this.getState();
  }

  /**
   * Prepends a new audit log item and triggers state subscribers
   */
  public addAuditLog(
    actor: string,
    action: string,
    details: string,
    badgeType: AuditLogItem['badgeType']
  ): AuditLogItem {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      actor,
      action,
      details,
      badgeType
    };

    this.updateState((s) => {
      s.auditLog = [newLog, ...s.auditLog];
    });

    return newLog;
  }

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   */
  public subscribe(cb: StoreSubscriber): () => void {
    this.subscribers.add(cb);
    return () => {
      this.unsubscribe(cb);
    };
  }

  /**
   * Unsubscribe a listener callback
   */
  public unsubscribe(cb: StoreSubscriber): void {
    this.subscribers.delete(cb);
  }

  private notifySubscribers(): void {
    const snapshot = this.getState();
    for (const subscriber of this.subscribers) {
      try {
        subscriber(snapshot);
      } catch (err) {
        console.error('Error in store subscriber:', err);
      }
    }
  }

  /**
   * Row-level locking emulation (SELECT ... FOR UPDATE) for section concurrency
   */
  public async withSectionLock<T>(sectionId: string, fn: () => Promise<T> | T): Promise<T> {
    while (this.sectionLocks.has(sectionId)) {
      await this.sectionLocks.get(sectionId);
    }

    let releaseLock: () => void = () => {};
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.sectionLocks.set(sectionId, lockPromise);

    try {
      return await fn();
    } finally {
      this.sectionLocks.delete(sectionId);
      releaseLock();
    }
  }
}

export const backendStore = new BackendStore();
