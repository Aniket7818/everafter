<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Clock,
  MapPin,
  Trash2,
  Edit2
} from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { CalendarEvent } from '@/types'

const calendarStore = useCalendarStore()
const workspaceStore = useWorkspaceStore()

const selectedCategory = ref<string>('')
const fullCalendarRef = ref<any>(null)

const isEventModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const eventToDeleteId = ref<string | null>(null)
const editingEventId = ref<string | null>(null)

const eventForm = ref({
  title: '',
  start: new Date().toISOString().slice(0, 10),
  startTime: '11:00',
  allDay: false,
  category: 'function' as CalendarEvent['category'],
  color: '#B99A62',
  location: '',
  description: ''
})

const categoryColors = {
  function: '#B99A62',
  vendor_meeting: '#D8C29D',
  payment_due: '#D9B8B0',
  task_deadline: '#BD968D',
  personal: '#AAB5A0'
}

function openAddEvent(dateStr?: string) {
  editingEventId.value = null
  eventForm.value = {
    title: '',
    start: dateStr || new Date().toISOString().slice(0, 10),
    startTime: '11:00',
    allDay: false,
    category: 'function',
    color: '#B99A62',
    location: '',
    description: ''
  }
  isEventModalOpen.value = true
}

function handleDateClick(arg: any) {
  openAddEvent(arg.dateStr)
}

function handleEventClick(clickInfo: any) {
  const eventId = clickInfo.event.id
  const evt = calendarStore.customEvents.find(e => e.id === eventId)
  if (evt) {
    editingEventId.value = evt.id
    eventForm.value = {
      title: evt.title,
      start: evt.start.slice(0, 10),
      startTime: evt.start.includes('T') ? evt.start.slice(11, 16) : '11:00',
      allDay: !!evt.allDay,
      category: evt.category,
      color: evt.color || categoryColors[evt.category],
      location: evt.location || '',
      description: evt.description || ''
    }
    isEventModalOpen.value = true
  }
}

function handleEventDrop(dropInfo: any) {
  const eventId = dropInfo.event.id
  const newStart = dropInfo.event.startStr
  const newEnd = dropInfo.event.endStr
  calendarStore.updateEvent(eventId, {
    start: newStart,
    end: newEnd || undefined
  })
}

function handleSaveEvent() {
  if (!eventForm.value.title.trim()) return

  const startIso = eventForm.value.allDay 
    ? eventForm.value.start 
    : `${eventForm.value.start}T${eventForm.value.startTime}:00`

  if (editingEventId.value) {
    calendarStore.updateEvent(editingEventId.value, {
      title: eventForm.value.title,
      start: startIso,
      allDay: eventForm.value.allDay,
      category: eventForm.value.category,
      color: categoryColors[eventForm.value.category],
      location: eventForm.value.location,
      description: eventForm.value.description
    })
  } else {
    calendarStore.addEvent({
      title: eventForm.value.title,
      start: startIso,
      allDay: eventForm.value.allDay,
      category: eventForm.value.category,
      color: categoryColors[eventForm.value.category],
      location: eventForm.value.location,
      description: eventForm.value.description
    })
  }
  isEventModalOpen.value = false
}

function confirmDeleteEvent() {
  if (editingEventId.value) {
    eventToDeleteId.value = editingEventId.value
    isEventModalOpen.value = false
    isDeleteDialogOpen.value = true
  }
}

