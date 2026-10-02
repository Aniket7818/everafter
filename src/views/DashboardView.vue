<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Clock,
  MapPin,
  Coins,
  Users,
  CheckSquare,
  ArrowRight,
  Plus,
  Sparkles,
  ShoppingBag,
  Building2,
  BookmarkCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-vue-next'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBudgetStore } from '@/stores/budget'
import { useChecklistStore } from '@/stores/checklist'
import { useGuestStore } from '@/stores/guests'
import { useTimelineStore } from '@/stores/timeline'
import { useVendorStore } from '@/stores/vendors'
import { useCollaborationStore } from '@/stores/collaboration'
import MetricCard from '@/components/common/MetricCard.vue'
import BudgetDonutChart from '@/components/charts/BudgetDonutChart.vue'
import { formatCurrency, formatCompactCurrency } from '@/utils/currency'
import { formatDate, getCountdownParts } from '@/utils/date'

const router = useRouter()
const workspaceStore = useWorkspaceStore()
const budgetStore = useBudgetStore()
const checklistStore = useChecklistStore()
const guestStore = useGuestStore()
const timelineStore = useTimelineStore()
const vendorStore = useVendorStore()
const collabStore = useCollaborationStore()

const countdown = computed(() => {
  return getCountdownParts(workspaceStore.weddingDate)
})

