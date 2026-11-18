import express, { Request, Response } from 'express';
import cors from 'cors';
import { bootstrapRouter } from './routes/bootstrap';
import { studentRouter } from './routes/student';
import { facultyRouter } from './routes/faculty';
import { adminRouter } from './routes/admin';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', bootstrapRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/faculty', facultyRouter);
app.use('/api/v1/admin', adminRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'smartadvisor-api'
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to SmartAdvisor NSU API',
    course: 'CSE 327 Sec 04',
    supervisor: 'Intisar Tahmeed (ITN)'
  });
});
