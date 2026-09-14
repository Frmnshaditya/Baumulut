// Authentication helper for Asqi's Private Dashboard

const AUTH_KEY = 'asqi_admin_authenticated';
const PIN_KEY = 'asqi_admin_pin';
const DEFAULT_PIN = 'asqi2026';

export function getStoredPIN(): string {
  try {
    const saved = localStorage.getItem(PIN_KEY);
    return saved && saved.trim() !== '' ? saved : DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function updateStoredPIN(newPin: string): boolean {
  try {
    if (!newPin || newPin.trim().length < 4) {
      throw new Error('PIN minimal 4 karakter');
    }
    localStorage.setItem(PIN_KEY, newPin.trim());
    return true;
  } catch {
    return false;
  }
}

export function verifyPIN(enteredPin: string): boolean {
  const currentPin = getStoredPIN();
  return enteredPin.trim() === currentPin;
}

export function checkIsAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAuthenticatedSession(status: boolean): void {
  try {
    if (status) {
      localStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // ignore
  }
}
