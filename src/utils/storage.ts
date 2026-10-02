/**
 * LocalStorage wrapper with robust JSON serialization and error fallbacks
 */

export const STORAGE_PREFIX = 'everafter_'

export function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (err) {
    console.warn(`Failed to parse stored key "${key}":`, err)
    return fallback
  }
}

export function setStoredItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`Failed to store key "${key}":`, err)
    return false
  }
}

export function removeStoredItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch (err) {
    console.error(`Failed to remove key "${key}":`, err)
  }
}

export function clearEverAfterStorage(): void {
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  } catch (err) {
    console.error('Failed to clear EverAfter storage:', err)
  }
}

export function exportAllDataAsJson(): string {
  const exportPayload: Record<string, any> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const strippedKey = key.replace(STORAGE_PREFIX, '')
      try {
        exportPayload[strippedKey] = JSON.parse(localStorage.getItem(key) || '{}')
      } catch {
        exportPayload[strippedKey] = localStorage.getItem(key)
      }
    }
  }
  return JSON.stringify(exportPayload, null, 2)
}

export function importAllDataFromJson(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Uploaded file is not a valid JSON object.' }
    }
    // Validate that it has at least a workspace or core keys
    if (!parsed.workspace && !parsed.budget && !parsed.couple) {
      return { success: false, error: 'JSON does not contain recognized EverAfter wedding data.' }
    }

    Object.entries(parsed).forEach(([k, v]) => {
      setStoredItem(k, v)
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to parse JSON file.' }
  }
}
