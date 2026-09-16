// Authentication helper for Asqi's Private Dashboard - Cloud Firestore Synchronized
import {
  saveSecurityPINToFirestore,
  getSecurityPINFromFirestore,
  subscribeToSecurityPIN,
} from '../lib/firebase';

const AUTH_KEY = 'asqi_admin_authenticated';
const PIN_KEY = 'asqi_admin_pin';
const DEFAULT_PIN = 'asqi2026';

// In-memory synchronized state across all devices
let activeSecurityPIN: string = DEFAULT_PIN;
let isInitialized = false;

// Check legacy localStorage and migrate to Firestore if user had custom PIN
function initSecuritySync() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  try {
    const legacySavedPin = localStorage.getItem(PIN_KEY);
    if (legacySavedPin && legacySavedPin.trim() !== '' && legacySavedPin.trim() !== DEFAULT_PIN) {
      activeSecurityPIN = legacySavedPin.trim();
      // Auto-migrate to Cloud Firestore
      saveSecurityPINToFirestore(legacySavedPin.trim()).catch(console.warn);
    }
    // Clean up localStorage
    localStorage.removeItem(PIN_KEY);
  } catch {
    // ignore
  }

  // Subscribe to real-time Firestore updates
  try {
    subscribeToSecurityPIN((cloudPin) => {
      activeSecurityPIN = cloudPin;
    });
  } catch (err) {
    console.warn('Could not initialize security PIN realtime listener:', err);
  }
}

// Initialize listener right away
initSecuritySync();

/**
 * Returns currently synchronized PIN
 */
export function getStoredPIN(): string {
  return activeSecurityPIN || DEFAULT_PIN;
}

/**
 * Fetches latest PIN directly from Cloud Firestore (useful before password changes)
 */
export async function fetchFreshPIN(): Promise<string> {
  try {
    const cloudPin = await getSecurityPINFromFirestore();
    if (cloudPin) {
      activeSecurityPIN = cloudPin;
      return cloudPin;
    }
  } catch {
    // fallback
  }
  return activeSecurityPIN || DEFAULT_PIN;
}

/**
 * Updates PIN directly on Google Cloud Firestore so it syncs across all devices (HP, laptop, tablet)
 */
export async function updateStoredPIN(newPin: string): Promise<boolean> {
  try {
    const trimmed = newPin.trim();
    if (!trimmed || trimmed.length < 4) {
      throw new Error('PIN minimal 4 karakter');
    }

    activeSecurityPIN = trimmed;

    // Save directly to Cloud Firestore
    await saveSecurityPINToFirestore(trimmed);

    // Clean up any legacy localStorage
    try {
      localStorage.removeItem(PIN_KEY);
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to update PIN to Cloud Firestore:', err);
    return false;
  }
}

/**
 * Verifies PIN asynchronously with Cloud Firestore
 */
export async function verifyPIN(enteredPin: string): Promise<boolean> {
  const trimmed = enteredPin.trim();
  if (!trimmed) return false;

  // 1. Fast check against current active in-memory PIN
  if (trimmed === activeSecurityPIN) {
    return true;
  }

  // 2. Direct cloud check to ensure recent updates from other devices are honored
  try {
    const freshPin = await fetchFreshPIN();
    return trimmed === freshPin;
  } catch {
    return false;
  }
}

/**
 * Synchronous PIN check fallback
 */
export function verifyPINSync(enteredPin: string): boolean {
  return enteredPin.trim() === activeSecurityPIN;
}

export function checkIsAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAuthenticatedSession(status: boolean): void {
  try {
    if (status) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

