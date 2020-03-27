declare module 'api-query-params' {
  export interface IAQPResult {
    filter: any;
    projection: any;
    sort: any;
    skip: number;
    limit: number;
    filterType: 'and' | 'or';
  }
  export interface IAQPOpt {
    blacklist?: string[];
    whiltelist?: string[];
  }
  const apq: (queryString: string, opt?: IAQPOpt) => IAQPResult;
  export default apq;
}
