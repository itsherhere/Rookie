import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import jobsRouter from './jobs';
import applicationsRouter from './applications';
import candidatesRouter from './candidates';
import employersRouter from './employers';
import interviewsRouter from './interviews';
import messagesRouter from './messages';
import employeesRouter from './employees';
import payrollRouter from './payroll';
import attendanceRouter from './attendance';
import leaveRouter from './leave';
import adminRouter from './admin';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/jobs', jobsRouter);
router.use('/applications', applicationsRouter);
router.use('/candidates', candidatesRouter);
router.use('/employers', employersRouter);
router.use('/interviews', interviewsRouter);
router.use('/messages', messagesRouter);
router.use('/employees', employeesRouter);
router.use('/payroll', payrollRouter);
router.use('/attendance', attendanceRouter);
router.use('/leave', leaveRouter);
router.use('/admin', adminRouter);

export default router;
