import type { AuthPayload } from '../middlewares/authMiddleware.js';

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
