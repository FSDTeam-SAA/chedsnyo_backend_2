import { Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName?: string;
  businessName?: string;
  email: string;
  password: string;
  role: 'admin' | 'business' | 'seles';
  profileImage?: string;
  goal?: string;
  referralCode?: string;
  overviewExperience?: string;
  specialties?: string;
  achievements?: string;
  portfolio?: string;
  phone?: string;
  location?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  stripeAccountId?: string;
  industry?: Types.ObjectId;
  kvkVatNumber?: string;
  status?: 'approved' | 'rejected' | 'pending';
}
