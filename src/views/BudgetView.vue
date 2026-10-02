<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Coins,
  Plus,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-vue-next'
import { useBudgetStore } from '@/stores/budget'
import { useWorkspaceStore } from '@/stores/workspace'
import { useVendorStore } from '@/stores/vendors'
import { useTimelineStore } from '@/stores/timeline'
import BudgetDonutChart from '@/components/charts/BudgetDonutChart.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatCurrency, formatCompactCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import type { Expense, PaymentStatus } from '@/types'

const budgetStore = useBudgetStore()
const workspaceStore = useWorkspaceStore()
const vendorStore = useVendorStore()
const timelineStore = useTimelineStore()

// Filters & Search
const searchQuery = ref('')
const selectedCategoryFilter = ref('')
const selectedStatusFilter = ref('')

const isAddExpenseModalOpen = ref(false)
const isAddCategoryModalOpen = ref(false)
const isEditBudgetModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const itemToDelete = ref<{ id: string; type: 'expense' | 'category' } | null>(null)

// Editing Expense
const editingExpenseId = ref<string | null>(null)
const expenseForm = ref({
  title: '',
  categoryId: '',
  vendorId: '',
  eventId: '',
  estimatedAmount: 0,
  actualAmount: 0,
  paidAmount: 0,
  paymentStatus: 'pending' as PaymentStatus,
  expenseDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  notes: '',
  receiptName: ''
})

// New Category Form
const newCategoryName = ref('')
const newCategoryAllocated = ref(200000)
const newCategoryColor = ref('#B99A62')

// Edit Total Budget Form
const editTotalBudgetAmount = ref(budgetStore.totalBudget)

function openAddExpenseModal(expense?: Expense) {
  if (expense) {
    editingExpenseId.value = expense.id
    expenseForm.value = {
      title: expense.title,
      categoryId: expense.categoryId,
      vendorId: expense.vendorId || '',
      eventId: expense.eventId || '',
      estimatedAmount: expense.estimatedAmount,
      actualAmount: expense.actualAmount,
      paidAmount: expense.paidAmount,
      paymentStatus: expense.paymentStatus,
      expenseDate: expense.expenseDate,
      dueDate: expense.dueDate || '',
      notes: expense.notes || '',
      receiptName: expense.receiptName || ''
    }
  } else {
    editingExpenseId.value = null
    expenseForm.value = {
      title: '',
      categoryId: budgetStore.categories[0]?.id || '',
      vendorId: '',
      eventId: '',
      estimatedAmount: 50000,
      actualAmount: 50000,
      paidAmount: 0,
      paymentStatus: 'pending',
      expenseDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      notes: '',
      receiptName: ''
    }
  }
  isAddExpenseModalOpen.value = true
}

function handleSaveExpense() {
  if (!expenseForm.value.title.trim()) return

  // Automatically adjust status if paidAmount equals actualAmount
  let status = expenseForm.value.paymentStatus
  if (expenseForm.value.paidAmount >= expenseForm.value.actualAmount && expenseForm.value.actualAmount > 0) {
    status = 'paid'
  } else if (expenseForm.value.paidAmount > 0) {
    status = 'partially_paid'
  }

  if (editingExpenseId.value) {
    budgetStore.updateExpense(editingExpenseId.value, {
      ...expenseForm.value,
      paymentStatus: status
    })
  } else {
    budgetStore.addExpense({
      ...expenseForm.value,
      paymentStatus: status
    })
  }
  isAddExpenseModalOpen.value = false
}

function confirmDelete(id: string, type: 'expense' | 'category') {
  itemToDelete.value = { id, type }
  isDeleteDialogOpen.value = true
}

function executeDelete() {
  if (itemToDelete.value) {
    if (itemToDelete.value.type === 'expense') {
      budgetStore.deleteExpense(itemToDelete.value.id)
    } else {
      budgetStore.deleteCategory(itemToDelete.value.id)
    }
  }
  isDeleteDialogOpen.value = false
  itemToDelete.value = null
}

function handleSaveNewCategory() {
  if (newCategoryName.value.trim()) {
    budgetStore.addCategory(
      newCategoryName.value.trim(),
      newCategoryAllocated.value,
      newCategoryColor.value
    )
    newCategoryName.value = ''
    isAddCategoryModalOpen.value = false
  }
}

