import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BudgetCategory, Expense } from '@/types'
import { defaultBudgetCategories, defaultExpenses } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { useWorkspaceStore } from './workspace'
import { exportToCSV } from '@/utils/csv'

export const useBudgetStore = defineStore('budget', () => {
  const workspaceStore = useWorkspaceStore()
  const categories = ref<BudgetCategory[]>(getStoredItem('budget_categories', defaultBudgetCategories))
  const expenses = ref<Expense[]>(getStoredItem('budget_expenses', defaultExpenses))

  function persist() {
    setStoredItem('budget_categories', categories.value)
    setStoredItem('budget_expenses', expenses.value)
  }

  // Getters
  const totalBudget = computed(() => workspaceStore.workspace.budget.total || 0)

  const totalAllocated = computed(() => {
    return categories.value.reduce((acc, cat) => acc + (cat.allocatedAmount || 0), 0)
  })

  const totalSpent = computed(() => {
    return expenses.value.reduce((acc, exp) => acc + (exp.actualAmount || exp.estimatedAmount || 0), 0)
  })

  const totalPaid = computed(() => {
    return expenses.value.reduce((acc, exp) => acc + (exp.paidAmount || 0), 0)
  })

  const totalOutstanding = computed(() => {
    return Math.max(0, totalSpent.value - totalPaid.value)
  })

  const remainingBudget = computed(() => {
    return totalBudget.value - totalSpent.value
  })

  const budgetUtilizationPercent = computed(() => {
    if (!totalBudget.value) return 0
    return Math.min(100, Math.round((totalSpent.value / totalBudget.value) * 100))
  })

  const isOverBudget = computed(() => {
    return totalSpent.value > totalBudget.value
  })

  const isApproachingBudget = computed(() => {
    return totalSpent.value >= totalBudget.value * 0.9 && !isOverBudget.value
  })

  const categoryBreakdown = computed(() => {
    return categories.value.map(cat => {
      const catExpenses = expenses.value.filter(e => e.categoryId === cat.id)
      const spent = catExpenses.reduce((acc, e) => acc + (e.actualAmount || e.estimatedAmount || 0), 0)
      const paid = catExpenses.reduce((acc, e) => acc + (e.paidAmount || 0), 0)
      const allocated = cat.allocatedAmount || 0
      const percentUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : 0
      const isOver = spent > allocated

      return {
        ...cat,
        spent,
        paid,
        percentUsed,
        isOver,
        expenseCount: catExpenses.length
      }
    })
  })

  // Actions
  function addExpense(expense: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`
    }
    expenses.value.unshift(newExpense)
    persist()
    return newExpense
  }

  function updateExpense(id: string, updates: Partial<Expense>) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      expenses.value[idx] = { ...expenses.value[idx], ...updates }
      persist()
    }
  }

  function deleteExpense(id: string) {
    expenses.value = expenses.value.filter(e => e.id !== id)
    persist()
  }

  function addCategory(name: string, allocatedAmount: number, color?: string) {
    const newCat: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name,
      allocatedAmount,
      color: color || '#B99A62'
    }
    categories.value.push(newCat)
    persist()
    return newCat
  }

  function updateCategory(id: string, updates: Partial<BudgetCategory>) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], ...updates }
      persist()
    }
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    // Reassign or keep expenses with no category
    persist()
  }

  function exportExpensesCSV() {
    const headers = ['Title', 'Category', 'Estimated Amount', 'Actual Amount', 'Paid Amount', 'Status', 'Date', 'Due Date', 'Notes']
    const rows = expenses.value.map(e => {
      const cat = categories.value.find(c => c.id === e.categoryId)?.name || 'Uncategorized'
      return [
        e.title,
        cat,
        e.estimatedAmount,
        e.actualAmount,
        e.paidAmount,
        e.paymentStatus,
        e.expenseDate,
        e.dueDate || '',
        e.notes || ''
      ]
    })
    exportToCSV(`everafter-expenses-${new Date().toISOString().slice(0, 10)}`, [headers, ...rows])
  }

  return {
    categories,
    expenses,
    totalBudget,
    totalAllocated,
    totalSpent,
    totalPaid,
    totalOutstanding,
    remainingBudget,
    budgetUtilizationPercent,
    isOverBudget,
    isApproachingBudget,
    categoryBreakdown,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    exportExpensesCSV
  }
})
