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
      '--primary-bg-rgb': '26, 26, 26',
      '--secondary-bg': '#2d2d2d',
      '--text-color': '#ffffff',
      '--text-muted': '#a0a0a0',
      '--primary-color': '#333333',
      '--secondary-color': '#6c757d',
      '--accent-color': '#4a4a4a',
      '--dark-accent': '#1a1a1a',
      '--card-bg': '#333333',
      '--border-color': '#444444',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    turquoise: {
      '--primary-bg': '#064d61',
      '--primary-bg-rgb': '6, 77, 97',
      '--secondary-bg': '#064d61',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#00a6c0',
      '--secondary-color': '#83c5be',
      '--accent-color': '#20b2aa',
      '--dark-accent': '#053844',
      '--card-bg': '#006d77',
      '--border-color': '#83c5be',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    red: {
      '--primary-bg': '#7f1d1d',
      '--primary-bg-rgb': '127, 29, 29',
      '--secondary-bg': '#991b1b',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#dc2626',
      '--secondary-color': '#ef4444',
      '--accent-color': '#b91c1c',
      '--dark-accent': '#7f1d1d',
      '--card-bg': '#991b1b',
      '--border-color': '#ef4444',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    green: {
      '--primary-bg': '#064e3b',
      '--primary-bg-rgb': '6, 78, 59',
      '--secondary-bg': '#065f46',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#059669',
      '--secondary-color': '#10b981',
      '--accent-color': '#047857',
      '--dark-accent': '#064e3b',
      '--card-bg': '#065f46',
      '--border-color': '#34d399',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    purple: {
      '--primary-bg': '#2d1b69',
      '--primary-bg-rgb': '45, 27, 105',
      '--secondary-bg': '#1a103f',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#7c3aed',
      '--secondary-color': '#8b5cf6',
      '--accent-color': '#6d28d9',
      '--dark-accent': '#4c1d95',
      '--card-bg': '#5b21b6',
      '--border-color': '#8b5cf6',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    },
    blue: {
      '--primary-bg': '#1a237e',
      '--primary-bg-rgb': '26, 35, 126',
      '--secondary-bg': '#0d47a1',
      '--text-color': '#ffffff',
      '--text-muted': '#e6e6e6',
      '--primary-color': '#1e88e5',
      '--secondary-color': '#42a5f5',
      '--accent-color': '#1976d2',
      '--dark-accent': '#0d47a1',
      '--card-bg': '#1565c0',
      '--border-color': '#42a5f5',
      '--hover-color': 'rgba(255, 255, 255, 0.1)'
    }
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadTheme();
    } else {
      // Set default theme for SSR
      this.activeThemeSubject.next('dark');
    }
  }

  setTheme(theme: Theme) {
    if (typeof window === 'undefined') {
      return; // Skip during SSR
    }

    const root = document.documentElement;
    const themeVars = this.themes[theme];
    
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Always use white text
    document.body.classList.add('text-white');
    
    this.activeThemeSubject.next(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('localStorage is not available');
    }
  }

  private loadTheme() {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && this.themes[savedTheme]) {
        this.setTheme(savedTheme);
      } else {
        this.setTheme('dark');
      }
    } catch (e) {
      console.warn('localStorage is not available');
      this.setTheme('dark');
    }
  }
}
