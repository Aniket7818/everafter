<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  Search,
  Plus,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Calendar,
  Check,
  ChevronDown
} from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { useNotificationStore } from '@/stores/notifications'
import ThemeToggle from './ThemeToggle.vue'
import Modal from './Modal.vue'
import AppLogo from './AppLogo.vue'

const emit = defineEmits<{
  (e: 'toggle-mobile-menu'): void
}>()

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const notificationStore = useNotificationStore()

const isSearchOpen = ref(false)
const searchQuery = ref('')
const isQuickCreateOpen = ref(false)
const isNotificationsOpen = ref(false)
const isHelpOpen = ref(false)

const quickCreateActions = [
  { label: 'Add Expense', icon: 'Coins', to: '/budget?action=new-expense' },
  { label: 'Add Guest', icon: 'Users', to: '/guests?action=new-guest' },
  { label: 'Create Task', icon: 'CheckSquare', to: '/checklist?action=new-task' },
  { label: 'Add Function / Event', icon: 'Calendar', to: '/timeline?action=new-event' },
  { label: 'Find Vendors', icon: 'ShoppingBag', to: '/vendors' },
  { label: 'Design Invitation', icon: 'Mail', to: '/invitations' },
]

function handleQuickAction(to: string) {
  isQuickCreateOpen.value = false
  router.push(to)
}

function handleSearchSelect(route: string) {
  isSearchOpen.value = false
  searchQuery.value = ''
  router.push(route)
}

const searchableItems = [
  { title: 'Budget Planner & Allocations', desc: 'Expenses, budget limits and payments', route: '/budget' },
  { title: 'Interactive Wedding Checklist', desc: 'Tasks, subtasks, deadlines', route: '/checklist' },
  { title: 'Guest List & RSVP Manager', desc: 'Attendance, dietary requirements, table seating', route: '/guests' },
  { title: 'Seating Arrangement Studio', desc: 'Interactive tables, floor plan assignments', route: '/seating' },
  { title: 'Vendor Marketplace & Directory', desc: 'Photographers, caterers, decorators, mehendi artists', route: '/vendors' },
  { title: 'Heritage Venues Discovery', desc: 'Palaces, resorts, banquet lawns, pricing', route: '/venues' },
  { title: 'Vendor & Venue Shortlist', desc: 'Compare up to 4 shortlisted vendors side-by-side', route: '/shortlist' },
  { title: 'Wedding Timeline & Functions', desc: 'Multi-day schedule: Haldi, Mehendi, Sangeet, Pheras', route: '/timeline' },
  { title: 'Full Master Calendar', desc: 'Deadlines, appointments, reminders', route: '/calendar' },
  { title: 'Moodboard & Visual Inspiration', desc: 'Color palettes, mandap styles, bridal couture', route: '/moodboard' },
  { title: 'Digital Invitation Builder', desc: 'Customize elegant wedding cards & templates', route: '/invitations' },
  { title: 'Wedding Website Builder', desc: 'No-code couple microsite with love story & schedule', route: '/wedding-website' },
  { title: 'Family Collaboration Hub', desc: 'Assign roles, shared task feed, activity history', route: '/collaboration' },
  { title: 'Comprehensive Planning Reports', desc: 'Printable financial reports, guest counts, exports', route: '/reports' },
  { title: 'Settings, Backups & Reset', desc: 'Export JSON, import data, reset demo workspace', route: '/settings' }
]

const filteredSearchItems = () => {
  if (!searchQuery.value.trim()) return searchableItems.slice(0, 6)
  const q = searchQuery.value.toLowerCase()
  return searchableItems.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
}
</script>

