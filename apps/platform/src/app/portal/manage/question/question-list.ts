import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { CategoryService } from '../../../shared/services/category.service';
import { IQuestion, ICategory } from '@devdude/common/interfaces';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-question-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './question-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageQuestionListComponent {
  private _questionService = inject(QuestionService);
  private _categoryService = inject(CategoryService);

  questions = signal<IQuestion[]>([]);
  categories = signal<Map<string, ICategory>>(new Map());
  isLoading = signal(false);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    forkJoin({
      questions: this._questionService.getAll(),
      categories: this._categoryService.getAll(),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ questions, categories }) => {
        this.questions.set(questions);
        // Create a map for easy lookup
        const catMap = new Map<string, ICategory>();
        categories.forEach((c) => catMap.set(c.id, c));
        this.categories.set(catMap);
      });
  }

  getCategoryName(id: string): string {
    return this.categories().get(id)?.name || 'Unknown Category';
  }

  deleteQuestion(id: string) {
    if (confirm('Are you sure you want to delete this question?')) {
      this._questionService.delete(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
