import { Router } from 'express';

import { authRoutes } from '../modules/auth/auth.routes';

export const appRoutes = Router();

appRoutes.use('/auth', authRoutes);
// appRouter.use('/staff', staffRouter);
// appRouter.use('/class', classRouter);
// appRouter.use('/student', studentRouter);
