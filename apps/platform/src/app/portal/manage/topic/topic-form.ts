import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TopicService } from '../../../shared/services/topic.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-topic-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './topic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTopicFormComponent {
  private _topicService = inject(TopicService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  topicId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    // Check if edit mode
    const id = this._route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.topicId.set(id);
      this.loadTopic(id);
    }
  }

  loadTopic(id: string) {
    this.isLoading.set(true);
    this._topicService
      .getOne(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (topic) => {
          this.form.patchValue({
            name: topic.name,
            description: topic.description,
            isActive: topic.isActive,
          });
        },
        error: () =>
          this._router.navigate(['../'], { relativeTo: this._route }),
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const dto = this.form.getRawValue();
    const id = this.topicId();

    const request$ = id
      ? this._topicService.update(id, dto)
      : this._topicService.create(dto);

    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this._router.navigate(['/portal/manage/topic']);
      },
      error: (err) => console.error('Failed to save topic', err),
    });
  }
}