function handleSaveTotalBudget() {
  if (editTotalBudgetAmount.value > 0) {
    workspaceStore.updateBudgetTotal(editTotalBudgetAmount.value)
    isEditBudgetModalOpen.value = false
  }
}

const filteredExpenses = computed(() => {
  return budgetStore.expenses.filter(e => {
    const matchesSearch = !searchQuery.value.trim() || 
      e.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCategory = !selectedCategoryFilter.value || e.categoryId === selectedCategoryFilter.value
    const matchesStatus = !selectedStatusFilter.value || e.paymentStatus === selectedStatusFilter.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Wedding Budget Planner</h1>
        <p class="text-xs text-warmgray">Track category allocations, vendor deposits, and outstanding payments</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="budgetStore.exportExpensesCSV"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Download class="w-3.5 h-3.5 text-gold" />
          <span>Export CSV</span>
        </button>

        <button 
          type="button" 
          @click="openAddExpenseModal()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>
    </div>

    <!-- Alert / Overbudget Banner if applicable -->
    <div 
      v-if="budgetStore.isOverBudget"
      class="p-4 rounded-2xl bg-rose/20 border border-rose text-rose-dark dark:text-rose-light flex items-center justify-between gap-4 text-xs font-medium"
    >
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 text-rose-dark shrink-0" />
        <span>You have exceeded your total master budget by {{ formatCurrency(Math.abs(budgetStore.remainingBudget), workspaceStore.currency) }}.</span>
      </div>
      <button 
        type="button" 
        @click="editTotalBudgetAmount = budgetStore.totalBudget; isEditBudgetModalOpen = true"
        class="underline font-bold whitespace-nowrap"
      >
        Adjust Master Budget
      </button>
    </div>

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="relative cursor-pointer group" @click="editTotalBudgetAmount = budgetStore.totalBudget; isEditBudgetModalOpen = true">
        <MetricCard 
          title="Master Budget" 
          :value="formatCompactCurrency(budgetStore.totalBudget, workspaceStore.currency)"
          subtitle="Click to edit total"
          trend="Master Limit"
          trend-type="neutral"
        />
      </div>
      <MetricCard 
        title="Total Spent" 
        :value="formatCompactCurrency(budgetStore.totalSpent, workspaceStore.currency)"
        :subtitle="`${budgetStore.budgetUtilizationPercent}% of budget`"
        :trend="budgetStore.isOverBudget ? 'Over Limit' : 'Within Budget'"
        :trend-type="budgetStore.isOverBudget ? 'alert' : 'positive'"
      />
      <MetricCard 
        title="Total Paid Out" 
        :value="formatCompactCurrency(budgetStore.totalPaid, workspaceStore.currency)"
        subtitle="Deposits &amp; tokens"
        trend="Paid"
        trend-type="positive"
      />
      <MetricCard 
        title="Remaining Funds" 
        :value="formatCompactCurrency(budgetStore.remainingBudget, workspaceStore.currency)"
        :subtitle="budgetStore.remainingBudget >= 0 ? 'Surplus buffer' : 'Over budget'"
        :trend="budgetStore.remainingBudget >= 0 ? 'Surplus' : 'Deficit'"
        :trend-type="budgetStore.remainingBudget >= 0 ? 'positive' : 'alert'"
      />
    </div>

    <!-- Category Allocation Breakdown & Donut Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Chart (4 cols) -->
      <div class="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft flex flex-col justify-between">
        <div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Category Distribution</h3>
          <p class="text-xs text-warmgray">Visual split of expenditures</p>
        </div>
        <div class="h-64 my-4">
          <BudgetDonutChart :categories="budgetStore.categoryBreakdown" />
        </div>
        <div class="text-center">
          <button 
            type="button" 
            @click="isAddCategoryModalOpen = true"
            class="text-xs font-semibold text-gold hover:underline"
          >
            + Add Custom Category
          </button>
        </div>
      </div>

      <!-- Category Progress Bars (8 cols) -->
      <div class="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
          <div>
            <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Category Utilization</h3>
            <p class="text-xs text-warmgray">Allocated caps vs actual commitments</p>
          </div>
          <button 
            type="button" 
            @click="isAddCategoryModalOpen = true"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs font-semibold text-gold hover:border-gold"
          >
            + New Category
          </button>
        </div>

        <div class="max-h-80 overflow-y-auto space-y-4 pr-1">
          <div 
            v-for="cat in budgetStore.categoryBreakdown" 
            :key="cat.id"
            class="space-y-1.5 p-3 rounded-2xl hover:bg-ivory/60 dark:hover:bg-charcoal-900 transition-colors"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
                <span class="font-bold text-charcoal dark:text-ivory">{{ cat.name }}</span>
                <span class="text-warmgray">({{ cat.expenseCount }} expenses)</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="font-bold" :class="cat.isOver ? 'text-rose-dark' : 'text-charcoal dark:text-ivory'">
                  {{ formatCompactCurrency(cat.spent, workspaceStore.currency) }}
                </span>
                <span class="text-warmgray">/ {{ formatCompactCurrency(cat.allocatedAmount, workspaceStore.currency) }}</span>
                <span 
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  :class="cat.isOver ? 'bg-rose/20 text-rose-dark' : 'bg-champagne/30 text-gold-dark'"
                >
                  {{ cat.percentUsed }}%
                </span>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-full h-2 rounded-full bg-champagne/30 dark:bg-charcoal-light overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-300"
                :class="cat.isOver ? 'bg-rose-dark' : 'bg-gold'"
                :style="{ width: `${Math.min(100, cat.percentUsed)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expenses Table Section -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory">Detailed Expense Records</h3>
          <p class="text-xs text-warmgray">{{ budgetStore.expenses.length }} total itemized commitments</p>
        </div>

        <!-- Search and Filters -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Search input -->
          <div class="relative">
            <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search expenses..."
              class="pl-8 pr-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden focus:border-gold w-40 sm:w-52"
            />
          </div>

          <!-- Category filter -->
          <select 
            v-model="selectedCategoryFilter"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="">All Categories</option>
            <option v-for="cat in budgetStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <!-- Status filter -->
          <select 
            v-model="selectedStatusFilter"
            class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid Full</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-champagne/30 dark:border-charcoal-light text-[11px] font-semibold text-warmgray uppercase tracking-wider">
              <th class="py-3 px-3">Expense Item</th>
              <th class="py-3 px-3">Category</th>
              <th class="py-3 px-3">Actual Amount</th>
              <th class="py-3 px-3">Paid Amount</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3">Date</th>
              <th class="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-champagne/20 dark:divide-charcoal-light/20">
            <tr 
              v-for="expense in filteredExpenses" 
              :key="expense.id"
              class="hover:bg-ivory/50 dark:hover:bg-charcoal-900 transition-colors group"
            >
              <td class="py-3.5 px-3">
                <div class="font-medium text-charcoal dark:text-ivory">{{ expense.title }}</div>
                <div v-if="expense.notes" class="text-[11px] text-warmgray line-clamp-1 mt-0.5">{{ expense.notes }}</div>
              </td>
              <td class="py-3.5 px-3">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-champagne/20 dark:bg-charcoal-light text-[11px]">
                  <Tag class="w-2.5 h-2.5 text-gold" />
                  <span>{{ budgetStore.categories.find(c => c.id === expense.categoryId)?.name || 'General' }}</span>
                </span>
              </td>
              <td class="py-3.5 px-3 font-mono font-bold text-charcoal dark:text-ivory">
                {{ formatCurrency(expense.actualAmount, workspaceStore.currency) }}
              </td>
              <td class="py-3.5 px-3 font-mono text-warmgray">
                {{ formatCurrency(expense.paidAmount, workspaceStore.currency) }}
              </td>
              <td class="py-3.5 px-3">
                <span 
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                  :class="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200': expense.paymentStatus === 'paid',
                    'bg-champagne/40 text-gold-dark dark:text-gold-light': expense.paymentStatus === 'partially_paid',
                    'bg-rose/20 text-rose-dark dark:text-rose-light': expense.paymentStatus === 'pending'
                  }"
                >
                  {{ expense.paymentStatus.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-warmgray font-mono text-[11px]">
                {{ formatDate(expense.expenseDate) }}
              </td>
              <td class="py-3.5 px-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button 
                    type="button" 
                    @click="openAddExpenseModal(expense)"
                    class="p-1.5 rounded-lg text-warmgray hover:text-gold hover:bg-champagne/20 transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    @click="confirmDelete(expense.id, 'expense')"
                    class="p-1.5 rounded-lg text-warmgray hover:text-rose-dark hover:bg-rose/20 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredExpenses.length === 0">
              <td colspan="7" class="py-8 text-center text-warmgray text-xs">
                No expenses found matching the current search and filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Add / Edit Expense -->
    <Modal 
      :is-open="isAddExpenseModalOpen" 
      :title="editingExpenseId ? 'Edit Wedding Expense' : 'Add New Wedding Expense'" 
      size="lg" 
      @close="isAddExpenseModalOpen = false"
    >
      <form @submit.prevent="handleSaveExpense" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Expense Title *</label>
          <input 
            v-model="expenseForm.title"
            type="text" 
            required
            placeholder="e.g. Venue Booking Deposit"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden focus:border-gold"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Category *</label>
            <select 
              v-model="expenseForm.categoryId"
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option v-for="cat in budgetStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Linked Function (Optional)</label>
            <select 
              v-model="expenseForm.eventId"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="">General Celebration</option>
              <option v-for="evt in timelineStore.events" :key="evt.id" :value="evt.id">
                {{ evt.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Committed / Actual Amount *</label>
            <input 
              v-model.number="expenseForm.actualAmount"
              type="number" 
              required
              min="0"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Paid to Date</label>
            <input 
              v-model.number="expenseForm.paidAmount"
              type="number" 
              min="0"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono focus:outline-hidden"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Expense Date</label>
            <input 
              v-model="expenseForm.expenseDate"
              type="date" 
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Payment Due Date</label>
            <input 
              v-model="expenseForm.dueDate"
              type="date" 
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Notes / Receipt Ref</label>
          <textarea 
            v-model="expenseForm.notes"
            rows="2"
            placeholder="Contract terms, installment schedule, invoice numbers..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button 
            type="button" 
            @click="isAddExpenseModalOpen = false"
            class="px-4 py-2 rounded-xl text-warmgray hover:text-charcoal"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-white font-semibold shadow-xs"
          >
            {{ editingExpenseId ? 'Save Changes' : 'Create Expense' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Modal: Add Category -->
    <Modal :is-open="isAddCategoryModalOpen" title="Create Custom Budget Category" size="sm" @close="isAddCategoryModalOpen = false">
      <form @submit.prevent="handleSaveNewCategory" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Category Name *</label>
          <input 
            v-model="newCategoryName"
            type="text" 
            required
            placeholder="e.g. Fireworks & Pyrotechnics"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Allocated Budget Cap</label>
          <input 
            v-model.number="newCategoryAllocated"
            type="number" 
            min="0"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Highlight Color</label>
          <input 
            v-model="newCategoryColor"
            type="color" 
            class="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
          />
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isAddCategoryModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold">Save Category</button>
        </div>
      </form>
    </Modal>

    <!-- Modal: Edit Total Master Budget -->
    <Modal :is-open="isEditBudgetModalOpen" title="Update Master Wedding Budget" size="sm" @close="isEditBudgetModalOpen = false">
      <form @submit.prevent="handleSaveTotalBudget" class="space-y-4 text-xs">
        <p class="text-warmgray">Adjust your overall budget limit. All metrics and progress bars will recalculate automatically.</p>
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Total Budget Amount *</label>
          <input 
            v-model.number="editTotalBudgetAmount"
            type="number" 
            required
            min="1000"
            step="10000"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono font-bold"
          />
        </div>
        <div class="text-xs text-gold font-bold">
          {{ formatCurrency(editTotalBudgetAmount, workspaceStore.currency) }}
        </div>
        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isEditBudgetModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold">Update Limit</button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Item"
      message="Are you sure you want to remove this record? This action cannot be undone."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
