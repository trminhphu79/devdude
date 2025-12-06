import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateQuestionDto, UpdateQuestionDto } from '@devdude/common/dtos';
import { IQuestion } from '@devdude/common/interfaces';
import { APP_CONFIG } from '../utils/config.di';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly _http = inject(HttpClient);
  private readonly _appConfig = inject(APP_CONFIG);
  private readonly _baseUrl = `${this._appConfig.baseUrl}/question`;

  getAll(filters?: {
    categoryId?: string;
    type?: string;
    difficultyLevel?: string;
  }) {
    let params = new HttpParams();
    if (filters?.categoryId)
      params = params.set('categoryId', filters.categoryId);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.difficultyLevel)
      params = params.set('difficultyLevel', filters.difficultyLevel);

    return this._http.get<IQuestion[]>(this._baseUrl, { params });
  }

  getOne(id: string) {
    return this._http.get<IQuestion>(`${this._baseUrl}/${id}`);
  }

  create(dto: CreateQuestionDto) {
    return this._http.post<IQuestion>(this._baseUrl, dto);
  }

  update(id: string, dto: UpdateQuestionDto) {
    return this._http.patch<IQuestion>(`${this._baseUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
