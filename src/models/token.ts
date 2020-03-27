import mongoose from 'mongoose';
import nanoid from 'nanoid';

import { generateModelId } from '../util';

export interface FGPSWDData {
  userId: string;
  email: string;
}

export interface FGPSWDAdminData {
  adminId: string;
  email: string;
}

export interface IToken {
  value: string;
  type: types;
  data: FGPSWDData | FGPSWDAdminData;
  expires: string;
  createdAt: string;
}

export interface ITokenDoc extends IToken, mongoose.Document {}
export interface ITokenModel extends mongoose.Model<ITokenDoc> {}

type types = 'FORGOT_PASSWORD';

export const TokenTypes: Record<types, string> = {
  FORGOT_PASSWORD: 'frgt_pswd',
};

const DefaultExpires: Record<string, () => Date> = {
  frgt_pswd: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
};

const Token = new mongoose.Schema({
  _id: { type: String, default: generateModelId },
  value: {
    default: () => nanoid(10),
    type: String,
    index: true,
  },
  type: {
    type: String,
    enum: Object.values(TokenTypes),
    required: true,
  },
  data: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  expires: {
    type: Date,
    default: function() {
      return DefaultExpires[this.type as types]();
    },
  },
  createdAt: { type: Date, expires: '43800m', default: Date.now },
});

export const TokenModel = mongoose.model<ITokenDoc>('Token', Token);
