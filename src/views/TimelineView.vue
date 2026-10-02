<script setup lang="ts">
import { ref } from 'vue'
import {
  CalendarDays,
  Plus,
  Download,
  Printer,
  Clock,
  MapPin,
  AlertTriangle,
  MoveUp,
  MoveDown,
  Edit2,
  Trash2,
  Users,
  Sparkles,
  ShoppingBag,
  CheckCircle2
} from 'lucide-vue-next'
import { useTimelineStore } from '@/stores/timeline'
import { useVendorStore } from '@/stores/vendors'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatDate } from '@/utils/date'
import type { WeddingEvent } from '@/types'

const timelineStore = useTimelineStore()
const vendorStore = useVendorStore()
const workspaceStore = useWorkspaceStore()

const isEventModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const eventToDeleteId = ref<string | null>(null)
const editingEventId = ref<string | null>(null)

const eventForm = ref({
  name: '',
  date: workspaceStore.weddingDate || '2026-11-28',
  startTime: '16:00',
  endTime: '20:30',
  venue: '',
  description: '',
  dressCode: '',
  notes: '',
  assignedVendorIds: [] as string[]
})

function openEventModal(event?: WeddingEvent) {
  if (event) {
    editingEventId.value = event.id
    eventForm.value = {
      name: event.name,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      description: event.description,
      dressCode: event.dressCode || '',
      notes: event.notes || '',
      assignedVendorIds: [...(event.assignedVendorIds || [])]
    }
  } else {
    editingEventId.value = null
    eventForm.value = {
      name: '',
      date: workspaceStore.weddingDate || '2026-11-28',
      startTime: '17:00',
      endTime: '21:00',
      venue: `${workspaceStore.workspace.location.city} Palace Courtyard`,
      description: '',
      dressCode: 'Formal Ethnic Wear',
      notes: '',
      assignedVendorIds: []
    }
  }
  isEventModalOpen.value = true
}

function handleSaveEvent() {
  if (!eventForm.value.name.trim()) return

  if (editingEventId.value) {
    timelineStore.updateEvent(editingEventId.value, {
      ...eventForm.value
    })
  } else {
    timelineStore.addEvent({
      ...eventForm.value,
      assignedTaskIds: []
    })
  }
  isEventModalOpen.value = false
}

function moveUp(idx: number) {
  if (idx <= 0) return
  const list = [...timelineStore.sortedEvents]
  const temp = list[idx]
  list[idx] = list[idx - 1]
  list[idx - 1] = temp
  timelineStore.reorderEvents(list)
}

function moveDown(idx: number) {
  const list = [...timelineStore.sortedEvents]
  if (idx >= list.length - 1) return
  const temp = list[idx]
  list[idx] = list[idx + 1]
  list[idx + 1] = temp
  timelineStore.reorderEvents(list)
}

function confirmDelete(id: string) {
  eventToDeleteId.value = id
  isDeleteDialogOpen.value = true
}

