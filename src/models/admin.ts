import mongoose from 'mongoose';
import _ from 'lodash';

import { generateModelId } from '../util';

export type adminRoles = 'superAdmin' | 'admin';
export const adminRoles = ['superAdmin', 'admin'];

export interface IAdmin {
  email: string;
  active: boolean;
  role: adminRoles;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IAdminDoc extends IAdmin, mongoose.Document {}

const Schema = new mongoose.Schema(
  {
    _id: { type: String, default: generateModelId },
    email: {
      index: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    active: {
      default: false,
      type: Boolean,
    },
    role: {
      type: String,
      enum: adminRoles,
      required: true,
    },
    firstName: {
      required: true,
      trim: true,
      type: String,
    },
    lastName: {
      required: true,
      trim: true,
      type: String,
    },
    password: {
      required: true,
      select: false,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export interface IAdminModel extends mongoose.Model<IAdminDoc> {}
export const AdminModel = mongoose.model<IAdminDoc>('Admin', Schema);
