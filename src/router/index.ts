import { createRouter, createWebHistory } from 'vue-router'
import MarketingLayout from '@/components/layout/MarketingLayout.vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

import HomeView from '@/views/HomeView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import DashboardView from '@/views/DashboardView.vue'
import BudgetView from '@/views/BudgetView.vue'
import ChecklistView from '@/views/ChecklistView.vue'
import GuestsView from '@/views/GuestsView.vue'
import SeatingView from '@/views/SeatingView.vue'
import VendorsView from '@/views/VendorsView.vue'
import VenuesView from '@/views/VenuesView.vue'
import ShortlistView from '@/views/ShortlistView.vue'
import CalendarView from '@/views/CalendarView.vue'
import TimelineView from '@/views/TimelineView.vue'
import MoodboardView from '@/views/MoodboardView.vue'
import InvitationsView from '@/views/InvitationsView.vue'
import RsvpPublicView from '@/views/RsvpPublicView.vue'
import WeddingWebsiteView from '@/views/WeddingWebsiteView.vue'
import CollaborationView from '@/views/CollaborationView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // Marketing Shell
    {
      path: '/',
      component: MarketingLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { title: 'EverAfter — Premium Wedding Planning Platform' }
        },
        {
          path: 'start-planning',
          name: 'onboarding',
          component: OnboardingView,
          meta: { title: 'Start Planning — EverAfter' }
        },
        {
          path: 'rsvp/:code',
          name: 'rsvp',
          component: RsvpPublicView,
          meta: { title: 'Wedding RSVP — EverAfter' }
        }
      ]
    },

    // Planning App Dashboard Shell
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: 'Couple Dashboard — EverAfter' }
        },
        {
          path: 'timeline',
          name: 'timeline',
          component: TimelineView,
          meta: { title: 'Wedding Timeline & Schedule — EverAfter' }
        },
        {
          path: 'budget',
          name: 'budget',
          component: BudgetView,
          meta: { title: 'Budget Planner & Expenses — EverAfter' }
        },
        {
          path: 'checklist',
          name: 'checklist',
          component: ChecklistView,
          meta: { title: 'Interactive Checklist — EverAfter' }
        },
        {
          path: 'guests',
          name: 'guests',
          component: GuestsView,
          meta: { title: 'Guest List & RSVP Manager — EverAfter' }
        },
        {
          path: 'seating',
          name: 'seating',
          component: SeatingView,
          meta: { title: 'Seating Arrangement Studio — EverAfter' }
        },
        {
          path: 'vendors',
          name: 'vendors',
          component: VendorsView,
          meta: { title: 'Curated Vendor Marketplace — EverAfter' }
        },
        {
          path: 'venues',
          name: 'venues',
          component: VenuesView,
          meta: { title: 'Heritage Venues & Palaces — EverAfter' }
        },
        {
          path: 'shortlist',
          name: 'shortlist',
          component: ShortlistView,
          meta: { title: 'Vendor & Venue Shortlist — EverAfter' }
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: CalendarView,
          meta: { title: 'Master Calendar — EverAfter' }
        },
        {
          path: 'moodboard',
          name: 'moodboard',
          component: MoodboardView,
          meta: { title: 'Moodboard & Inspiration Studio — EverAfter' }
        },
        {
          path: 'invitations',
          name: 'invitations',
          component: InvitationsView,
          meta: { title: 'Digital Invitation Builder — EverAfter' }
        },
        {
          path: 'wedding-website',
          name: 'wedding-website',
          component: WeddingWebsiteView,
          meta: { title: 'Wedding Website Builder — EverAfter' }
        },
        {
          path: 'collaboration',
          name: 'collaboration',
          component: CollaborationView,
          meta: { title: 'Family & Planner Collaboration — EverAfter' }
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsView,
          meta: { title: 'Planning Reports & Analytics — EverAfter' }
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: NotificationsView,
          meta: { title: 'Notification Center — EverAfter' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
          meta: { title: 'Settings & Data Backup — EverAfter' }
        }
      ]
    },

    // Fallback
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
