<script setup lang="ts">
import { ref } from 'vue'
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
  Coins,
  Calendar,
  User,
  Heart
} from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { CURRENCIES } from '@/config/constants'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const workspaceStore = useWorkspaceStore()

const isResetDialogOpen = ref(false)
const saveSuccess = ref(false)
const importError = ref<string | null>(null)
const importSuccess = ref(false)

function handleSaveProfile() {
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 2500)
}

function handleExportJson() {
  const jsonStr = workspaceStore.exportData()
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `everafter-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function handleImportFile(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const result = workspaceStore.importData(content)
        if (result.success) {
          importSuccess.value = true
          importError.value = null
        } else {
          importError.value = result.error || 'Failed to import JSON data.'
        }
      }
    }
    reader.readAsText(file)
  }
}

function confirmReset() {
  isResetDialogOpen.value = true
}

function executeReset() {
  workspaceStore.resetWorkspace()
}
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Workspace Settings &amp; Data</h1>
        <p class="text-xs text-warmgray">Manage couple profiles, currency preferences, backups, and reset local demo data</p>
      </div>

      <div v-if="saveSuccess" class="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-fade">
        <Check class="w-4 h-4 text-emerald-600" />
        <span>Settings Saved!</span>
      </div>
    </div>

    <!-- Mandatory Local Storage Notice Alert -->
    <div class="p-5 rounded-2xl bg-champagne/20 dark:bg-charcoal-900 border border-gold/40 text-xs text-charcoal dark:text-ivory flex items-start gap-3">
      <ShieldCheck class="w-5 h-5 text-gold shrink-0 mt-0.5" />
      <div class="space-y-1">
        <span class="font-bold text-gold">Local Demo Architecture Notice</span>
        <p class="text-warmgray dark:text-warmgray-light leading-relaxed">
          Your demo data is stored locally in this browser. It is not synced to a server. You can export a JSON backup file below or restore previous planning data anytime.
        </p>
      </div>
    </div>

    <!-- 1. Couple Profile Section -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-champagne/30 text-xs font-semibold uppercase tracking-wider text-gold">
        <User class="w-4 h-4" />
        <span>Couple Profile</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Partner 1 Name</label>
          <input 
            v-model="workspaceStore.workspace.couple.partner1Name"
            type="text" 
            @change="handleSaveProfile"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Partner 2 Name</label>
          <input 
            v-model="workspaceStore.workspace.couple.partner2Name"
            type="text" 
            @change="handleSaveProfile"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>
      </div>

      <div class="space-y-1 text-xs">
        <label class="font-semibold text-warmgray uppercase">Wedding Title</label>
        <input 
          v-model="workspaceStore.workspace.couple.weddingTitle"
          type="text" 
          @change="handleSaveProfile"
          class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
        />
      </div>

      <div class="space-y-1 text-xs">
        <label class="font-semibold text-warmgray uppercase">Our Story / Bios</label>
        <textarea 
          v-model="workspaceStore.workspace.couple.story"
          rows="2"
          @change="handleSaveProfile"
          class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
        ></textarea>
      </div>
    </div>

    <!-- 2. Wedding Date & Destination -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-champagne/30 text-xs font-semibold uppercase tracking-wider text-gold">
        <Calendar class="w-4 h-4" />
        <span>Wedding Date &amp; Destination</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Ceremony Date</label>
          <input 
            v-model="workspaceStore.workspace.weddingDate"
            type="date" 
            @change="handleSaveProfile"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Celebration City</label>
          <input 
            v-model="workspaceStore.workspace.location.city"
            type="text" 
            @change="handleSaveProfile"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>
      </div>
    </div>

    <!-- 3. Preferences (Currency, Theme, Format) -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-champagne/30 text-xs font-semibold uppercase tracking-wider text-gold">
        <Coins class="w-4 h-4" />
        <span>Localization &amp; Theme</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Currency</label>
          <select 
            v-model="workspaceStore.workspace.budget.currency"
            @change="workspaceStore.updateBudgetTotal(workspaceStore.workspace.budget.total, workspaceStore.workspace.budget.currency)"
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          >
            <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">
              {{ c.code }} ({{ c.symbol }}) - {{ c.name }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Theme</label>
          <select 
            v-model="workspaceStore.preferences.theme"
            @change="workspaceStore.setTheme(workspaceStore.preferences.theme)"
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          >
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Date Display Format</label>
          <select 
            v-model="workspaceStore.preferences.dateFormat"
            @change="handleSaveProfile"
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (Standard)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 4. Data Management: Export, Import, Reset -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="flex items-center gap-2 pb-2 border-b border-champagne/30 text-xs font-semibold uppercase tracking-wider text-gold">
        <Download class="w-4 h-4" />
        <span>Backup, Restore &amp; Reset</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <!-- Export JSON -->
        <div class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <span class="font-serif font-bold text-sm text-charcoal dark:text-ivory block">Export Backup</span>
            <p class="text-warmgray text-[11px]">Download all workspace data as a standalone JSON file.</p>
          </div>
          <button 
            type="button" 
            @click="handleExportJson"
            class="w-full py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 font-semibold hover:border-gold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download class="w-3.5 h-3.5 text-gold" />
            <span>Download JSON</span>
          </button>
        </div>

        <!-- Import JSON -->
        <div class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <span class="font-serif font-bold text-sm text-charcoal dark:text-ivory block">Import Data</span>
            <p class="text-warmgray text-[11px]">Restore planning data from a previous JSON backup.</p>
          </div>
          <label class="w-full py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 font-semibold hover:border-gold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload class="w-3.5 h-3.5 text-gold" />
            <span>Choose JSON File</span>
            <input type="file" accept=".json" @change="handleImportFile" class="hidden" />
          </label>
        </div>

        <!-- Reset Workspace -->
        <div class="p-4 rounded-2xl bg-rose/10 border border-rose/30 space-y-2 flex flex-col justify-between">
          <div class="space-y-1">
            <span class="font-serif font-bold text-sm text-rose-dark dark:text-rose-light block">Reset Demo</span>
            <p class="text-warmgray text-[11px]">Clear current workspace and reload fresh default mock data.</p>
          </div>
          <button 
            type="button" 
            @click="confirmReset"
            class="w-full py-2 rounded-xl bg-rose-dark hover:bg-rose-dark/90 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <div v-if="importError" class="p-3 rounded-xl bg-rose/20 text-rose-dark text-xs">
        {{ importError }}
      </div>
    </div>

    <!-- Confirm Reset Dialog -->
    <ConfirmDialog 
      :is-open="isResetDialogOpen"
      title="Reset Workspace"
      message="Are you sure you want to reset your EverAfter demo workspace? All custom expenses, guests, and changes will be replaced with initial default demo data."
      confirm-text="Reset Everything"
      :is-destructive="true"
      @confirm="executeReset"
      @cancel="isResetDialogOpen = false"
    />
  </div>
</template>