const quickActions = [
  { label: 'Add Expense', icon: Coins, to: '/budget?action=new-expense', color: 'bg-gold/15 text-gold-dark dark:text-gold-light' },
  { label: 'Add Guest', icon: Users, to: '/guests?action=new-guest', color: 'bg-sage/20 text-sage-dark dark:text-sage-light' },
  { label: 'Find Vendor', icon: ShoppingBag, to: '/vendors', color: 'bg-rose/20 text-rose-dark dark:text-rose-light' },
  { label: 'Create Task', icon: CheckSquare, to: '/checklist?action=new-task', color: 'bg-champagne/40 text-charcoal dark:text-ivory' },
  { label: 'Add Event', icon: Calendar, to: '/timeline?action=new-event', color: 'bg-gold/15 text-gold-dark dark:text-gold-light' },
  { label: 'Shortlist', icon: BookmarkCheck, to: '/shortlist', color: 'bg-sage/20 text-sage-dark dark:text-sage-light' },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Header Hero Banner with Couple Info & Live Countdown -->
    <div class="relative overflow-hidden rounded-3xl bg-[#1C1A19] bg-gradient-to-r from-[#1C1A19] via-charcoal to-[#1C1A19] text-ivory p-6 sm:p-8 lg:p-10 shadow-luxury border border-gold/40">
      <!-- Golden Ambient Glow -->
      <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gold/15 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/20 text-[11px] font-semibold uppercase tracking-widest text-champagne">
            <Sparkles class="w-3 h-3 text-gold" />
            <span>Welcome to your wedding journey</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            {{ workspaceStore.coupleNames }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-champagne/90">
            <div class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-gold" />
              <span>{{ formatDate(workspaceStore.weddingDate) }}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-gold" />
              <span>{{ workspaceStore.locationDisplay }}</span>
            </div>

            <div class="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold-light text-xs font-semibold">
              {{ workspaceStore.workspace.celebrationStyle }}
            </div>
          </div>
        </div>

        <!-- Live Countdown Timer -->
        <div v-if="countdown" class="shrink-0 p-4 sm:p-5 rounded-2xl bg-charcoal-900/80 backdrop-blur-md border border-gold/30">
          <div class="text-[10px] uppercase font-semibold text-champagne tracking-widest mb-3 text-center">
            Countdown to Celebration
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="px-3 py-2 rounded-xl bg-charcoal border border-charcoal-light">
              <div class="font-serif text-2xl sm:text-3xl font-bold text-white">{{ countdown.days }}</div>
              <div class="text-[10px] text-warmgray uppercase">Days</div>
            </div>
            <div class="px-3 py-2 rounded-xl bg-charcoal border border-charcoal-light">
              <div class="font-serif text-2xl sm:text-3xl font-bold text-white">{{ countdown.hours }}</div>
              <div class="text-[10px] text-warmgray uppercase">Hours</div>
            </div>
            <div class="px-3 py-2 rounded-xl bg-charcoal border border-charcoal-light">
              <div class="font-serif text-2xl sm:text-3xl font-bold text-white">{{ countdown.minutes }}</div>
              <div class="text-[10px] text-warmgray uppercase">Mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Metric Cards (Calculated directly from Pinia State) -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard 
        title="Total Budget" 
        :value="formatCompactCurrency(budgetStore.totalBudget, workspaceStore.currency)"
        subtitle="Master Allocation"
        trend="Set"
        trend-type="neutral"
      />
      <MetricCard 
        title="Amount Spent" 
        :value="formatCompactCurrency(budgetStore.totalSpent, workspaceStore.currency)"
        :subtitle="`${budgetStore.budgetUtilizationPercent}% utilized`"
        :trend="budgetStore.isOverBudget ? 'Over Budget' : 'On Track'"
        :trend-type="budgetStore.isOverBudget ? 'alert' : 'positive'"
      />
      <MetricCard 
        title="Remaining" 
        :value="formatCompactCurrency(budgetStore.remainingBudget, workspaceStore.currency)"
        subtitle="Unallocated funds"
        trend="Available"
        trend-type="positive"
      />
      <MetricCard 
        title="Guests Confirmed" 
        :value="guestStore.acceptedCount"
        :subtitle="`${guestStore.totalHeadcount} invited`"
        :trend="`${guestStore.responseRate}% RSVP`"
        trend-type="positive"
      />
      <MetricCard 
        title="Tasks Done" 
        :value="checklistStore.completedTasksCount"
        :subtitle="`${checklistStore.progressPercentage}% complete`"
        trend="Milestones"
        trend-type="positive"
      />
      <MetricCard 
        title="Pending Tasks" 
        :value="checklistStore.pendingTasksCount"
        :subtitle="`${checklistStore.overdueTasks.length} need action`"
        :trend="checklistStore.overdueTasks.length > 0 ? 'Urgent' : 'Good'"
        :trend-type="checklistStore.overdueTasks.length > 0 ? 'warning' : 'neutral'"
      />
    </div>

    <!-- Quick Actions Bar -->
    <div class="space-y-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-warmgray">Fast Workspace Actions</span>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          v-for="act in quickActions"
          :key="act.label"
          type="button"
          @click="router.push(act.to)"
          class="p-3.5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-xs hover:shadow-soft hover:border-gold/40 transition-all flex items-center gap-3 group text-left"
        >
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :class="act.color">
            <component :is="act.icon" class="w-4 h-4" />
          </div>
          <span class="text-xs font-semibold text-charcoal dark:text-ivory group-hover:text-gold transition-colors truncate">
            {{ act.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Dashboard Two-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column (8 cols) -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Next Tasks Checklist Section -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Priority Tasks</h3>
              <p class="text-xs text-warmgray">Immediate deliverables and bookings to confirm</p>
            </div>
            <router-link to="/checklist" class="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
              <span>View all {{ checklistStore.totalTasksCount }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <div class="divide-y divide-champagne/20 dark:divide-charcoal-light/20">
            <div 
              v-for="task in checklistStore.tasks.slice(0, 4)" 
              :key="task.id"
              class="py-3 flex items-start justify-between gap-3 group"
            >
              <div class="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  :checked="task.completed"
                  @change="checklistStore.toggleTask(task.id)"
                  class="w-4 h-4 mt-1 rounded text-gold focus:ring-gold cursor-pointer"
                />
                <div>
                  <div 
                    class="text-sm font-medium transition-colors"
                    :class="task.completed ? 'line-through text-warmgray' : 'text-charcoal dark:text-ivory'"
                  >
                    {{ task.title }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] text-warmgray mt-0.5">
                    <span>Due: {{ formatDate(task.dueDate) }}</span>
                    <span>•</span>
                    <span>Assigned: {{ task.assignedTo }}</span>
                  </div>
                </div>
              </div>
              <span 
                class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0"
                :class="{
                  'bg-rose/20 text-rose-dark dark:text-rose-light': task.priority === 'High',
                  'bg-champagne/30 text-gold-dark dark:text-gold-light': task.priority === 'Medium',
                  'bg-ivory dark:bg-charcoal-light text-warmgray': task.priority === 'Low'
                }"
              >
                {{ task.priority }}
              </span>
            </div>
          </div>
        </div>

        <!-- Upcoming Wedding Events Timeline Widget -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Upcoming Celebrations</h3>
              <p class="text-xs text-warmgray">Chronological ceremony itinerary</p>
            </div>
            <router-link to="/timeline" class="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
              <span>Full Timeline</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="evt in timelineStore.sortedEvents.slice(0, 4)" 
              :key="evt.id"
              class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light space-y-2 hover:border-gold/40 transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gold">Order #{{ evt.order }}</span>
                <span class="text-[11px] text-warmgray">{{ formatDate(evt.date) }}</span>
              </div>
              <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory truncate">{{ evt.name }}</h4>
              <p class="text-xs text-warmgray line-clamp-1">{{ evt.venue }}</p>
              <div class="text-[11px] text-gold font-medium pt-1">
                {{ evt.startTime }} - {{ evt.endTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Collaboration Activity -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Recent Activity</h3>
              <p class="text-xs text-warmgray">Real-time team and family planning logs</p>
            </div>
            <router-link to="/collaboration" class="text-xs font-semibold text-gold hover:underline">
              Collaboration Hub →
            </router-link>
          </div>

          <div class="space-y-3">
            <div 
              v-for="act in collabStore.activities.slice(0, 4)" 
              :key="act.id"
              class="flex items-start justify-between text-xs"
            >
              <div class="flex items-start gap-2.5">
                <div class="w-6 h-6 rounded-full bg-champagne/40 flex items-center justify-center font-bold text-[10px] text-gold-dark mt-0.5">
                  {{ act.authorName[0] }}
                </div>
                <div>
                  <span class="font-semibold text-charcoal dark:text-ivory">{{ act.authorName }}</span>
                  <span class="text-warmgray"> {{ act.action }} </span>
                  <span class="font-medium text-gold-dark dark:text-gold-light">{{ act.target }}</span>
                </div>
              </div>
              <span class="text-warmgray text-[11px] shrink-0">{{ act.timestamp }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (4 cols) -->
      <div class="lg:col-span-4 space-y-8">
        
        <!-- Budget Breakdown Chart Card -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Budget Distribution</h3>
              <p class="text-xs text-warmgray">Category allocations</p>
            </div>
            <router-link to="/budget" class="text-xs text-gold font-semibold hover:underline">
              Manage →
            </router-link>
          </div>

          <div class="h-56">
            <BudgetDonutChart :categories="budgetStore.categoryBreakdown" />
          </div>

          <div class="pt-2 space-y-2 border-t border-champagne/20 dark:border-charcoal-light/20 text-xs">
            <div 
              v-for="cat in budgetStore.categoryBreakdown.slice(0, 4)" 
              :key="cat.id"
              class="flex items-center justify-between text-warmgray"
            >
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                <span class="truncate max-w-[120px]">{{ cat.name }}</span>
              </div>
              <span class="font-medium text-charcoal dark:text-ivory">
                {{ formatCompactCurrency(cat.spent, workspaceStore.currency) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Guest RSVP Summary Card -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">RSVP Status</h3>
              <p class="text-xs text-warmgray">Confirmed vs. pending responses</p>
            </div>
            <router-link to="/guests" class="text-xs text-gold font-semibold hover:underline">
              Guest List →
            </router-link>
          </div>

          <!-- Progress bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-semibold">
              <span class="text-emerald-600 dark:text-emerald-400">{{ guestStore.acceptedCount }} Attending</span>
              <span class="text-warmgray">{{ guestStore.pendingCount }} Pending</span>
            </div>
            <div class="w-full h-3 bg-champagne/30 rounded-full overflow-hidden flex">
              <div 
                class="bg-emerald-500 h-full"
                :style="{ width: `${guestStore.totalHeadcount ? (guestStore.acceptedCount / guestStore.totalHeadcount) * 100 : 0}%` }"
              ></div>
              <div 
                class="bg-gold h-full"
                :style="{ width: `${guestStore.totalHeadcount ? (guestStore.pendingCount / guestStore.totalHeadcount) * 100 : 0}%` }"
              ></div>
              <div 
                class="bg-rose-dark h-full"
                :style="{ width: `${guestStore.totalHeadcount ? (guestStore.declinedCount / guestStore.totalHeadcount) * 100 : 0}%` }"
              ></div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div class="p-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/30">
              <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ guestStore.acceptedCount }}</div>
              <div class="text-[10px] text-warmgray">Accepted</div>
            </div>
            <div class="p-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/30">
              <div class="font-bold text-gold">{{ guestStore.pendingCount }}</div>
              <div class="text-[10px] text-warmgray">Pending</div>
            </div>
            <div class="p-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/30">
              <div class="font-bold text-rose-dark">{{ guestStore.declinedCount }}</div>
              <div class="text-[10px] text-warmgray">Declined</div>
            </div>
          </div>
        </div>

        <!-- Vendor & Venue Shortlist Overview -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-champagne/30 dark:border-charcoal-light/40">
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Vendor Shortlist</h3>
              <p class="text-xs text-warmgray">{{ vendorStore.shortlist.length }} items saved</p>
            </div>
            <router-link to="/shortlist" class="text-xs text-gold font-semibold hover:underline">
              Compare →
            </router-link>
          </div>

          <div class="space-y-3">
            <div 
              v-for="item in vendorStore.shortlistedVendors.slice(0, 3)" 
              :key="item.id"
              class="flex items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-2.5 truncate">
                <img :src="item.vendor?.coverImage" class="w-8 h-8 rounded-lg object-cover" />
                <div class="truncate">
                  <div class="font-semibold text-charcoal dark:text-ivory truncate">{{ item.vendor?.name }}</div>
                  <div class="text-[10px] text-warmgray">{{ item.vendor?.category }}</div>
                </div>
              </div>
              <span 
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                :class="item.isBooked ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-champagne/30 text-gold-dark'"
              >
                {{ item.isBooked ? 'Booked' : 'Shortlisted' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
