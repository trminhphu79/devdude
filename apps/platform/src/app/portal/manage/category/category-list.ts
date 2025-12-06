import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../shared/services/category.service';
import { TopicService } from '../../../shared/services/topic.service';
import { ICategory, ITopic } from '@devdude/common/interfaces';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCategoryListComponent {
  private _categoryService = inject(CategoryService);
  private _topicService = inject(TopicService);

  categories = signal<ICategory[]>([]);
  topics = signal<Map<string, ITopic>>(new Map());
  isLoading = signal(false);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    forkJoin({
      categories: this._categoryService.getAll(),
      topics: this._topicService.getAll(),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ categories, topics }) => {
        this.categories.set(categories);
        // Create a map for easy lookup
        const topicMap = new Map<string, ITopic>();
        topics.forEach((t) => topicMap.set(t.id, t));
        this.topics.set(topicMap);
      });
  }

  getTopicName(topicId: string): string {
    return this.topics().get(topicId)?.name || 'Unknown Topic';
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this._categoryService.delete(id).subscribe(() => {
        this.loadData(); // Reload to refresh list
      });
    }
  }
}
