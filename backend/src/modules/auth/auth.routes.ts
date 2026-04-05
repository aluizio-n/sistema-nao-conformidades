import { Router } from 'express';
import { login, me, register } from './auth.controller.js';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated.js';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/me', ensureAuthenticated, me);

export default authRoutes;
