import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  readonly #translate: TranslocoService = inject(TranslocoService);
  constructor( ) {
    super();
  //   this.#translate.langChanges$.subscribe((e: any) => {

  //     this.itemsPerPageLabel = this.#translate.translate('by_page');
  //     this.nextPageLabel = 'Следна страница';
  //     this.previousPageLabel = 'Претходна страница';
  //     this.getRangeLabel = (page: number, pageSize: number, length: number) => {
  //         return `${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, length)} oд ${length}`;
  //       };
  //       this.changes.next();
  // });
  }

  override itemsPerPageLabel = 'Активности по страница:';
  override nextPageLabel = 'Следна страница';
  override previousPageLabel = 'Претходна страница';
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
      return `${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, length)} oд ${length}`;
    };
}
