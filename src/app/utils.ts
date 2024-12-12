import { SortBy, SortOrderType } from "./models/models";

export const getPagedData = <T>(page: number, pageSize: number, data: T[]): T[] => {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

export const defaultSearchFunction = (
  searchTerm: string | null,
  dataSet: any[],
  searchByFields: string[],
): any[] => {
  const data: any[] = [];
  if (searchTerm) {
    const regExp = new RegExp(searchTerm, 'i');

    dataSet.forEach((dataItem: any) => {
      for (const field of searchByFields) {
        if (dataItem[field] && regExp.test(dataItem[field])) {
          data.push(dataItem);
          break;
        }
      }
    });
  } else {
    data.push(...dataSet);
  }
  return data;
};


export const genericSortItems = (sortModel: SortBy, listItems: any[]): void => {
  if (sortModel) {
    switch (sortModel?.type) {
      case 'date':
        sortByDate(sortModel, listItems);
        break;
      case 'number':
        sortByNumber(sortModel, listItems);
        break;
      default:
        sortByString(sortModel, listItems);
        break;
    }
  }
};

export const sortByNumber = (sortModel: SortBy, listItems: any[]): void => {
  listItems.sort((a, b) => {
    const _a = a[sortModel.key];
    const _b = b[sortModel.key];
    const expressions = sortModel.sortOrder === SortOrderType.ASC ? _a - _b : _b - _a;

    return expressions;
  });
}
export const sortByDate = (sortModel: SortBy, listItems: any[]): void => {
  listItems.sort((a, b) => {
    const _a = getTime(a[sortModel.key]);
    const _b = getTime(b[sortModel.key]);
    const expressions = sortModel.sortOrder === SortOrderType.ASC ? _a < _b : _a > _b;

    return _a !== _b ? (expressions ? -1 : 1) : 0;
  });
};

export const sortByString = (sortModel: SortBy, listItems: any[]) => {
  const collator = new Intl.Collator('mk-MK', { sensitivity: 'base' });
  // return listItems.sort(collator.compare)
    return listItems.sort((a, b) => {
      const _a = a[sortModel.key];
      const _b = b[sortModel.key];
      const comparison = collator.compare(_a, _b);
      return sortModel.sortOrder === SortOrderType.ASC ? comparison : -comparison;
  });
};

export const getTime = (date?: string): number => {
  return date != null ? Date.parse(date) : 0;
};
