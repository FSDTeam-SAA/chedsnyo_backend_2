import { Types } from 'mongoose';

export interface IAssigment {
  banner: string;
  title: string;
  description?: string;
  budget: string;
  priceType: string;
  paymentMethod: string;
  deadLine?: Date;
  uploadFile?: string;
  user?: Types.ObjectId;
  status?: 'approved' | 'rejected' | 'pending';
  application?: Types.ObjectId[];
  review?: Types.ObjectId[];
}
