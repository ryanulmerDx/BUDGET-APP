import { AppState } from '@/types';

const STORAGE_KEY = 'budget-app-data';

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getDefaultState(): AppState {
  return {
    budget: {
      monthlyIncome: 0,
      currentMonth: getCurrentMonth(),
    },
    expenses: [],
  };
}

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultState();
    }

    const parsed = JSON.parse(stored) as AppState;

    // Validate the structure
    if (!parsed.budget || !Array.isArray(parsed.expenses)) {
      console.warn('Invalid storage data, using defaults');
      return getDefaultState();
    }

    return parsed;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return getDefaultState();
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function clearAppState(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
