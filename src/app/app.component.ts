import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { StoreService } from './store.service';

import { TableComponent } from './components/table.component';
import { ActivityFormComponent } from './components/activity-form.component';
import { HeadingComponent } from './components/heading.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeadingComponent,
    TableComponent,
    ActivityFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'IGAdmin';
  readonly #storeService: StoreService = inject(StoreService);

  ngOnInit() {
    this.#storeService.fetchActivities();
  }
}
