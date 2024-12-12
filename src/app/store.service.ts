import { inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { catchError, from,  take,  tap } from 'rxjs';
import { TECHNIQUE_OPTIONS } from './values/technique-options';
import { LOCATION_OPTIONS } from './values/location-options';
import { SUBJECT_OPTIONS } from './values/subject-options';
import { AGE_OPTIONS } from './values/age-options';
import { DEFAULT_PAGE_SIZE, SelectOption, SortBy, SortOrderType } from './models/models';
import {MatSnackBar} from '@angular/material/snack-bar';
import { defaultSearchFunction, genericSortItems, getPagedData } from './utils';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';
import { Activity } from './models/activity';

export interface PageState {
  availableData: any[];
  page: number;
  pageSize: number;
  displayedColumns: string[],
  total: number;
  selectedActivity: any;
  totalPages: number;
  sortOrder: SortBy;
  searchFields: string[];
  techniques: SelectOption[];
  categories: any[];
  locationOptions: SelectOption[];
  subjectOptions: SelectOption[];
  ageOptions: SelectOption[];
  ecoActivities: any[];
}
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  readonly #fs: Firestore = inject(Firestore);
  readonly #categoriesCollection = collection(this.#fs, 'categories');
  readonly #ecoActivityCollection = collection(this.#fs, 'eco_activity');
  readonly #ecoDaysCollection = collection(this.#fs, 'eco_days');
  readonly #snackBar = inject(MatSnackBar);
  readonly #translate: TranslocoService = inject(TranslocoService);

  pageState = signal({
    availableData: [] as any[],
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    displayedColumns: ['name'] as string[],
    total: 0,
    totalPages: 0,
    searchFields: ['name'],
    sortOrder: {
      key: 'name',
      activeIndex: 0,
      sortOrder: SortOrderType.ASC
    },
    selectedActivity: null,
    techniques: TECHNIQUE_OPTIONS,
    locationOptions: LOCATION_OPTIONS,
    subjectOptions: SUBJECT_OPTIONS,
    categories: [] as any[],
    ageOptions: AGE_OPTIONS,
    ecoActivities: [] as any[],
  });

  categories = toSignal(
    collectionData<any>(this.#categoriesCollection).pipe(
      take(1),
      tap((response: any[]) => {
        this.pageState.update((oldState) => ({
          ...oldState,
          categories: response
        }));
      })
    )
  ) as Signal<any[]>;

  fetchActivities() {
    collectionData(this.#ecoActivityCollection).pipe(
      take(1)
    )
      .subscribe((response: Activity[]) => {
        this.pageState.update((oldState) => ({
          ...oldState,
          ecoActivities: response,
          availableData: [...(getPagedData(0, DEFAULT_PAGE_SIZE, response) ?? [])],
          page: 0,
          pageSize: DEFAULT_PAGE_SIZE,
          total: response.length,
          totalPages: response.length / DEFAULT_PAGE_SIZE,
        }));
      });
  };

  ecoDays = toSignal(
    collectionData<any>(this.#ecoDaysCollection).pipe(
      take(1)
    )
  ) as Signal<any[]>;

  addActivity(request: any) {
    const promise = addDoc(this.#ecoActivityCollection, request).then(
      (response) => response
    );
    return from(promise).pipe(
      tap((response) => {
        this.pageState.update((oldPageState) => {

          const ecoAct =[request, ...oldPageState.ecoActivities];
          const avData =  getPagedData(0, DEFAULT_PAGE_SIZE, ecoAct) ?? [];
          const newState = {
            ...oldPageState,
            ecoActivities: ecoAct,
            availableData: avData ?? [] ,
            page: 0,
            total:  oldPageState.total + 1,
            totalPages:  ecoAct.length / DEFAULT_PAGE_SIZE,
          };
          return newState
        });

        this.#snackBar.open(this.#translate.translate('activity_add_success'));
      }),
      catchError(err => {
        this.#snackBar.open(this.#translate.translate('activity_add_failed'));
        return err
      })
    );
  }

  removeActivity(activityId: any) {
    this.pageState.update((oldPageState) => {
      const ecoActivities = oldPageState.ecoActivities.find((
        (i) => i.name === activityId
      ))
      ecoActivities.deleted = true;
      const availableData = oldPageState.availableData.find((
        (i) => i.name === activityId
      ))
      availableData.deleted = true;
      return {
        ...oldPageState
      }
    });
    this.#snackBar.open(this.#translate.translate('activity_deleted'));
  }

  updateActivity(activity: any) {
    this.pageState.update((oldPageState) => {
      let existingItemIndex = oldPageState.ecoActivities.findIndex(
        (i) => i.name === activity.name
      );
      if (existingItemIndex > -1) {
        oldPageState.ecoActivities[existingItemIndex] = {
          ...activity,
        };
      }

      return {
        ...oldPageState,
        selectedActivity: activity,
        availableData: [...getPagedData<any>(oldPageState.page, oldPageState.pageSize, oldPageState.ecoActivities)]
      };
  })
  this.#snackBar.open(this.#translate.translate('activity_updated_success'));
  }


  searchItem(searchTerm: string | null) {

    const state = this.pageState();
    const availableData = defaultSearchFunction(searchTerm, state.ecoActivities, state.searchFields);

    this.pageState.update(oldValue => ({
      ...oldValue,
      availableData: [...(getPagedData<any>(0, DEFAULT_PAGE_SIZE, availableData))],
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      total: availableData.length,
      totalPages: availableData.length / DEFAULT_PAGE_SIZE,
      sortOrder: {
        key: 'name',
        activeIndex: 0,
        sortOrder: SortOrderType.ASC
      }
    }))
  }

  queryPage(event: PageEvent) {

    this.pageState.update(oldValues => ({
      ...oldValues,
      page: event.pageIndex,
      pageSize: event.pageSize,
      availableData: [...getPagedData<any>(event.pageIndex, event.pageSize, oldValues.ecoActivities)]
    }))
  }

  sort(key: string, activeIndex = 0, type = '') {

    const pageState = this.pageState()
    const allData = structuredClone(pageState.ecoActivities);
    const sortBy = {
      key,
      activeIndex,
      type,
      sortOrder: pageState.sortOrder.sortOrder === SortOrderType.ASC ? SortOrderType.DESC : SortOrderType.ASC
    }

    genericSortItems({
      key: key,
      activeIndex: activeIndex,
      type: type,
      sortOrder: sortBy.sortOrder
    }, allData);

    this.pageState.update(oldValues => ({
      ...oldValues,
      sortOrder: sortBy,
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      availableData: [...(getPagedData(0, DEFAULT_PAGE_SIZE, allData))]
    }))
  }
}
