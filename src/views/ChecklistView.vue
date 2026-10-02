<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  List,
  Columns,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'
import { useChecklistStore } from '@/stores/checklist'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatDate, isTaskOverdue } from '@/utils/date'
import type { Task, TaskPriority } from '@/types'

const checklistStore = useChecklistStore()
const workspaceStore = useWorkspaceStore()

const currentTab = ref<'pending' | 'completed' | 'all'>('pending')
const viewMode = ref<'list' | 'timeline'>('list')
const searchQuery = ref('')
const selectedPriorityFilter = ref('')
const selectedCategoryFilter = ref('')

const isTaskModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const taskToDeleteId = ref<string | null>(null)
const editingTaskId = ref<string | null>(null)

const taskForm = ref({
  title: '',
  description: '',
  dueDate: new Date().toISOString().slice(0, 10),
  priority: 'Medium' as TaskPriority,
  category: 'General',
  assignedTo: workspaceStore.workspace.couple.partner1Name || 'Partner 1',
  notes: '',
  subtaskDraft: ''
})

const subtasksList = ref<{ id: string; title: string; completed: boolean }[]>([])

function openTaskModal(task?: Task) {
  if (task) {
    editingTaskId.value = task.id
    taskForm.value = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      assignedTo: task.assignedTo,
      notes: task.notes || '',
      subtaskDraft: ''
    }
    subtasksList.value = JSON.parse(JSON.stringify(task.subtasks || []))
  } else {
    editingTaskId.value = null
    taskForm.value = {
      title: '',
      description: '',
      dueDate: new Date().toISOString().slice(0, 10),
      priority: 'Medium',
      category: 'Venue',
      assignedTo: workspaceStore.workspace.couple.partner1Name || 'Partner 1',
      notes: '',
      subtaskDraft: ''
    }
    subtasksList.value = []
  }
  isTaskModalOpen.value = true
}

function addSubtaskToDraft() {
  if (taskForm.value.subtaskDraft.trim()) {
    subtasksList.value.push({
      id: `st-${Date.now()}`,
      title: taskForm.value.subtaskDraft.trim(),
      completed: false
    })
    taskForm.value.subtaskDraft = ''
  }
}

function removeSubtaskFromDraft(idx: number) {
  subtasksList.value.splice(idx, 1)
}

function handleSaveTask() {
  if (!taskForm.value.title.trim()) return

  if (editingTaskId.value) {
    checklistStore.updateTask(editingTaskId.value, {
      title: taskForm.value.title,
      description: taskForm.value.description,
      dueDate: taskForm.value.dueDate,
      priority: taskForm.value.priority,
      category: taskForm.value.category,
      assignedTo: taskForm.value.assignedTo,
      notes: taskForm.value.notes,
      subtasks: subtasksList.value
    })
  } else {
    checklistStore.addTask({
      title: taskForm.value.title,
      description: taskForm.value.description,
      completed: false,
      dueDate: taskForm.value.dueDate,
      priority: taskForm.value.priority,
      category: taskForm.value.category,
      assignedTo: taskForm.value.assignedTo,
      notes: taskForm.value.notes,
      subtasks: subtasksList.value
    })
  }
  isTaskModalOpen.value = false
}

function confirmDeleteTask(id: string) {
  taskToDeleteId.value = id
  isDeleteDialogOpen.value = true
}

