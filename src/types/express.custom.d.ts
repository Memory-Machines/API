import * as express from 'express';

import { IUserPopulated, IOrgDoc, IAdminDoc } from '../models';

declare module 'express' {
  // tslint:disable-next-line: interface-name
  export interface Request {
    user: IUserPopulated;
    org: IOrgDoc;
    locals: any;
    admin: IAdminDoc;
  }
}
