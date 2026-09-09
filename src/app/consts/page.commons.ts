import { Sort } from '@angular/material/sort';
import { PageConfig } from '../models/interfaces/page.config';

export const pageCommons: PageConfig = {
  pageIndex: 0,
  pageSize: 5,
  sortBy: 'creationDate,desc',
};

export function buildSortBy(sort?: Sort | null, fallback = 'creationDate'): string {
  if (!sort?.direction) {
    return fallback;
  }

  return `${sort.active},${sort.direction}`;
}
