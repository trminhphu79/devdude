import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopicService } from '../../../shared/services/topic.service';
import { ITopic } from '@devdude/common/interfaces';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-manage-topic-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './topic-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTopicListComponent {
  private _topicService = inject(TopicService);

  topics = signal<ITopic[]>([]);
  isLoading = signal(false);

  constructor() {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading.set(true);
    this._topicService
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => this.topics.set(data));
  }

  deleteTopic(id: string) {
    if (confirm('Are you sure you want to delete this topic?')) {
      this._topicService.delete(id).subscribe(() => {
        this.loadTopics();
      });
    }
  }
}
