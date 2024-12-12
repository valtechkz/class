import { Pipe, PipeTransform } from '@angular/core';
import { SortBy, SortOrderType } from '../models/models';

@Pipe({
  name: 'sortOrderIcon',
  standalone: true
})
export class SortOrderIconPipe implements PipeTransform {
  transform(sortOrder: SortBy): string {
    return sortOrder.sortOrder === SortOrderType.ASC ? 'arrow_drop_down' : 'arrow_drop_up';
  }
}
