import { Document, model, Schema, Types } from 'mongoose';
import { MongoCollection } from '../../../constants/collection.constant';

export interface IVote extends Document {
  name: string;
  user_id: Types.ObjectId;
  created_at: Date;
  deleted_at: Date;
}

const voteSchema = new Schema<IVote>(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: MongoCollection.USER,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: MongoCollection.VOTE,
  },
);

const Vote = model<IVote>(MongoCollection.VOTE, voteSchema);
export default Vote;
