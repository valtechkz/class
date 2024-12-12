import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'heading',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    TranslocoPipe,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  template:`
  <mat-toolbar color="primary">
  <mat-icon>local_fire_department</mat-icon>
  <span> {{  'home_heading' | transloco}}</span>

  <mat-form-field >
    <mat-label>{{  'pick_lang' | transloco}}</mat-label>
    <mat-select name="lang" [(ngModel)]="selectedValue" (selectionChange)="changeLang()">
      @for (lang of languages; track lang) {
        <mat-option [value]="lang.key">{{lang.label}}</mat-option>
      }
    </mat-select>
  </mat-form-field>
</mat-toolbar>
  `,
  styles: `
    mat-form-field {
      margin-left: auto;
      margin-top: 20px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent  {
  readonly #translate: TranslocoService = inject(TranslocoService);
  selectedValue: string = 'mk';
  languages = [
    {
      key: 'mk',
      label: 'Macedonian'
    },
    {
      key: 'en',
      label: 'English'
    },
    {
      key: 'al',
      label: 'Albanian'
    }
  ]

  changeLang() {
    this.#translate.setActiveLang(this.selectedValue)
  }
}