function executeDeleteEvent() {
  if (eventToDeleteId.value) {
    calendarStore.deleteEvent(eventToDeleteId.value)
    eventToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

const calendarEvents = computed(() => {
  return calendarStore.customEvents
    .filter(e => !selectedCategory.value || e.category === selectedCategory.value)
    .map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      backgroundColor: e.color || categoryColors[e.category],
      borderColor: e.color || categoryColors[e.category],
      extendedProps: {
        category: e.category,
        location: e.location,
        description: e.description
      }
    }))
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: 'dayGridMonth',
  initialDate: workspaceStore.weddingDate ? workspaceStore.weddingDate.slice(0, 7) + '-01' : '2026-11-01',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: calendarEvents.value,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  height: 'auto'
}))
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Master Wedding Calendar</h1>
        <p class="text-xs text-warmgray">Schedule functions, tastings, vendor rehearsals, and milestone payment deadlines</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Category Filter -->
        <select 
          v-model="selectedCategory"
          class="px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory focus:outline-hidden"
        >
          <option value="">All Categories</option>
          <option value="function">Wedding Ceremonies</option>
          <option value="vendor_meeting">Vendor Appointments</option>
          <option value="payment_due">Payment Deadlines</option>
          <option value="personal">Personal Reminders</option>
        </select>

        <button 
          type="button" 
          @click="openAddEvent()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>
    </div>

    <!-- Category Legend Bar -->
    <div class="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light text-xs">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#B99A62]"></span>
        <span class="text-warmgray">Wedding Function</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#D8C29D]"></span>
        <span class="text-warmgray">Vendor Meeting / Tasting</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#D9B8B0]"></span>
        <span class="text-warmgray">Payment Deadline</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#AAB5A0]"></span>
        <span class="text-warmgray">Personal Appointment</span>
      </div>
    </div>

    <!-- FullCalendar Wrapper Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft calendar-custom-container">
      <FullCalendar ref="fullCalendarRef" :options="calendarOptions" />
    </div>

    <!-- Modal: Add / Edit Calendar Event -->
    <Modal :is-open="isEventModalOpen" :title="editingEventId ? 'Edit Calendar Event' : 'Add Calendar Event'" size="md" @close="isEventModalOpen = false">
      <form @submit.prevent="handleSaveEvent" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Event Title *</label>
          <input 
            v-model="eventForm.title"
            type="text" 
            required
            placeholder="e.g. Sangeet Dance Rehearsal"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Date *</label>
            <input 
              v-model="eventForm.start"
              type="date" 
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1" v-if="!eventForm.allDay">
            <label class="font-semibold text-warmgray uppercase">Time</label>
            <input 
              v-model="eventForm.startTime"
              type="time" 
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input id="all-day-checkbox" v-model="eventForm.allDay" type="checkbox" class="w-4 h-4 rounded text-gold" />
          <label for="all-day-checkbox" class="text-xs text-warmgray">All-day event</label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Category</label>
            <select 
              v-model="eventForm.category"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="function">Wedding Function</option>
              <option value="vendor_meeting">Vendor Meeting</option>
              <option value="payment_due">Payment Deadline</option>
              <option value="personal">Personal / Fitting</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Location</label>
            <input 
              v-model="eventForm.location"
              type="text" 
              placeholder="e.g. Udaipur, Oberoi Udaivilas"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Description / Notes</label>
          <textarea 
            v-model="eventForm.description"
            rows="2"
            placeholder="Important details, contact phone numbers..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center justify-between">
          <button 
            v-if="editingEventId"
            type="button" 
            @click="confirmDeleteEvent"
            class="text-rose-dark hover:underline flex items-center gap-1 text-xs"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Delete Event</span>
          </button>
          <div v-else></div>

          <div class="flex items-center gap-2">
            <button type="button" @click="isEventModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold shadow-xs">
              {{ editingEventId ? 'Save Changes' : 'Create Event' }}
            </button>
          </div>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Calendar Event"
      message="Are you sure you want to remove this event from your calendar? This action cannot be undone."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDeleteEvent"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>

<style>
/* FullCalendar custom luxury overrides */
.fc {
  font-family: inherit;
  --fc-border-color: rgba(232, 216, 185, 0.4);
  --fc-page-bg-color: transparent;
  --fc-button-bg-color: #FAF7F2;
  --fc-button-border-color: #E8D8B9;
  --fc-button-text-color: #292725;
  --fc-button-hover-bg-color: #B99A62;
  --fc-button-hover-border-color: #B99A62;
  --fc-button-active-bg-color: #B99A62;
  --fc-button-active-border-color: #B99A62;
  --fc-today-bg-color: rgba(185, 154, 98, 0.08);
}

.dark .fc {
  --fc-border-color: rgba(60, 57, 54, 0.6);
  --fc-button-bg-color: #1C1A19;
  --fc-button-border-color: #3C3936;
  --fc-button-text-color: #FAF7F2;
  --fc-button-hover-bg-color: #B99A62;
  --fc-today-bg-color: rgba(185, 154, 98, 0.12);
}

.fc-toolbar-title {
  font-family: 'Cormorant Garamond', Georgia, serif !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
}

.fc-event {
  cursor: pointer;
  border-radius: 6px;
  padding: 2px 4px;
  font-size: 0.75rem;
}
</style>
