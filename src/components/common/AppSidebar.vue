<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  CalendarDays,
  Coins,
  CheckSquare,
  Users,
  Armchair,
  ShoppingBag,
  Building2,
  BookmarkCheck,
  Calendar,
  Image,
  Mail,
  Globe,
  Share2,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next'
import AppLogo from './AppLogo.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const route = useRoute()
const workspaceStore = useWorkspaceStore()

const navigationItems = [
  { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Wedding Timeline', to: '/timeline', icon: CalendarDays },
  { name: 'Budget Planner', to: '/budget', icon: Coins },
  { name: 'Checklist', to: '/checklist', icon: CheckSquare },
  { name: 'Guest List & RSVP', to: '/guests', icon: Users },
  { name: 'Seating Studio', to: '/seating', icon: Armchair },
  { name: 'Curated Vendors', to: '/vendors', icon: ShoppingBag },
  { name: 'Heritage Venues', to: '/venues', icon: Building2 },
  { name: 'Shortlist & Compare', to: '/shortlist', icon: BookmarkCheck },
  { name: 'Master Calendar', to: '/calendar', icon: Calendar },
  { name: 'Moodboard Studio', to: '/moodboard', icon: Image },
  { name: 'Digital Invitations', to: '/invitations', icon: Mail },
  { name: 'Wedding Website', to: '/wedding-website', icon: Globe },
  { name: 'Family Team', to: '/collaboration', icon: Share2 },
  { name: 'Planning Reports', to: '/reports', icon: BarChart3 },
  { name: 'Settings & Data', to: '/settings', icon: Settings },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="w-64 h-screen sticky top-0 hidden lg:flex flex-col bg-white dark:bg-charcoal border-r border-champagne/40 dark:border-charcoal-light/40 select-none z-30 transition-colors">
    <!-- Sidebar Header with Logo -->
    <div class="p-6 border-b border-champagne/30 dark:border-charcoal-light/30 flex items-center justify-between">
      <router-link to="/dashboard">
        <AppLogo size="sm" />
      </router-link>
      <router-link 
        to="/" 
        title="View Public Homepage"
        class="p-1.5 rounded-lg text-warmgray hover:text-gold dark:text-warmgray-light dark:hover:text-gold transition-colors"
      >
        <ExternalLink class="w-4 h-4" />
      </router-link>
    </div>

    <!-- Active Wedding Summary Card in Sidebar -->
    <div class="px-4 pt-4 pb-2">
      <div class="p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light/40">
        <div class="flex items-center gap-2 text-xs font-semibold text-gold dark:text-gold-light uppercase tracking-wider mb-1">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Active Wedding</span>
        </div>
        <div class="font-serif font-semibold text-sm text-charcoal dark:text-ivory truncate">
          {{ workspaceStore.coupleNames }}
        </div>
        <div class="text-[11px] text-warmgray dark:text-warmgray-light truncate mt-0.5">
          {{ workspaceStore.workspace.location.city || 'Udaipur' }} • {{ workspaceStore.workspace.weddingDate || 'Date TBD' }}
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <router-link
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group"
        :class="isActive(item.to) 
          ? 'bg-gold/15 text-gold-dark dark:text-gold-light font-semibold shadow-xs' 
          : 'text-warmgray-dark dark:text-warmgray-light hover:bg-ivory dark:hover:bg-charcoal-light/40 hover:text-charcoal dark:hover:text-white'"
      >
        <component 
          :is="item.icon" 
          class="w-4 h-4 transition-colors" 
          :class="isActive(item.to) ? 'text-gold' : 'text-warmgray dark:text-warmgray-light group-hover:text-charcoal dark:group-hover:text-white'" 
        />
        <span class="truncate">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-champagne/30 dark:border-charcoal-light/30 flex items-center justify-between text-xs text-warmgray dark:text-warmgray-light">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-mono text-[11px]">Local Demo</span>
      </div>
      <router-link to="/start-planning" class="hover:text-gold text-[11px] font-medium transition-colors">
        + New Plan
      </router-link>
    </div>
  </aside>
</template>
