<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Menu, X, ArrowRight } from 'lucide-vue-next'
import AppLogo from '../common/AppLogo.vue'
import AppFooter from '../common/AppFooter.vue'
import ThemeToggle from '../common/ThemeToggle.vue'

const router = useRouter()
const isMobileNavOpen = ref(false)

const navLinks = [
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
  { name: 'Venues', href: '#venues' },
  { name: 'Vendors', href: '#vendors' },
  { name: 'Traditions', href: '#traditions' },
  { name: 'Inspiration', href: '#inspiration' },
  { name: 'Reviews', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
]

function navigateToPlanning() {
  router.push('/start-planning')
}

function navigateToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-ivory dark:bg-charcoal-950 text-charcoal dark:text-ivory selection:bg-gold selection:text-white transition-colors">
    <!-- 1. Top Announcement Bar -->
    <div class="w-full bg-charcoal text-ivory py-2.5 px-4 text-xs text-center border-b border-gold/30 flex items-center justify-center gap-2">
      <Sparkles class="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
      <span>
        Experience <strong>EverAfter 2026</strong> — Tailored for multi-day Indian &amp; modern celebrations.
      </span>
      <router-link to="/start-planning" class="underline underline-offset-2 hover:text-gold font-medium ml-1">
        Start Free Plan →
      </router-link>
    </div>

    <!-- 2. Premium Navbar -->
    <header class="sticky top-0 z-40 bg-white/85 dark:bg-charcoal/85 backdrop-blur-md border-b border-champagne/40 dark:border-charcoal-light/40 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/">
          <AppLogo size="md" />
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-warmgray dark:text-warmgray-light">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href"
            class="hover:text-gold dark:hover:text-gold-light transition-colors"
          >
            {{ link.name }}
          </a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          
          <button 
            type="button" 
            @click="navigateToDashboard"
            class="px-4 py-2 text-xs font-semibold text-charcoal dark:text-ivory hover:text-gold transition-colors"
          >
            Demo Workspace
          </button>

          <button 
            type="button" 
            @click="navigateToPlanning"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold hover:bg-gold-dark text-white shadow-soft transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Start Planning</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Mobile Menu Trigger -->
        <div class="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button 
            type="button" 
            @click="isMobileNavOpen = !isMobileNavOpen"
            class="p-2 text-warmgray hover:text-charcoal dark:hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu v-if="!isMobileNavOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div 
        v-if="isMobileNavOpen"
        class="sm:hidden px-4 pt-2 pb-6 bg-white dark:bg-charcoal border-b border-champagne/40 dark:border-charcoal-light/40 space-y-3"
      >
        <div class="grid grid-cols-2 gap-2 text-sm font-medium text-warmgray dark:text-warmgray-light">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href"
            @click="isMobileNavOpen = false"
            class="p-2 rounded-lg hover:bg-ivory dark:hover:bg-charcoal-light"
          >
            {{ link.name }}
          </a>
        </div>
        <div class="pt-3 border-t border-champagne/30 dark:border-charcoal-light/30 flex flex-col gap-2">
          <button 
            type="button" 
            @click="navigateToDashboard(); isMobileNavOpen = false"
            class="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-ivory dark:bg-charcoal-light text-charcoal dark:text-ivory"
          >
            Open Demo Workspace
          </button>
          <button 
            type="button" 
            @click="navigateToPlanning(); isMobileNavOpen = false"
            class="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gold text-white"
          >
            Start Your Wedding Plan
          </button>
        </div>
      </div>
    </header>

    <!-- Main Marketing Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Full Marketing Footer -->
    <AppFooter :compact="false" />
  </div>
</template>
