import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getItem(key: string) {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  clearAll() {
    localStorage.clear();
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
