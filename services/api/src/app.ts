import express, { Request, Response } from 'express';
import cors from 'cors';

export const app = express();

app.use(cors());
app.use(express.json());

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
