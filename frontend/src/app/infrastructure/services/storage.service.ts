import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  save<T>(key: string, data: T): Observable<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return of(undefined);
    } catch (error) {
      throw new Error(`Failed to save data: ${error}`);
    }
  }

  get<T>(key: string): Observable<T | null> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return of(null);
      return of(JSON.parse(data));
    } catch (error) {
      return of(null);
    }
  }

  remove(key: string): Observable<void> {
    try {
      localStorage.removeItem(key);
      return of(undefined);
    } catch (error) {
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  clear(): Observable<void> {
    try {
      localStorage.clear();
      return of(undefined);
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }
}