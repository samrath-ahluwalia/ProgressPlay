import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  get(key: string, isObject: boolean): any {
    if (!this.isBrowser) {
      return null; // Return null during SSR
    }

    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      return isObject ? JSON.parse(value) : value;
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
      return null;
    }
  }

  set(key: string, value: any, isObject: boolean) {
    if (!this.isBrowser) {
      return; // Skip during SSR
    }

    try {
      const data = isObject ? JSON.stringify(value) : value;
      localStorage.setItem(key, data);
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }

  delete(key: string) {
    if (!this.isBrowser) {
      return; // Skip during SSR
    }

    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }
  }
}
