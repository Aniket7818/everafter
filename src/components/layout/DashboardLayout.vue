<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  X,
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
  Settings
} from 'lucide-vue-next'
import AppSidebar from '../common/AppSidebar.vue'
import AppHeader from '../common/AppHeader.vue'
import AppFooter from '../common/AppFooter.vue'
import AppLogo from '../common/AppLogo.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

// Close mobile drawer on route change
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const mobileNavigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Timeline', to: '/timeline', icon: CalendarDays },
  { name: 'Budget', to: '/budget', icon: Coins },
  { name: 'Checklist', to: '/checklist', icon: CheckSquare },
  { name: 'Guests', to: '/guests', icon: Users },
  { name: 'Seating', to: '/seating', icon: Armchair },
  { name: 'Vendors', to: '/vendors', icon: ShoppingBag },
  { name: 'Venues', to: '/venues', icon: Building2 },
  { name: 'Shortlist', to: '/shortlist', icon: BookmarkCheck },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Moodboard', to: '/moodboard', icon: Image },
  { name: 'Invitations', to: '/invitations', icon: Mail },
  { name: 'Wedding Site', to: '/wedding-website', icon: Globe },
  { name: 'Family Team', to: '/collaboration', icon: Share2 },
  { name: 'Reports', to: '/reports', icon: BarChart3 },
  { name: 'Settings', to: '/settings', icon: Settings },
]
</script>

<template>
  <div class="min-h-screen flex bg-ivory dark:bg-charcoal-900 text-charcoal dark:text-ivory transition-colors">
    <!-- Desktop Left Sidebar -->
    <AppSidebar />

    <!-- Mobile Drawer Backdrop & Menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isMobileMenuOpen" 
          class="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-xs lg:hidden"
          @click="isMobileMenuOpen = false"
        >
          <div 
            class="w-72 max-w-[85vw] h-full bg-white dark:bg-charcoal shadow-2xl flex flex-col p-6 overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between pb-6 border-b border-champagne/40 dark:border-charcoal-light/40">
              <AppLogo size="sm" />
              <button 
                type="button" 
                @click="isMobileMenuOpen = false"
                class="p-2 rounded-xl text-warmgray hover:text-charcoal dark:hover:text-white"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <nav class="flex-1 py-4 space-y-1">
              <router-link
                v-for="item in mobileNavigation"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                :class="route.path === item.to 
                  ? 'bg-gold/15 text-gold-dark dark:text-gold-light font-semibold' 
                  : 'text-warmgray hover:bg-ivory dark:hover:bg-charcoal-light'"
              >
                <component :is="item.icon" class="w-4 h-4 text-gold" />
                <span>{{ item.name }}</span>
              </router-link>
            </nav>

            <div class="pt-4 border-t border-champagne/40 dark:border-charcoal-light/40 space-y-2">
              <router-link 
                to="/" 
                class="block text-center text-xs text-warmgray hover:text-gold py-2"
              >
                ← Return to Public Homepage
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>

      <AppFooter :compact="true" />
    </div>
  </div>
</template>
