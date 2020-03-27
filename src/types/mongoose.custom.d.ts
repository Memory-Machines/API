import * as mongoose from 'mongoose';

declare module 'mongoose' {
  namespace SchemaTypeOpts {
    // tslint:disable-next-line: interface-name
    export interface IndexOpts {
      partialFilterExpression?: any;
    }
  }

  // tslint:disable-next-line: interface-name
  export interface Model<T extends Document, QueryHelpers = {}> extends NodeJS.EventEmitter, ModelProperties {
    paginate(
      query: any,
      options: {
        select?: any | string;
        sort?: any | string;
        populate?: any[] | any | string;
        lean?: boolean;
        leanWithId?: boolean;
        offset?: number;
        page?: number;
        limit?: number;
      },
      callback?: (error: any, result: any) => any
    ): DocumentQuery<T | null, T> & QueryHelpers;
  }
}