function executeDeleteTask() {
  if (taskToDeleteId.value) {
    checklistStore.deleteTask(taskToDeleteId.value)
    taskToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

// Categories list
const categories = ['Venue', 'Photography', 'Decor', 'Attire', 'Catering', 'Invitations', 'Hospitality', 'Entertainment', 'General']

const filteredTasks = computed(() => {
  return checklistStore.tasks
    .filter(t => {
      // Tab filter
      if (currentTab.value === 'pending' && t.completed) return false
      if (currentTab.value === 'completed' && !t.completed) return false

      // Search filter
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        const matchesTitle = t.title.toLowerCase().includes(q)
        const matchesDesc = t.description?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc) return false
      }

      // Priority filter
      if (selectedPriorityFilter.value && t.priority !== selectedPriorityFilter.value) {
        return false
      }

      // Category filter
      if (selectedCategoryFilter.value && t.category !== selectedCategoryFilter.value) {
        return false
      }

      return true
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Interactive Wedding Checklist</h1>
        <p class="text-xs text-warmgray">Manage milestones, assignments, and phase deadlines</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- List vs Timeline toggle -->
        <div class="flex items-center p-1 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40">
          <button 
            type="button" 
            @click="viewMode = 'list'"
            class="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            :class="viewMode === 'list' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
          >
            <List class="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button 
            type="button" 
            @click="viewMode = 'timeline'"
            class="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            :class="viewMode === 'timeline' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
          >
            <Columns class="w-3.5 h-3.5" />
            <span>Timeline View</span>
          </button>
        </div>

        <button 
          type="button" 
          @click="openTaskModal()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </div>

    <!-- Progress Tracker Overview Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-gold">Overall Planning Progress</span>
          <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">
            {{ checklistStore.completedTasksCount }} of {{ checklistStore.totalTasksCount }} Tasks Completed ({{ checklistStore.progressPercentage }}%)
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 text-xs">
            <span class="text-warmgray">Upcoming: </span>
            <span class="font-bold text-charcoal dark:text-ivory">{{ checklistStore.pendingTasksCount }}</span>
          </div>
          <div 
            v-if="checklistStore.overdueTasks.length > 0"
            class="px-3 py-1.5 rounded-xl bg-champagne/30 border border-gold/40 text-xs font-semibold text-gold-dark dark:text-gold-light"
          >
            {{ checklistStore.overdueTasks.length }} Need Attention
          </div>
        </div>
      </div>

      <div class="w-full h-3 rounded-full bg-champagne/30 dark:bg-charcoal-light overflow-hidden">
        <div 
          class="h-full rounded-full bg-gold transition-all duration-500"
          :style="{ width: `${checklistStore.progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Filters & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Tabs -->
      <div class="flex items-center gap-1 p-1 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 w-fit">
        <button 
          type="button" 
          @click="currentTab = 'pending'"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="currentTab === 'pending' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
        >
          Pending ({{ checklistStore.pendingTasksCount }})
        </button>
        <button 
          type="button" 
          @click="currentTab = 'completed'"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="currentTab === 'completed' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
        >
          Completed ({{ checklistStore.completedTasksCount }})
        </button>
        <button 
          type="button" 
          @click="currentTab = 'all'"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          :class="currentTab === 'all' ? 'bg-white dark:bg-charcoal text-gold shadow-xs' : 'text-warmgray'"
        >
          All ({{ checklistStore.totalTasksCount }})
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search tasks..."
            class="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-charcoal border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden focus:border-gold w-44"
          />
        </div>

        <select 
          v-model="selectedPriorityFilter"
          class="px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select 
          v-model="selectedCategoryFilter"
          class="px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal border border-champagne/50 dark:border-charcoal-light text-xs text-charcoal dark:text-ivory focus:outline-hidden"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- LIST VIEW -->
    <div v-if="viewMode === 'list'" class="space-y-3">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id"
        class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft hover:border-gold/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
      >
        <div class="flex items-start gap-3.5 min-w-0 flex-1">
          <input 
            type="checkbox" 
            :checked="task.completed"
            @change="checklistStore.toggleTask(task.id)"
            class="w-5 h-5 mt-0.5 rounded text-gold focus:ring-gold cursor-pointer shrink-0"
          />

          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span 
                class="font-serif text-base font-semibold transition-colors"
                :class="task.completed ? 'line-through text-warmgray' : 'text-charcoal dark:text-ivory'"
              >
                {{ task.title }}
              </span>
              <span 
                v-if="isTaskOverdue(task.dueDate, task.completed)"
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-champagne/40 text-gold-dark dark:text-gold-light"
              >
                Due soon
              </span>
            </div>

            <p v-if="task.description" class="text-xs text-warmgray dark:text-warmgray-light line-clamp-2">
              {{ task.description }}
            </p>

            <!-- Subtasks preview -->
            <div v-if="task.subtasks && task.subtasks.length > 0" class="pt-1.5 space-y-1">
              <div 
                v-for="st in task.subtasks" 
                :key="st.id"
                class="flex items-center gap-2 text-xs text-warmgray"
              >
                <input 
                  type="checkbox" 
                  :checked="st.completed"
                  @change="checklistStore.toggleSubtask(task.id, st.id)"
                  class="w-3.5 h-3.5 rounded text-gold cursor-pointer"
                />
                <span :class="{ 'line-through': st.completed }">{{ st.title }}</span>
              </div>
            </div>

            <!-- Meta Details: Due date, assignee, category -->
            <div class="flex flex-wrap items-center gap-3 text-[11px] text-warmgray pt-1">
              <span class="inline-flex items-center gap-1">
                <Calendar class="w-3 h-3 text-gold" />
                <span>{{ formatDate(task.dueDate) }}</span>
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1">
                <User class="w-3 h-3 text-gold" />
                <span>{{ task.assignedTo }}</span>
              </span>
              <span>•</span>
              <span class="px-2 py-0.5 rounded-md bg-ivory dark:bg-charcoal-900 border border-champagne/30 text-[10px] font-medium">
                {{ task.category }}
              </span>
            </div>
          </div>
        </div>

        <!-- Priority & Actions -->
        <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-champagne/20">
          <span 
            class="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
            :class="{
              'bg-rose/20 text-rose-dark dark:text-rose-light': task.priority === 'High',
              'bg-champagne/40 text-gold-dark dark:text-gold-light': task.priority === 'Medium',
              'bg-ivory dark:bg-charcoal-light text-warmgray': task.priority === 'Low'
            }"
          >
            {{ task.priority }} Priority
          </span>

          <div class="flex items-center gap-1">
            <button 
              type="button" 
              @click="openTaskModal(task)"
              class="p-2 rounded-xl text-warmgray hover:text-gold hover:bg-champagne/20 transition-colors"
              title="Edit task"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button 
              type="button" 
              @click="confirmDeleteTask(task.id)"
              class="p-2 rounded-xl text-warmgray hover:text-rose-dark hover:bg-rose/20 transition-colors"
              title="Delete task"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredTasks.length === 0" class="p-12 text-center text-warmgray text-xs bg-white dark:bg-charcoal rounded-3xl border border-champagne/40">
        No tasks found in this view.
      </div>
    </div>

    <!-- TIMELINE VIEW -->
    <div v-else class="relative border-l-2 border-champagne/60 dark:border-charcoal-light ml-4 sm:ml-6 space-y-8 py-4">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id"
        class="relative pl-6 group"
      >
        <!-- Circle indicator on line -->
        <div 
          class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-charcoal flex items-center justify-center"
          :class="task.completed ? 'bg-emerald-500' : 'bg-gold'"
        ></div>

        <div class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-2 max-w-2xl">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-semibold text-gold">{{ formatDate(task.dueDate) }}</span>
            <span class="text-[10px] uppercase font-bold text-warmgray">{{ task.category }}</span>
          </div>
          <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory" :class="{ 'line-through text-warmgray': task.completed }">
            {{ task.title }}
          </h4>
          <p v-if="task.description" class="text-xs text-warmgray">{{ task.description }}</p>
          <div class="flex items-center justify-between pt-2 border-t border-champagne/20 text-xs text-warmgray">
            <span>Assigned: {{ task.assignedTo }}</span>
            <button type="button" @click="checklistStore.toggleTask(task.id)" class="text-gold font-semibold hover:underline">
              {{ task.completed ? 'Mark Pending' : 'Mark Complete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add / Edit Task -->
    <Modal 
      :is-open="isTaskModalOpen" 
      :title="editingTaskId ? 'Edit Wedding Task' : 'Create New Wedding Task'" 
      size="md" 
      @close="isTaskModalOpen = false"
    >
      <form @submit.prevent="handleSaveTask" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Task Title *</label>
          <input 
            v-model="taskForm.title"
            type="text" 
            required
            placeholder="e.g. Schedule final bridal lehenga trial"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden focus:border-gold"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Description / Action Items</label>
          <textarea 
            v-model="taskForm.description"
            rows="2"
            placeholder="Key specifics, appointment times, phone contacts..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Due Date *</label>
            <input 
              v-model="taskForm.dueDate"
              type="date" 
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Priority Level</label>
            <select 
              v-model="taskForm.priority"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Category</label>
            <select 
              v-model="taskForm.category"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Assigned To</label>
            <input 
              v-model="taskForm.assignedTo"
              type="text" 
              placeholder="e.g. Partner 1, Mother, Planner"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <!-- Subtasks Editor -->
        <div class="pt-2 border-t border-champagne/30 space-y-2">
          <label class="font-semibold text-warmgray uppercase">Subtasks Checklist</label>
          <div class="flex gap-2">
            <input 
              v-model="taskForm.subtaskDraft"
              type="text" 
              placeholder="Add checklist sub-item..."
              @keydown.enter.prevent="addSubtaskToDraft"
              class="flex-1 px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            />
            <button 
              type="button" 
              @click="addSubtaskToDraft"
              class="px-4 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-gold/40 text-gold font-semibold text-xs"
            >
              Add
            </button>
          </div>

          <div v-if="subtasksList.length" class="space-y-1.5 pt-2">
            <div 
              v-for="(st, idx) in subtasksList" 
              :key="st.id"
              class="flex items-center justify-between p-2 rounded-lg bg-ivory dark:bg-charcoal-900 text-xs"
            >
              <span class="truncate">{{ st.title }}</span>
              <button type="button" @click="removeSubtaskFromDraft(idx)" class="text-rose-dark hover:text-rose">
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isTaskModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold shadow-xs">
            {{ editingTaskId ? 'Save Task' : 'Create Task' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Task"
      message="Are you sure you want to delete this wedding task? This action cannot be undone."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDeleteTask"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
