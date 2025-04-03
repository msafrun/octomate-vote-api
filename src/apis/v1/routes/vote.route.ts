import { Router } from 'express';
import {
  authenticate,
  rbacMiddleware,
} from '../../../middlewares/auth.middleware';
import { voteController } from '../controllers/index.controller';
import { RoleName } from '../../../constants/role.constant';
import validate from '../../../middlewares/validate-dto.middleware';
import { createVoteSchema } from '../dtos/vote.dto';

const router = Router();
router.use(authenticate);

// POST
router.post('/', validate(createVoteSchema), voteController.voteCandidate);

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
