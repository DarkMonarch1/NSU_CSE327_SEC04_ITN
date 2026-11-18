-- PostgreSQL 16 DDL Schema: Core Student Advising Domain
-- Tables: students, course_sections, staged_sections

-- ============================================================================
-- ACID Row-Level Locking Pattern for Zero-Overbooking Seat Reservations:
--
-- BEGIN;
-- SELECT * FROM course_sections WHERE id = $1 FOR UPDATE;
-- -- 1. Verify capacity constraint: (enrolled < capacity)
-- -- 2. Check student prerequisites & standing rules
-- -- 3. Increment enrolled count atomically:
-- --    UPDATE course_sections SET enrolled = enrolled + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1;
-- -- 4. Record stage entry in cart:
-- --    INSERT INTO staged_sections (student_id, section_id, course_code, added_at) VALUES ($2, $1, $3, $4);
-- COMMIT;
-- ============================================================================

-- Table: students (mirrors StudentProfile interface)
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    program VARCHAR(255) NOT NULL,
    standing VARCHAR(64) NOT NULL,
    credits_completed NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    credits_total NUMERIC(5, 2) NOT NULL DEFAULT 130.00,
    cgpa NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    cart_token VARCHAR(64) NOT NULL UNIQUE,
    cleared_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
    advising_cleared_by VARCHAR(255) NOT NULL,
    slot_closes_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: course_sections (mirrors CourseSection interface)
CREATE TABLE IF NOT EXISTS course_sections (
    id VARCHAR(64) PRIMARY KEY,
    course_code VARCHAR(32) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    department VARCHAR(64) NOT NULL,
    credits NUMERIC(3, 1) NOT NULL DEFAULT 3.0,
    section_number VARCHAR(16) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    days VARCHAR(16) NOT NULL,
    time_slot VARCHAR(64) NOT NULL,
    room VARCHAR(64) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40 CHECK (capacity >= 0),
    enrolled INTEGER NOT NULL DEFAULT 0 CHECK (enrolled >= 0),
    waitlisted INTEGER NOT NULL DEFAULT 0 CHECK (waitlisted >= 0),
    min_credits_required INTEGER DEFAULT NULL,
    prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_lab BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: staged_sections (mirrors StagedSection interface per student cart)
CREATE TABLE IF NOT EXISTS staged_sections (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    section_id VARCHAR(64) NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    course_code VARCHAR(32) NOT NULL,
    added_at BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_section UNIQUE (student_id, section_id)
);

-- Indexes for high-concurrency lookups and advising slot filtering
CREATE INDEX IF NOT EXISTS idx_students_cart_token ON students(cart_token);
CREATE INDEX IF NOT EXISTS idx_course_sections_course_code ON course_sections(course_code);
CREATE INDEX IF NOT EXISTS idx_course_sections_department ON course_sections(department);
CREATE INDEX IF NOT EXISTS idx_staged_sections_student_id ON staged_sections(student_id);
CREATE INDEX IF NOT EXISTS idx_staged_sections_section_id ON staged_sections(section_id);
