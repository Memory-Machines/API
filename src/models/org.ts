import mongoose from 'mongoose';

import { generateModelId } from '../util';

export interface IApiToken {
  active: boolean;
  secret: string;
  scopes: string[];
}

export interface IOrg {
  active: boolean;
  name: string;
  email: string;
  api: IApiToken;
}

export interface IOrgDoc extends IOrg, mongoose.Document {}

const apiSchema: mongoose.Schema<IOrg> = new mongoose.Schema(
  {
    active: {
      default: false,
      type: Boolean,
    },
    secret: {
      index: {
        partialFilterExpression: { secret: { $type: 'string' } }, // unique only when secret is a string
        unique: true,
      },
      type: String,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const Org = new mongoose.Schema(
  {
    _id: { type: String, default: generateModelId },
    active: {
      default: true,
      type: Boolean,
    },
    api: {
      default: {},
      select: false,
      type: apiSchema,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    email: {
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export interface IOrgModel extends mongoose.Model<IOrgDoc> {}

export const OrgModel = mongoose.model<IOrgDoc>('Org', Org);
