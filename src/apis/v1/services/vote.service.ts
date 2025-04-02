import { Request } from 'express';
import Vote from '../models/vote.model';
import { IResponse, responseJson } from '../../../utils/response.util';
import { httpStatus } from '../../../utils/http.util';

const voteCandidate = async (req: Request): Promise<IResponse> => {
  const user = req.user;
  const { name } = req.body;

  const formmatedName = name?.replace(/\b\w/g, (char: string) =>
    char.toUpperCase(),
  );

  await Vote.findOneAndDelete({ user_id: user?.id });

  const data = await Vote.create({ name: formmatedName, user_id: user?.id });

  return responseJson(data, httpStatus.CREATED);
};

const listCandidate = async (req: Request): Promise<IResponse> => {
  const candidates = await Vote.distinct('name');

  return responseJson(candidates, httpStatus.OK);
};

const totalVote = async (req: Request) => {
  const [votesPerCandidate, totalVotes] = await Promise.all([
    Vote.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Vote.countDocuments(),
  ]);

  const formattedVotes = votesPerCandidate?.map((el, idx) => {
    const percentage = (el?.count / totalVotes || 1) * 100;
    return {
      id: idx + 1,
      name: el?._id,
      total_vote: el?.count,
      total_vote_percentage: `${percentage.toFixed(2)}%`,
    };
  });

  return responseJson({
    candidates: formattedVotes || [],
    total_vote: totalVotes || 0,
  });
};

export { voteCandidate, listCandidate, totalVote };
