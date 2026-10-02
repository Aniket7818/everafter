<script setup lang="ts">
import { Sun, Moon, Laptop } from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()

function cycleTheme() {
  const current = workspaceStore.preferences.theme
  if (current === 'light') workspaceStore.setTheme('dark')
  else if (current === 'dark') workspaceStore.setTheme('system')
  else workspaceStore.setTheme('light')
}
</script>

<template>
  <button 
    type="button" 
    @click="cycleTheme"
    class="p-2 rounded-xl text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-ivory hover:bg-champagne/30 dark:hover:bg-charcoal-light transition-all"
    :title="`Theme: ${workspaceStore.preferences.theme} (click to change)`"
    aria-label="Toggle theme"
  >
    <Sun v-if="workspaceStore.preferences.theme === 'light'" class="w-4 h-4 text-gold" />
    <Moon v-else-if="workspaceStore.preferences.theme === 'dark'" class="w-4 h-4 text-champagne" />
    <Laptop v-else class="w-4 h-4" />
  </button>
</template>
