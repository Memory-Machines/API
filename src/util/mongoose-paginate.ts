/**
 * @package mongoose-paginate
 * @param {Object} [query={}]
 * @param {Object} [options={}]
 * @param {Object|String} [options.select]
 * @param {Object|String} [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean} [options.lean=false]
 * @param {Boolean} [options.leanWithId=true]
 * @param {Number} [options.offset=0] - Use offset or page to set skip position
 * @param {Number} [options.page=1]
 * @param {Number} [options.limit=10]
 * @param {Function} [callback]
 * @returns {Promise}
 */

export function paginate(
  query: any,
  options: {
    select: any | string;
    sort: any | string;
    populate: any[] | any | string;
    lean: boolean;
    leanWithId: boolean;
    offset: number;
    page: number;
    limit: number;
  },
  callback: (error: any, result: any) => any
) {
  query = query || {};
  options = { ...paginate.options, ...options };
  const select = options.select;
  const sort = options.sort;
  const populate = options.populate;
  const lean = options.lean || true;
  const leanWithId = options.leanWithId ? options.leanWithId : true;
  const limit = options.limit ? options.limit : 10;
  let page: number;
  let offset: number;
  let skip: number;
  let promises: Record<'docs' | 'count', Promise<any>>;
  if (options.offset) {
    offset = options.offset;
    skip = offset;
  } else if (options.page) {
    page = options.page;
    skip = (page - 1) * limit;
  } else {
    page = 1;
    offset = 0;
    skip = offset;
  }
  if (limit) {
    const docsQuery = this.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(lean);
    if (populate) {
      [].concat(populate).forEach(item => {
        docsQuery.populate(item);
      });
    }
    promises = {
      count: this.countDocuments(query).exec(),
      docs: docsQuery.exec(),
    };
    if (lean && leanWithId) {
      promises.docs = promises.docs.then(docs => {
        return docs.map((doc: any) => {
          const newdoc = doc.toObject();
          return newdoc;
        });
      });
    }
  }
  const flatPromises = Object.entries(promises).map((x: ['docs' | 'count', Promise<any>]) => x[0]);
  return Promise.all(flatPromises).then((data: any) => {
    const result: any = {
      docs: data.docs || [],
      limit,
      total: data.count,
    };
    if (offset !== undefined) {
      result.offset = offset;
    }
    if (page !== undefined) {
      result.page = page;
      result.pages = Math.ceil(data.count / limit) || 1;
    }
    if (typeof callback === 'function') {
      return callback(null, result);
    }
    return Promise.resolve(result);
  });
}

paginate.options = {
  lean: true,
  limit: 50,
};

/**
 * @param {Schema} schema
 */

// tslint:disable-next-line: only-arrow-functions
export default function(schema: any) {
  schema.statics.paginate = paginate;
}
