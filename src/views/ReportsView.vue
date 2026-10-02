<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  Download,
  Printer,
  Coins,
  Users,
  CheckSquare,
  Calendar,
  Sparkles,
  ShoppingBag
} from 'lucide-vue-next'
import { useBudgetStore } from '@/stores/budget'
import { useGuestStore } from '@/stores/guests'
import { useChecklistStore } from '@/stores/checklist'
import { useTimelineStore } from '@/stores/timeline'
import { useVendorStore } from '@/stores/vendors'
import { useWorkspaceStore } from '@/stores/workspace'
import BudgetDonutChart from '@/components/charts/BudgetDonutChart.vue'
import RSVPBarChart from '@/components/charts/RSVPBarChart.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import { formatCurrency, formatCompactCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { exportToCSV } from '@/utils/csv'

const budgetStore = useBudgetStore()
const guestStore = useGuestStore()
const checklistStore = useChecklistStore()
const timelineStore = useTimelineStore()
const vendorStore = useVendorStore()
const workspaceStore = useWorkspaceStore()

function printReport() {
  window.print()
}

function exportExecutiveSummaryCSV() {
  const summaryRows = [
    ['EVERAFTER WEDDING EXECUTIVE SUMMARY REPORT'],
    ['Couple', workspaceStore.coupleNames],
    ['Wedding Date', workspaceStore.weddingDate || 'TBD'],
    ['Location', workspaceStore.locationDisplay],
    ['Total Master Budget', budgetStore.totalBudget],
    ['Total Committed / Spent', budgetStore.totalSpent],
    ['Total Amount Paid', budgetStore.totalPaid],
    ['Remaining Budget Surplus', budgetStore.remainingBudget],
    ['Total Invited Guests', guestStore.totalHeadcount],
    ['Confirmed Accepted Guests', guestStore.acceptedCount],
    ['Pending RSVP Guests', guestStore.pendingCount],
    ['Declined Guests', guestStore.declinedCount],
    ['Total Tasks', checklistStore.totalTasksCount],
    ['Completed Tasks', checklistStore.completedTasksCount],
    ['Shortlisted Vendors/Venues', vendorStore.shortlist.length]
  ]

  exportToCSV(`everafter-executive-report-${new Date().toISOString().slice(0, 10)}`, summaryRows)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Planning Reports &amp; Analytics</h1>
        <p class="text-xs text-warmgray">Derive live financial health, attendance confirmations, and operational milestones</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="exportExecutiveSummaryCSV"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Download class="w-3.5 h-3.5 text-gold" />
          <span>Export Summary CSV</span>
        </button>

        <button 
          type="button" 
          @click="printReport"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Printer class="w-4 h-4" />
          <span>Print Executive Dossier</span>
        </button>
      </div>
    </div>

    <!-- Print Only Header -->
    <div class="hidden print-only text-center mb-8 border-b pb-4">
      <h1 class="text-3xl font-serif font-bold">{{ workspaceStore.coupleNames }}</h1>
      <p class="text-sm">Official Wedding Planning Executive Report</p>
      <p class="text-xs text-warmgray">{{ workspaceStore.locationDisplay }} • {{ formatDate(workspaceStore.weddingDate) }}</p>
    </div>

    <!-- Metric Overview Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard 
        title="Budget Utilization" 
        :value="`${budgetStore.budgetUtilizationPercent}%`"
        :subtitle="`${formatCompactCurrency(budgetStore.totalSpent, workspaceStore.currency)} spent`"
        trend="Finances"
        trend-type="neutral"
      />
      <MetricCard 
        title="Guest RSVP Rate" 
        :value="`${guestStore.responseRate}%`"
        :subtitle="`${guestStore.acceptedCount} confirmed`"
        trend="Hospitality"
        trend-type="positive"
      />
      <MetricCard 
        title="Milestone Completion" 
        :value="`${checklistStore.progressPercentage}%`"
        :subtitle="`${checklistStore.completedTasksCount} of ${checklistStore.totalTasksCount} done`"
        trend="Checklist"
        trend-type="positive"
      />
      <MetricCard 
        title="Ceremonies Scheduled" 
        :value="timelineStore.events.length"
        subtitle="Multi-day itinerary"
        trend="Timeline"
        trend-type="neutral"
      />
    </div>

    <!-- Charts Split -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Financial Breakdown -->
      <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Financial Allocation Breakdown</h3>
          <p class="text-xs text-warmgray">Expenditures by category</p>
        </div>
        <div class="h-60">
          <BudgetDonutChart :categories="budgetStore.categoryBreakdown" />
        </div>
        <div class="pt-2 border-t border-champagne/20 text-xs flex justify-between font-mono">
          <span class="text-warmgray">Total Spent: {{ formatCurrency(budgetStore.totalSpent, workspaceStore.currency) }}</span>
          <span class="text-gold font-bold">Remaining: {{ formatCurrency(budgetStore.remainingBudget, workspaceStore.currency) }}</span>
        </div>
      </div>

      <!-- Guest Meal & Attendance Breakdown -->
      <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Dietary Portions Summary</h3>
          <p class="text-xs text-warmgray">Catering headcounts for banquet kitchen</p>
        </div>
        <div class="h-60">
          <RSVPBarChart 
            :labels="Object.keys(guestStore.mealSummary)" 
            :data="Object.values(guestStore.mealSummary)" 
          />
        </div>
        <div class="pt-2 border-t border-champagne/20 text-xs flex justify-between font-mono">
          <span class="text-emerald-600 font-bold">Attending: {{ guestStore.acceptedCount }} Guests</span>
          <span class="text-warmgray">Pending: {{ guestStore.pendingCount }}</span>
        </div>
      </div>
    </div>

    <!-- Category Expense Table Summary -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory">Category-Wise Financial Audit</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-champagne/30 text-[11px] font-semibold text-warmgray uppercase">
              <th class="py-2.5 px-3">Category</th>
              <th class="py-2.5 px-3">Allocated Cap</th>
              <th class="py-2.5 px-3">Committed / Spent</th>
              <th class="py-2.5 px-3">Amount Paid</th>
              <th class="py-2.5 px-3">Balance Due</th>
              <th class="py-2.5 px-3">Utilization</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-champagne/20 font-mono">
            <tr v-for="cat in budgetStore.categoryBreakdown" :key="cat.id" class="hover:bg-ivory/50">
              <td class="py-3 px-3 font-sans font-medium text-charcoal dark:text-ivory">{{ cat.name }}</td>
              <td class="py-3 px-3 text-warmgray">{{ formatCurrency(cat.allocatedAmount, workspaceStore.currency) }}</td>
              <td class="py-3 px-3 font-bold" :class="cat.isOver ? 'text-rose-dark' : 'text-charcoal dark:text-ivory'">
                {{ formatCurrency(cat.spent, workspaceStore.currency) }}
              </td>
              <td class="py-3 px-3 text-emerald-600">{{ formatCurrency(cat.paid, workspaceStore.currency) }}</td>
              <td class="py-3 px-3 text-warmgray">{{ formatCurrency(Math.max(0, cat.spent - cat.paid), workspaceStore.currency) }}</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded font-sans text-[10px] font-bold" :class="cat.isOver ? 'bg-rose/20 text-rose-dark' : 'bg-champagne/30 text-gold-dark'">
                  {{ cat.percentUsed }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
