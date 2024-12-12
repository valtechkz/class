import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, filter, skip  } from 'rxjs';

import { toObservable } from '@angular/core/rxjs-interop';
import { CustomMatPaginatorIntl } from '../mat-paginator-labels.service';
import { SortOrderIconPipe } from '../pipes/sort-order-icon.pipe';
import { ClickStopPropagation } from '../directives/click-stop-propagation.directive';
import { StoreService } from '../store.service';
@Component({
  selector: 'table-component',
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
  imports: [
    MatIconModule,
    TranslocoPipe,
    MatPaginator,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    SortOrderIconPipe,
    ReactiveFormsModule,
    FormsModule,
    ClickStopPropagation,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent  {

  readonly #storeService: StoreService = inject(StoreService);
  pageSizeOptions = [10, 15, 25];
  pageState = this.#storeService.pageState;
  search = model<string>('');

  availableData = computed( () => {
    console.log(this.#storeService.pageState().availableData)
    return this.#storeService.pageState().availableData
  })
  /**
   *
   */
  constructor() {
    toObservable(this.search)
    .pipe(
      skip(1),
      debounceTime(300),
      distinctUntilChanged(),
      filter((v: string) => {
        if (v && v.length >= 3) {
          return true;
        } else {
          this.#storeService.searchItem(null)
          return false;
        }
      })
    )
    .subscribe(val => {
      this.#storeService.searchItem(val)
    });
  }

  selectActivity(activity: any) {
    this.#storeService.pageState.update( oldState => ({
      ...oldState,
      selectedActivity: activity
    }))
  }

  removeActivity(activityId: any) {
    this.#storeService.removeActivity(activityId);
  }

  sortBy(key: string, activeIndex: number, type?: string) {
    this.#storeService.sort(key, activeIndex, type);
  }

  changePage(event: PageEvent) {
    this.#storeService.queryPage(event)
  };

}