<template>
  <header class="h-16 px-4 sm:px-6 sticky top-0 z-20 bg-white/95 dark:bg-charcoal/95 backdrop-blur-md border-b border-champagne/40 dark:border-charcoal-light/40 flex items-center justify-between transition-colors">
    <!-- Left: Mobile Menu Toggle & Wedding Switcher -->
    <div class="flex items-center gap-3">
      <button 
        type="button" 
        @click="emit('toggle-mobile-menu')"
        class="lg:hidden p-2 rounded-xl text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-ivory hover:bg-champagne/20 transition-colors"
        aria-label="Toggle navigation menu"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="lg:hidden">
        <AppLogo size="sm" />
      </div>

      <!-- Wedding Selector Pill -->
      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light text-xs">
        <span class="w-2 h-2 rounded-full bg-gold"></span>
        <span class="font-serif font-semibold text-charcoal dark:text-ivory truncate max-w-[200px] md:max-w-xs">
          {{ workspaceStore.coupleNames }}
        </span>
        <span class="text-warmgray dark:text-warmgray-light text-[10px] hidden md:inline">
          ({{ workspaceStore.workspace.weddingDate || 'Date TBD' }})
        </span>
      </div>
    </div>

    <!-- Center/Right: Actions -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Search Trigger Button -->
      <button 
        type="button" 
        @click="isSearchOpen = true"
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ivory/80 dark:bg-charcoal-900/80 border border-champagne/40 dark:border-charcoal-light text-xs text-warmgray dark:text-warmgray-light hover:border-gold/50 transition-all"
        title="Quick search (Ctrl+K)"
      >
        <Search class="w-3.5 h-3.5" />
        <span class="hidden md:inline">Search workspace...</span>
        <kbd class="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-charcoal border border-champagne/30 text-warmgray">⌘K</kbd>
      </button>

      <!-- Quick Create Button -->
      <div class="relative">
        <button 
          type="button" 
          @click="isQuickCreateOpen = !isQuickCreateOpen"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Create</span>
        </button>

        <!-- Quick Create Dropdown Menu -->
        <div 
          v-if="isQuickCreateOpen" 
          class="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-charcoal shadow-2xl border border-champagne/40 dark:border-charcoal-light p-2 z-40"
        >
          <div class="px-3 py-1.5 text-[10px] font-semibold text-warmgray uppercase tracking-widest border-b border-champagne/30 dark:border-charcoal-light/40">
            Quick Actions
          </div>
          <button
            v-for="act in quickCreateActions"
            :key="act.label"
            type="button"
            @click="handleQuickAction(act.to)"
            class="w-full text-left px-3 py-2 rounded-xl text-xs text-charcoal dark:text-ivory hover:bg-ivory dark:hover:bg-charcoal-light flex items-center justify-between transition-colors"
          >
            <span>{{ act.label }}</span>
            <ChevronDown class="w-3.5 h-3.5 -rotate-90 text-warmgray" />
          </button>
        </div>
      </div>

      <!-- Notifications Bell -->
      <div class="relative">
        <button 
          type="button" 
          @click="isNotificationsOpen = !isNotificationsOpen"
          class="relative p-2 rounded-xl text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-ivory hover:bg-champagne/30 dark:hover:bg-charcoal-light transition-colors"
          aria-label="View notifications"
        >
          <Bell class="w-4 h-4" />
          <span 
            v-if="notificationStore.unreadCount > 0"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-dark animate-ping"
          ></span>
          <span 
            v-if="notificationStore.unreadCount > 0"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-dark"
          ></span>
        </button>

        <!-- Notifications Flyout -->
        <div 
          v-if="isNotificationsOpen"
          class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-charcoal shadow-2xl border border-champagne/40 dark:border-charcoal-light p-3 z-40"
        >
          <div class="flex items-center justify-between pb-2 border-b border-champagne/30 dark:border-charcoal-light/40">
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-ivory">Notifications</span>
            <button 
              type="button" 
              @click="notificationStore.markAllAsRead" 
              class="text-[11px] text-gold hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div class="max-h-72 overflow-y-auto divide-y divide-champagne/20 dark:divide-charcoal-light/20 py-1">
            <div 
              v-for="notif in notificationStore.notifications.slice(0, 5)"
              :key="notif.id"
              class="py-2.5 px-2 hover:bg-ivory/60 dark:hover:bg-charcoal-900 rounded-xl transition-colors cursor-pointer"
              @click="router.push(notif.actionUrl || '/notifications'); isNotificationsOpen = false"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="text-xs font-semibold text-charcoal dark:text-ivory" :class="{ 'text-gold': !notif.read }">
                  {{ notif.title }}
                </span>
                <span class="text-[10px] text-warmgray">{{ notif.createdAt }}</span>
              </div>
              <p class="text-xs text-warmgray dark:text-warmgray-light mt-0.5 line-clamp-2">
                {{ notif.message }}
              </p>
            </div>
          </div>

          <div class="pt-2 border-t border-champagne/30 dark:border-charcoal-light/40 text-center">
            <router-link 
              to="/notifications" 
              @click="isNotificationsOpen = false"
              class="text-xs text-gold font-medium hover:underline"
            >
              View all notifications →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Theme Switcher -->
      <ThemeToggle />

      <!-- Help Button -->
      <button 
        type="button" 
        @click="isHelpOpen = true"
        class="p-2 rounded-xl text-warmgray hover:text-charcoal dark:text-warmgray-light dark:hover:text-ivory hover:bg-champagne/30 dark:hover:bg-charcoal-light transition-colors"
        title="About this EverAfter Demo"
        aria-label="Demo info"
      >
        <HelpCircle class="w-4 h-4" />
      </button>

      <!-- Couple Initials Badge -->
      <div class="w-8 h-8 rounded-full bg-champagne-light dark:bg-charcoal-light border border-gold/40 flex items-center justify-center font-serif text-xs font-bold text-gold-dark dark:text-gold-light select-none">
        {{ workspaceStore.workspace.couple.partner1Name?.[0] || 'A' }}&amp;{{ workspaceStore.workspace.couple.partner2Name?.[0] || 'R' }}
      </div>
    </div>

    <!-- Search Modal -->
    <Modal :is-open="isSearchOpen" size="lg" @close="isSearchOpen = false">
      <template #header>
        <div class="flex items-center gap-3 w-full pr-6">
          <Search class="w-5 h-5 text-gold shrink-0" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search workspaces, pages, budget, guests, vendors..."
            class="w-full bg-transparent border-none text-base focus:outline-hidden text-charcoal dark:text-ivory placeholder-warmgray"
            autofocus
          />
        </div>
      </template>

      <div class="space-y-2">
        <div class="text-[11px] font-semibold text-warmgray uppercase tracking-widest px-2">
          Suggestions &amp; Sections
        </div>
        <div class="space-y-1">
          <div 
            v-for="item in filteredSearchItems()"
            :key="item.route"
            @click="handleSearchSelect(item.route)"
            class="p-3 rounded-xl hover:bg-ivory dark:hover:bg-charcoal-light/50 cursor-pointer flex items-center justify-between transition-colors group"
          >
            <div>
              <div class="text-sm font-semibold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
                {{ item.title }}
              </div>
              <div class="text-xs text-warmgray dark:text-warmgray-light">
                {{ item.desc }}
              </div>
            </div>
            <span class="text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Help / About Demo Modal -->
    <Modal :is-open="isHelpOpen" title="About the EverAfter Planning Suite" size="md" @close="isHelpOpen = false">
      <div class="space-y-4 text-sm text-warmgray dark:text-warmgray-light leading-relaxed">
        <p>
          <strong class="text-charcoal dark:text-ivory">EverAfter</strong> is an editorial-grade wedding planning application built with Vue 3, TypeScript, Tailwind CSS, Pinia, and FullCalendar.
        </p>
        <div class="p-4 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light text-xs space-y-2">
          <div class="font-semibold text-gold">Local Demo Notice:</div>
          <p>
            All vendors, venues, guests, expenses, and RSVP submissions are stored locally in your browser’s LocalStorage. No live payment gateways or external server sync are executed.
          </p>
          <p>
            You can export your workspace data as a JSON file anytime from <router-link to="/settings" @click="isHelpOpen = false" class="text-gold underline">Settings</router-link>, or reset back to default demo state.
          </p>
        </div>
        <div class="text-xs text-warmgray-dark dark:text-warmgray-light">
          Crafted with care by <strong>Infinvo Tech</strong>.
        </div>
      </div>
      <template #footer>
        <button 
          type="button" 
          @click="isHelpOpen = false" 
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-dark text-white transition-all shadow-sm"
        >
          Got it
        </button>
      </template>
    </Modal>
  </header>
</template>
