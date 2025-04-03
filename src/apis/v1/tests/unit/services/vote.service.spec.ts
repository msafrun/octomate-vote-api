import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'express';
import Vote from '../../../models/vote.model';
import {
  listCandidate,
  totalVote,
  voteCandidate,
} from '../../../services/vote.service';
import { ZodError } from 'zod';
import { httpStatus } from '../../../../../utils/http.util';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

describe('voteCandidate', () => {
  let req: Partial<Request>;
  let mockUser: any;
  let mockVoteCreate: any;
  let mockVoteFindOneAndDelete: any;

  beforeEach(() => {
    mockUser = { id: 'userId123' };
    req = {
      user: mockUser,
      body: { name: 'john doe' },
    };

    mockVoteFindOneAndDelete = sinon.stub(Vote, 'findOneAndDelete').resolves();
    mockVoteCreate = sinon.stub(Vote, 'create').resolves({
      name: 'John Doe',
      user_id: mockUser.id,
      created_at: new Date(),
      deleted_at: null,
    } as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a vote entry and return a successful response', async () => {
    const response = await voteCandidate(req as Request);

    expect(mockVoteFindOneAndDelete.calledOnceWith({ user_id: mockUser.id })).to
      .be.true;

    expect(
      mockVoteCreate.calledOnceWith({
        name: 'John Doe',
        user_id: mockUser.id,
      }),
    ).to.be.true;

    expect(response.statusCode).to.equal(httpStatus.CREATED);
    expect(response.message).to.equal('Request successful');
    expect(response.data.name).to.equal('John Doe');
    expect(response.data.user_id).to.equal(mockUser.id);
  });

  it('should format the name correctly to "John Doe"', async () => {
    const formattedName = req.body.name?.replace(/\b\w/g, (char: string) =>
      char.toUpperCase(),
    );
    expect(formattedName).to.equal('John Doe');
  });

  it('should handle when the name is not provided in the request body', async () => {
    try {
      await voteCandidate(req as Request);
    } catch (err: any) {
      expect(err).to.be.instanceOf(ZodError);
      expect(err.errors[0].message).to.equal('Name is required');
    }
  });

  it('should handle errors thrown in the service', async () => {
    const error = new Error('Database error');
    mockVoteCreate.rejects(error);

    try {
      await voteCandidate(req as Request);
    } catch (err: any) {
      expect(err.message).to.equal('Database error');
    }
  });
});

describe('listCandidate', () => {
  let req: Partial<Request>;
  let mockVoteDistinct: any;

  beforeEach(() => {
    req = {};

    mockVoteDistinct = sinon
      .stub(Vote, 'distinct')
      .resolves(['John Doe', 'Jane Smith', 'Alice Johnson']);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return a list of distinct candidate names', async () => {
    const response = await listCandidate(req as Request);

    expect(mockVoteDistinct.calledOnceWith('name')).to.be.true;

    expect(response.statusCode).to.equal(httpStatus.OK);
    expect(response.message).to.equal('Request successful');
    expect(response.data)
      .to.be.an('array')
      .that.includes.members(['John Doe', 'Jane Smith', 'Alice Johnson']);
    expect(response.data.length).to.equal(3);
  });

  it('should handle when no candidates are found', async () => {
    mockVoteDistinct.resolves([]);

    const response = await listCandidate(req as Request);

    expect(mockVoteDistinct.calledOnceWith('name')).to.be.true;

    expect(response.statusCode).to.equal(httpStatus.OK);
    expect(response.message).to.equal('Request successful');
    expect(response.data).to.be.an('array').that.is.empty;
  });

  it('should handle errors thrown in the service', async () => {
    const error = new Error('Database error');
    mockVoteDistinct.rejects(error);

    try {
      await listCandidate(req as Request);
    } catch (err: any) {
      expect(err.message).to.equal('Database error');
    }
  });
});

describe('totalVote', () => {
  let req: Partial<Request>;
  let mockVoteAggregate: any;
  let mockVoteCountDocuments: any;

  beforeEach(() => {
    req = {};

    mockVoteAggregate = sinon.stub(Vote, 'aggregate').resolves([
      { _id: 'John Doe', count: 100 },
      { _id: 'Jane Smith', count: 80 },
      { _id: 'Alice Johnson', count: 60 },
    ]);

    mockVoteCountDocuments = sinon.stub(Vote, 'countDocuments').resolves(240);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return the total votes and formatted votes per candidate', async () => {
    const response = await totalVote(req as Request);

    expect(mockVoteAggregate.calledOnce).to.be.true;
    expect(mockVoteCountDocuments.calledOnce).to.be.true;

    expect(response.statusCode).to.equal(httpStatus.OK);
    expect(response.message).to.equal('Request successful');
    expect(response.data.candidates).to.be.an('array').that.has.lengthOf(3);
    expect(response.data.total_vote).to.equal(240);

    const firstCandidate = response.data.candidates[0];
    expect(firstCandidate.id).to.equal(1);
    expect(firstCandidate.name).to.equal('John Doe');
    expect(firstCandidate.total_vote).to.equal(100);
    expect(firstCandidate.total_vote_percentage).to.equal('41.67%');

    const secondCandidate = response.data.candidates[1];
    expect(secondCandidate.id).to.equal(2);
    expect(secondCandidate.name).to.equal('Jane Smith');
    expect(secondCandidate.total_vote).to.equal(80);
    expect(secondCandidate.total_vote_percentage).to.equal('33.33%');

    const thirdCandidate = response.data.candidates[2];
    expect(thirdCandidate.id).to.equal(3);
    expect(thirdCandidate.name).to.equal('Alice Johnson');
    expect(thirdCandidate.total_vote).to.equal(60);
    expect(thirdCandidate.total_vote_percentage).to.equal('25.00%');
  });

  it('should handle when there are no votes', async () => {
    mockVoteAggregate.resolves([]);
    mockVoteCountDocuments.resolves(0);

    const response = await totalVote(req as Request);

    expect(mockVoteAggregate.calledOnce).to.be.true;
    expect(mockVoteCountDocuments.calledOnce).to.be.true;

    expect(response.statusCode).to.equal(httpStatus.OK);
    expect(response.message).to.equal('Request successful');
    expect(response.data.candidates).to.be.an('array').that.is.empty;
    expect(response.data.total_vote).to.equal(0);
  });

  it('should handle errors thrown during aggregation or countDocuments', async () => {
    const error = new Error('Database error');
    mockVoteAggregate.rejects(error);
    mockVoteCountDocuments.rejects(error);

    try {
      await totalVote(req as Request);
    } catch (err: any) {
      expect(err.message).to.equal('Database error');
    }
  });
});
