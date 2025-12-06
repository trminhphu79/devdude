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
import { CategoryService } from '../../../shared/services/category.service';
import { TopicService } from '../../../shared/services/topic.service';
import { ITopic } from '@devdude/common/interfaces';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCategoryFormComponent {
  private _categoryService = inject(CategoryService);
  private _topicService = inject(TopicService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  categoryId = signal<string | null>(null);
  topics = signal<ITopic[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);

  form = new FormGroup({
    topicId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.loadTopics();

    // Check if edit mode
    const id = this._route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.categoryId.set(id);
      this.loadCategory(id);
    }
  }

  loadTopics() {
    this._topicService.getAll().subscribe((topics) => {
      this.topics.set(topics);
    });
  }

  loadCategory(id: string) {
    this.isLoading.set(true);
    this._categoryService
      .getOne(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (category) => {
          this.form.patchValue({
            topicId: category.topicId,
            name: category.name,
            description: category.description,
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
    const id = this.categoryId();

    const request$ = id
      ? this._categoryService.update(id, dto)
      : this._categoryService.create(dto);

    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this._router.navigate(['/portal/manage/category']);
      },
      error: (err) => console.error('Failed to save category', err),
    });
  }
}
