import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionService } from '../../../shared/services/question.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ICategory } from '@devdude/common/interfaces';
import { QuestionType, DifficultyLevel } from '@devdude/common/enums';
import { finalize } from 'rxjs';
import { AdminAuthStore } from '../../../shared/store/admin-auth';
import { CreateQuestionDto, UpdateQuestionDto } from '@devdude/common/dtos';

@Component({
  selector: 'app-manage-question-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './question-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageQuestionFormComponent {
  private _questionService = inject(QuestionService);
  private _categoryService = inject(CategoryService);
  private _authStore = inject(AdminAuthStore);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  questionId = signal<string | null>(null);
  categories = signal<ICategory[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);

  // Enums for template
  QuestionTypes = Object.values(QuestionType);
  DifficultyLevels = Object.values(DifficultyLevel);

  form = new FormGroup({
    categoryId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<QuestionType>(QuestionType.SINGLE_CHOICE, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    difficultyLevel: new FormControl<DifficultyLevel>(DifficultyLevel.JUNIOR, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    weight: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    timeLimitSec: new FormControl(60, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    content: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    explanation: new FormControl('', { nonNullable: true }),
    options: new FormArray<FormGroup>([]),
  });

  constructor() {
    this.loadCategories();

    // Check if edit mode
    const id = this._route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.questionId.set(id);
      this.loadQuestion(id);
    } else {
      // Add default options for new question
      this.addOption();
      this.addOption();
    }
  }

  get options() {
    return this.form.controls.options as FormArray<FormGroup>;
  }

  addOption(text = '', isCorrect = false) {
    const optionForm = new FormGroup({
      text: new FormControl(text, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isCorrect: new FormControl(isCorrect, { nonNullable: true }),
    });
    this.options.push(optionForm);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  loadCategories() {
    this._categoryService.getAll().subscribe((cats) => {
      this.categories.set(cats);
    });
  }

  loadQuestion(id: string) {
    this.isLoading.set(true);
    this._questionService
      .getOne(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (question) => {
          this.form.patchValue({
            categoryId: question.categoryId,
            type: question.type as QuestionType,
            difficultyLevel: question.difficultyLevel as DifficultyLevel,
            weight: question.weight,
            timeLimitSec: question.timeLimitSec,
            content: question.content,
            explanation: question.explanation,
          });

          // Clear existing options
          this.options.clear();

          // Add options from question
          if (question.options && question.options.length > 0) {
            question.options.forEach((opt) => {
              this.addOption(opt.text, opt.isCorrect);
            });
          } else {
            this.addOption(); // fallback
          }
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
    const formValue = this.form.getRawValue();
    const id = this.questionId();
    const userId = this._authStore.state().account.id;

    // Construct DTO
    const dto: any = {
      ...formValue,
      createdBy: userId,
      // Map options to match CreateAnswerOptionDto
      options: formValue.options.map((o: any) => ({
        text: o.text,
        isCorrect: o.isCorrect,
      })),
    };

    const request$ = id
      ? this._questionService.update(id, dto as UpdateQuestionDto)
      : this._questionService.create(dto as CreateQuestionDto);

    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this._router.navigate(['/portal/manage/question']);
      },
      error: (err) => console.error('Failed to save question', err),
    });
  }
}
