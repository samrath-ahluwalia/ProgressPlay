import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'turquoise' | 'red' | 'green' | 'purple' | 'blue';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeThemeSubject = new BehaviorSubject<Theme>('dark');
  activeTheme$ = this.activeThemeSubject.asObservable();

  private themes: Record<Theme, Record<string, string>> = {
    dark: {
      '--primary-bg': '#1a1a1a',
      '--secondary-bg': '#2d2d2d',
      '--text-color': '#ffffff',
      '--text-muted': '#a0a0a0',
      '--primary-color': '#007bff',
      '--secondary-color': '#6c757d',
      '--accent-color': '#17a2b8',
      '--card-bg': '#333333',
      '--border-color': '#444444',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    turquoise: {
      '--primary-bg': '#006d77',
      '--secondary-bg': '#83c5be',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#00b4d8',
      '--secondary-color': '#48cae4',
      '--accent-color': '#90e0ef',
      '--card-bg': '#005f73',
      '--border-color': '#0077b6',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    red: {
      '--primary-bg': '#7f1d1d',
      '--secondary-bg': '#991b1b',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#dc2626',
      '--secondary-color': '#ef4444',
      '--accent-color': '#f87171',
      '--card-bg': '#b91c1c',
      '--border-color': '#7f1d1d',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    green: {
      '--primary-bg': '#065f46',
      '--secondary-bg': '#047857',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#10b981',
      '--secondary-color': '#34d399',
      '--accent-color': '#6ee7b7',
      '--card-bg': '#059669',
      '--border-color': '#065f46',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    purple: {
      '--primary-bg': '#2d1b69',
      '--secondary-bg': '#1a103f',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#9c27b0',
      '--secondary-color': '#ba68c8',
      '--accent-color': '#e1bee7',
      '--card-bg': '#3d2b89',
      '--border-color': '#4a148c',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    blue: {
      '--primary-bg': '#1a237e',
      '--secondary-bg': '#0d47a1',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#2196f3',
      '--secondary-color': '#64b5f6',
      '--accent-color': '#bbdefb',
      '--card-bg': '#283593',
      '--border-color': '#1565c0',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    }
  };

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: Theme) {
    const root = document.documentElement;
    const themeVars = this.themes[theme];
    
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Always use white text
    document.body.classList.add('text-white');
    
    this.activeThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('dark');
    }
  }
}
