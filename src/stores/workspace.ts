import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeddingWorkspace, UserPreferences, CoupleProfile, CurrencyCode } from '@/types'
import { defaultWorkspace, defaultPreferences } from '@/data/mockData'
import { getStoredItem, setStoredItem, clearEverAfterStorage, exportAllDataAsJson, importAllDataFromJson } from '@/utils/storage'

export const useWorkspaceStore = defineStore('workspace', () => {
  const workspace = ref<WeddingWorkspace>(getStoredItem('workspace', defaultWorkspace))
  const preferences = ref<UserPreferences>(getStoredItem('preferences', defaultPreferences))

  // Persistence helpers
  function saveWorkspace() {
    workspace.value.updatedAt = new Date().toISOString()
    setStoredItem('workspace', workspace.value)
  }

  function savePreferences() {
    setStoredItem('preferences', preferences.value)
    applyTheme()
  }

  function applyTheme() {
    const isDark = preferences.value.theme === 'dark' || 
      (preferences.value.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Getters
  const coupleNames = computed(() => {
    const { partner1Name, partner2Name } = workspace.value.couple
    if (!partner1Name && !partner2Name) return 'Our Wedding'
    if (!partner2Name) return partner1Name
    return `${partner1Name} & ${partner2Name}`
  })

  const weddingTitle = computed(() => workspace.value.couple.weddingTitle || `The Wedding of ${coupleNames.value}`)
  const weddingDate = computed(() => workspace.value.weddingDate)
  const isDateDecided = computed(() => workspace.value.isDateDecided)
  const locationDisplay = computed(() => {
    const loc = workspace.value.location
    return [loc.city, loc.state, loc.country].filter(Boolean).join(', ')
  })
  const currency = computed<CurrencyCode>(() => workspace.value.budget.currency || 'INR')

  // Actions
  function updateCouple(coupleData: Partial<CoupleProfile>) {
    workspace.value.couple = { ...workspace.value.couple, ...coupleData }
    saveWorkspace()
  }

  function updateWeddingDate(date?: string, decided: boolean = true) {
    workspace.value.weddingDate = date
    workspace.value.isDateDecided = decided
    saveWorkspace()
  }

  function updateLocation(city: string, state?: string, country: string = 'India') {
    workspace.value.location = { city, state, country }
    saveWorkspace()
  }

  function updateBudgetTotal(total: number, curr?: CurrencyCode) {
    workspace.value.budget.total = total
    if (curr) {
      workspace.value.budget.currency = curr
      preferences.value.currency = curr
      savePreferences()
    }
    saveWorkspace()
  }

  function updateGuestEstimate(total: number, p1?: number, p2?: number) {
    workspace.value.estimatedGuests = {
      total,
      partner1Count: p1,
      partner2Count: p2
    }
    saveWorkspace()
  }

  function updateCelebrationStyle(style: string) {
    workspace.value.celebrationStyle = style
    saveWorkspace()
  }

  function setTheme(theme: 'light' | 'dark' | 'system') {
    preferences.value.theme = theme
    savePreferences()
  }

  function updatePreferences(newPrefs: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...newPrefs }
    savePreferences()
  }

  function resetWorkspace() {
    clearEverAfterStorage()
    workspace.value = JSON.parse(JSON.stringify(defaultWorkspace))
    preferences.value = JSON.parse(JSON.stringify(defaultPreferences))
    saveWorkspace()
    savePreferences()
    window.location.reload()
  }

  function exportData() {
    return exportAllDataAsJson()
  }

  function importData(jsonString: string) {
    const result = importAllDataFromJson(jsonString)
    if (result.success) {
      window.location.reload()
    }
    return result
  }

  // Initialize theme
  applyTheme()

  return {
    workspace,
    preferences,
    coupleNames,
    weddingTitle,
    weddingDate,
    isDateDecided,
    locationDisplay,
    currency,
    updateCouple,
    updateWeddingDate,
    updateLocation,
    updateBudgetTotal,
    updateGuestEstimate,
    updateCelebrationStyle,
    setTheme,
    updatePreferences,
    resetWorkspace,
    exportData,
    importData
  }
})
