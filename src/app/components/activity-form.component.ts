import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormsModule, ReactiveFormsModule,  Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import {   MatPaginatorIntl  } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../mat-paginator-labels.service';
import { StoreService } from '../store.service';
@Component({
  selector: 'activity-form',
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
  imports: [
    MatIconModule,
    MatButton,
    TranslocoPipe,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFormComponent  {

  readonly #storeService: StoreService = inject(StoreService);
  readonly #fb = inject(FormBuilder);

  ecoDays = this.#storeService.ecoDays;
  selectedActivity = computed( () => {
    const selectedActivity: any = this.#storeService.pageState().selectedActivity;
    if(selectedActivity) {
      this.form.patchValue({
        name: selectedActivity.name,
        description:  selectedActivity.description,
        pdf:  selectedActivity.documentUrl,
        youTubeUrl:  selectedActivity.videoUrl,
        ecoDays:  selectedActivity.dateId,
        age:  selectedActivity.age,
        subject:  selectedActivity.subject,
        location:  selectedActivity.location,
        technique:  selectedActivity.technique,
      })
    }

    return selectedActivity
  });
  pageState = this.#storeService.pageState;


  form = this.#fb.group({
    name: [ '' , [Validators.required, Validators.minLength(3)]],
    description: ['' , [Validators.required, Validators.minLength(15)]],
    pdf: [''],
    youTubeUrl: [''],
    ecoDays: ['' , [Validators.required]],
    filterCombinationId:  ['' , [Validators.required]],
    age: [],
    subject: [],
    location: [],
    technique: [],
  });

  onSubmit() {
    const request = this.form.getRawValue();
    const _request = {
      name: request.name,
      description: request.description,
      documentUrl: request.pdf,
      videoUrl: request.youTubeUrl,
      dateId: request.ecoDays,
      filterCombinationId: request.filterCombinationId
      // filterCombinationId: {
      //   age: request.age,
      //   subject: request.subject,
      //   location: request.location,
      //   technique: request.technique
      // }
    }

    if(this.selectedActivity() !== null) {
      this.#storeService.updateActivity(_request);
    } else {
      this.#storeService.addActivity(_request).subscribe((response) => {

      });
    }
  }

  removeActivity(activityId: any) {
    this.#storeService.removeActivity(activityId);
  }

  resetForm() {
    this.#storeService.pageState.update( oldState => ({
      ...oldState,
      selectedActivity: null
    }));
  }

}
