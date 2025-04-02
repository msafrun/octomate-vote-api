import { Router } from 'express';
import {
  authenticate,
  rbacMiddleware,
} from '../../../middlewares/auth.middleware';
import { voteController } from '../controllers/index.controller';
import { RoleName } from '../../../constants/role.constant';

const router = Router();
router.use(authenticate);

// POST
router.post('/', voteController.voteCandidate);

// GET
router.get('/', voteController.listCandidate);
router.get(
  '/total',
  rbacMiddleware([RoleName.ADMIN]),
  voteController.totalVote,
);

// PATCH & PUT

// DELETE

export default router;
