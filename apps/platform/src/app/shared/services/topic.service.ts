import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTopicDto, UpdateTopicDto } from '@devdude/common/dtos';
import { ITopic } from '@devdude/common/interfaces';
import { APP_CONFIG } from '../utils/config.di';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private readonly _http = inject(HttpClient);
  private readonly _appConfig = inject(APP_CONFIG);
  private readonly _baseUrl = `${this._appConfig.baseUrl}/topic`;

  getAll() {
    return this._http.get<ITopic[]>(this._baseUrl);
  }

  getOne(id: string) {
    return this._http.get<ITopic>(`${this._baseUrl}/${id}`);
  }

  create(dto: CreateTopicDto) {
    return this._http.post<ITopic>(this._baseUrl, dto);
  }

  update(id: string, dto: UpdateTopicDto) {
    return this._http.patch<ITopic>(`${this._baseUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
