import { Request, Response } from 'express';
import catchAsyncHandlerMiddleware from '../../../middlewares/catch-async-handler.middleware';
import { voteService } from '../services/index.service';
import { httpStatus } from '../../../utils/http.util';

const voteCandidate = catchAsyncHandlerMiddleware(
  async (req: Request, res: Response) => {
    const result = await voteService.voteCandidate(req);

    res.status(httpStatus.CREATED).send(result);
  },
);

const listCandidate = catchAsyncHandlerMiddleware(
  async (req: Request, res: Response) => {
    const result = await voteService.listCandidate(req);

    res.status(httpStatus.OK).send(result);
  },
);

const totalVote = catchAsyncHandlerMiddleware(
  async (req: Request, res: Response) => {
    const result = await voteService.totalVote(req);

    res.status(httpStatus.OK).send(result);
  },
);

export { voteCandidate, listCandidate, totalVote };
