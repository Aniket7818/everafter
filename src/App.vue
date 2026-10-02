<script setup lang="ts">
import { onMounted } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'

const workspaceStore = useWorkspaceStore()

onMounted(() => {
  // Apply saved theme on app launch
  if (workspaceStore.preferences.theme === 'dark' || 
     (workspaceStore.preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>

<template>
  <div class="min-h-screen">
    <router-view />
  </div>
</template>
