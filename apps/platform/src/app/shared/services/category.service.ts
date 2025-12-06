import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateCategoryDto, UpdateCategoryDto } from '@devdude/common/dtos';
import { ICategory } from '@devdude/common/interfaces';
import { APP_CONFIG } from '../utils/config.di';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly _http = inject(HttpClient);
  private readonly _appConfig = inject(APP_CONFIG);
  private readonly _baseUrl = `${this._appConfig.baseUrl}/category`;

  getAll() {
    return this._http.get<ICategory[]>(this._baseUrl);
  }

  getOne(id: string) {
    return this._http.get<ICategory>(`${this._baseUrl}/${id}`);
  }

  create(dto: CreateCategoryDto) {
    return this._http.post<ICategory>(this._baseUrl, dto);
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this._http.patch<ICategory>(`${this._baseUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this._http.delete<void>(`${this._baseUrl}/${id}`);
  }
}
