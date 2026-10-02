import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, Subtask } from '@/types'
import { defaultTasks } from '@/data/mockData'
import { getStoredItem, setStoredItem } from '@/utils/storage'
import { isTaskOverdue } from '@/utils/date'

export const useChecklistStore = defineStore('checklist', () => {
  const tasks = ref<Task[]>(getStoredItem('checklist_tasks', defaultTasks))

  function persist() {
    setStoredItem('checklist_tasks', tasks.value)
  }

  // Getters
  const totalTasksCount = computed(() => tasks.value.length)
  const completedTasksCount = computed(() => tasks.value.filter(t => t.completed).length)
  const pendingTasksCount = computed(() => tasks.value.filter(t => !t.completed).length)
  const progressPercentage = computed(() => {
    if (!tasks.value.length) return 0
    return Math.round((completedTasksCount.value / tasks.value.length) * 100)
  })

  const overdueTasks = computed(() => {
    return tasks.value.filter(t => !t.completed && isTaskOverdue(t.dueDate, t.completed))
  })

  const upcomingTasks = computed(() => {
    return tasks.value
      .filter(t => !t.completed && !isTaskOverdue(t.dueDate, t.completed))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  })

  // Actions
  function addTask(taskData: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      subtasks: taskData.subtasks || []
    }
    tasks.value.unshift(newTask)
    persist()
    return newTask
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = {
        ...tasks.value[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      persist()
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    persist()
  }

  function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      if (task.completed && task.subtasks) {
        task.subtasks.forEach(st => (st.completed = true))
      }
      persist()
    }
  }

  function addSubtask(taskId: string, title: string) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      if (!task.subtasks) task.subtasks = []
      task.subtasks.push({
        id: `st-${Date.now()}`,
        title,
        completed: false
      })
      persist()
    }
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && task.subtasks) {
      const st = task.subtasks.find(s => s.id === subtaskId)
      if (st) {
        st.completed = !st.completed
        // If all subtasks completed, mark task completed
        if (task.subtasks.every(s => s.completed)) {
          task.completed = true
        } else {
          task.completed = false
        }
        persist()
      }
    }
  }

  return {
    tasks,
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    progressPercentage,
    overdueTasks,
    upcomingTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addSubtask,
    toggleSubtask
  }
})