function executeDelete() {
  if (eventToDeleteId.value) {
    timelineStore.deleteEvent(eventToDeleteId.value)
    eventToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

function printTimeline() {
  window.print()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Wedding Timeline &amp; Functions</h1>
        <p class="text-xs text-warmgray">Chronological ceremony itinerary, venue timings, and automated schedule conflict warning</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="timelineStore.exportTimelineCSV"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Download class="w-3.5 h-3.5 text-gold" />
          <span>Export CSV</span>
        </button>

        <button 
          type="button" 
          @click="printTimeline"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Printer class="w-3.5 h-3.5 text-gold" />
          <span>Print Schedule</span>
        </button>

        <button 
          type="button" 
          @click="openEventModal()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Function</span>
        </button>
      </div>
    </div>

    <!-- Print-only Title Header -->
    <div class="hidden print-only mb-6 text-center">
      <h1 class="text-2xl font-bold font-serif">{{ workspaceStore.coupleNames }}</h1>
      <p class="text-sm">Official Multi-Day Wedding Celebration Itinerary</p>
      <p class="text-xs text-warmgray">{{ workspaceStore.locationDisplay }}</p>
    </div>

    <!-- Overlapping Schedule Conflict Warning -->
    <div 
      v-if="timelineStore.overlappingPairs.length > 0"
      class="p-4 rounded-2xl bg-rose/15 border border-rose text-rose-dark dark:text-rose-light text-xs space-y-1 no-print"
    >
      <div class="flex items-center gap-2 font-bold">
        <AlertTriangle class="w-4 h-4 text-rose-dark shrink-0" />
        <span>Timing Conflict Detected!</span>
      </div>
      <div v-for="(pair, idx) in timelineStore.overlappingPairs" :key="idx" class="pl-6">
        "{{ pair.eventA.name }}" ({{ pair.eventA.startTime }}–{{ pair.eventA.endTime }}) overlaps with "{{ pair.eventB.name }}" ({{ pair.eventB.startTime }}–{{ pair.eventB.endTime }}) on {{ formatDate(pair.eventA.date) }}.
      </div>
    </div>

    <!-- Chronological Timeline Stream -->
    <div class="relative border-l-2 border-champagne/60 dark:border-charcoal-light ml-4 sm:ml-8 space-y-8 py-4">
      <div 
        v-for="(evt, idx) in timelineStore.sortedEvents" 
        :key="evt.id"
        class="relative pl-6 sm:pl-8 group"
      >
        <!-- Milestone Circle -->
        <div class="absolute -left-[11px] top-2 w-5 h-5 rounded-full border-2 border-white dark:border-charcoal bg-gold flex items-center justify-center text-[10px] text-white font-bold shadow-xs">
          {{ evt.order }}
        </div>

        <!-- Event Card -->
        <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft hover:shadow-luxury hover:border-gold/30 transition-all space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-champagne/20 dark:border-charcoal-light/30">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-gold bg-champagne/20 px-2 py-0.5 rounded-md">
                  {{ formatDate(evt.date) }}
                </span>
                <span class="text-xs font-mono text-warmgray">
                  {{ evt.startTime }} - {{ evt.endTime }}
                </span>
              </div>
              <h3 class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">{{ evt.name }}</h3>
              <div class="flex items-center gap-1.5 text-xs text-warmgray">
                <MapPin class="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{{ evt.venue }}</span>
              </div>
            </div>

            <!-- Order Buttons & Actions (Hidden on Print) -->
            <div class="flex items-center gap-1.5 no-print">
              <button 
                type="button" 
                @click="moveUp(idx)"
                :disabled="idx === 0"
                class="p-1.5 rounded-lg border border-champagne/50 text-warmgray hover:text-gold disabled:opacity-30"
                title="Move earlier"
              >
                <MoveUp class="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                @click="moveDown(idx)"
                :disabled="idx === timelineStore.sortedEvents.length - 1"
                class="p-1.5 rounded-lg border border-champagne/50 text-warmgray hover:text-gold disabled:opacity-30"
                title="Move later"
              >
                <MoveDown class="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                @click="openEventModal(evt)"
                class="p-1.5 rounded-lg border border-champagne/50 text-warmgray hover:text-gold"
                title="Edit event"
              >
                <Edit2 class="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                @click="confirmDelete(evt.id)"
                class="p-1.5 rounded-lg border border-champagne/50 text-warmgray hover:text-rose-dark"
                title="Delete event"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">
            {{ evt.description }}
          </p>

          <!-- Dress Code & Notes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div v-if="evt.dressCode" class="p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/30">
              <span class="text-[10px] font-semibold uppercase text-gold block">Suggested Dress Code</span>
              <span class="font-medium text-charcoal dark:text-ivory">{{ evt.dressCode }}</span>
            </div>

            <div v-if="evt.notes" class="p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/30">
              <span class="text-[10px] font-semibold uppercase text-gold block">Logistics &amp; Reminders</span>
              <span class="text-warmgray">{{ evt.notes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add / Edit Wedding Event -->
    <Modal :is-open="isEventModalOpen" :title="editingEventId ? 'Edit Ceremony Function' : 'Add Wedding Function'" size="lg" @close="isEventModalOpen = false">
      <form @submit.prevent="handleSaveEvent" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Function / Ceremony Name *</label>
          <input 
            v-model="eventForm.name"
            type="text" 
            required
            placeholder="e.g. Sangeet &amp; Musical Night"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Event Date *</label>
            <input 
              v-model="eventForm.date"
              type="date" 
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Start Time *</label>
            <input 
              v-model="eventForm.startTime"
              type="time" 
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">End Time *</label>
            <input 
              v-model="eventForm.endTime"
              type="time" 
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Specific Venue / Lawn *</label>
          <input 
            v-model="eventForm.venue"
            type="text" 
            required
            placeholder="e.g. Lakeside Promontory, Udaivilas"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Ceremony Description</label>
          <textarea 
            v-model="eventForm.description"
            rows="2"
            placeholder="Describe the ritual, vibe, music style..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Dress Code Guidelines</label>
            <input 
              v-model="eventForm.dressCode"
              type="text" 
              placeholder="e.g. Royal Red, Pastels, Black Tie"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Important Reminders</label>
            <input 
              v-model="eventForm.notes"
              type="text" 
              placeholder="e.g. Sound curfew at 10 PM, rose water petals"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isEventModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold shadow-xs">
            {{ editingEventId ? 'Save Changes' : 'Add Function' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Wedding Function"
      message="Are you sure you want to delete this event from your timeline? This action cannot be undone."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
