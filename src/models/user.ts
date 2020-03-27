import mongoose from 'mongoose';
import _ from 'lodash';

import { generateModelId } from '../util';
import { IOrg, IOrgDoc } from './org';

export interface IUserTeam {
  acl: [string]; // list of permissions
  active: boolean; // whether member is active or not
  owner: boolean; // whether member is owner or not
  org: IOrg | string;
}

export interface IUserTeamPopulated {
  acl: [string]; // list of permissions
  active: boolean; // whether member is active or not
  owner: boolean; // whether member is owner or not
  org: IOrgDoc;
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  teams: [IUserTeam];
}

export interface IUserPopulated {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  teams: [IUserTeamPopulated];
}

export interface IUserDoc extends IUser, mongoose.Document {}

const teamsSchema = new mongoose.Schema(
  {
    acl: {
      required: true,
      type: [
        {
          type: String, // list of scopes like 'settings.read'
        },
      ],
    },
    active: {
      default: true,
      type: Boolean,
    },
    org: {
      index: true, // index required to search for org members
      ref: 'Org',
      required: true,
      type: String,
    },
    owner: {
      default: false,
      type: Boolean,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const User = new mongoose.Schema(
  {
    _id: { type: String, default: generateModelId },
    email: {
      index: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
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
    teams: {
      default: [],
      type: [teamsSchema],
    },
  },
  {
    timestamps: true,
  }
);

export interface IUserModel extends mongoose.Model<IUserDoc> {}
export const UserModel = mongoose.model<IUserDoc>('User', User);
