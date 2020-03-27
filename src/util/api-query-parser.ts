import aqp from 'api-query-params';

export default function apiQueryParser(queryString: string) {
  const result = aqp(queryString);
  if (!result.filter) {
    result.filter = {};
  }
  const page = Number(result.filter.page) || 1;
  const filterType = result.filter.filterType;
  result.limit = 100;
  result.skip = 0;
  // if it is a valid number
  if (!isNaN(page)) {
    result.skip = (page - 1) * result.limit;
    delete result.filter.page;
  }
  if (filterType) {
    delete result.filter.filterType;
    result.filterType = filterType === 'and' ? 'and' : 'or';
  }

  return result;
}
