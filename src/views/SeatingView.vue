<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Armchair,
  Plus,
  Trash2,
  Edit2,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  Move,
  UserX,
  ChevronDown
} from 'lucide-vue-next'
import { useSeatingStore } from '@/stores/seating'
import { useGuestStore } from '@/stores/guests'
import { useTimelineStore } from '@/stores/timeline'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Table, TableShape } from '@/types'

const seatingStore = useSeatingStore()
const guestStore = useGuestStore()
const timelineStore = useTimelineStore()

const selectedEventId = ref(timelineStore.events[0]?.id || '')
const guestSearchQuery = ref('')

const isAddTableModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const tableToDeleteId = ref<string | null>(null)
const editingTableId = ref<string | null>(null)

// Table Form
const tableForm = ref({
  name: '',
  shape: 'Round' as TableShape,
  capacity: 8,
  eventId: selectedEventId.value
})

function openTableModal(table?: Table) {
  if (table) {
    editingTableId.value = table.id
    tableForm.value = {
      name: table.name,
      shape: table.shape,
      capacity: table.capacity,
      eventId: table.eventId
    }
  } else {
    editingTableId.value = null
    tableForm.value = {
      name: `Table ${seatingStore.tables.length + 1}`,
      shape: 'Round',
      capacity: 8,
      eventId: selectedEventId.value
    }
  }
  isAddTableModalOpen.value = true
}

function handleSaveTable() {
  if (!tableForm.value.name.trim()) return

  if (editingTableId.value) {
    seatingStore.updateTable(editingTableId.value, tableForm.value)
  } else {
    seatingStore.addTable({
      ...tableForm.value,
      eventId: selectedEventId.value || 'evt-default'
    })
  }
  isAddTableModalOpen.value = false
}

function confirmDeleteTable(id: string) {
  tableToDeleteId.value = id
  isDeleteDialogOpen.value = true
}

function executeDeleteTable() {
  if (tableToDeleteId.value) {
    seatingStore.deleteTable(tableToDeleteId.value)
    tableToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

// Drag & drop handlers
function onDragStart(event: DragEvent, guestId: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', guestId)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDropToTable(event: DragEvent, tableId: string) {
  event.preventDefault()
  if (event.dataTransfer) {
    const guestId = event.dataTransfer.getData('text/plain')
    if (guestId) {
      seatingStore.assignGuestToTable(guestId, tableId)
    }
  }
}

function onDropToUnassigned(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    const guestId = event.dataTransfer.getData('text/plain')
    if (guestId) {
      seatingStore.removeGuestFromTable(guestId)
    }
  }
}

const filteredUnassignedGuests = computed(() => {
  return seatingStore.unassignedGuests.filter(g => {
    if (!guestSearchQuery.value.trim()) return true
    return g.fullName.toLowerCase().includes(guestSearchQuery.value.toLowerCase()) ||
      g.group.toLowerCase().includes(guestSearchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Seating Arrangement Studio</h1>
        <p class="text-xs text-warmgray">Visual table builder, seating caps, and drag-and-drop guest allocation</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Event selector -->
        <select 
          v-model="selectedEventId"
          class="px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light text-xs font-semibold text-charcoal dark:text-ivory focus:outline-hidden"
        >
          <option v-for="evt in timelineStore.events" :key="evt.id" :value="evt.id">
            {{ evt.name }} (Seating Plan)
          </option>
        </select>

        <button 
          type="button" 
          @click="openTableModal()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>
    </div>

    <!-- Seating Capacity Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft">
        <span class="text-xs font-semibold uppercase text-warmgray">Total Tables</span>
        <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory mt-1">{{ seatingStore.tables.length }} Tables</div>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft">
        <span class="text-xs font-semibold uppercase text-warmgray">Total Chair Capacity</span>
        <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory mt-1">{{ seatingStore.totalTableCapacity }} Seats</div>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft">
        <span class="text-xs font-semibold uppercase text-warmgray">Assigned Guests</span>
        <div class="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ seatingStore.totalAssignedSeats }} Placed</div>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft">
        <span class="text-xs font-semibold uppercase text-warmgray">Remaining Open Chairs</span>
        <div class="font-serif text-2xl font-bold text-gold mt-1">{{ seatingStore.totalRemainingSeats }} Open</div>
      </div>
    </div>

    <!-- Main Studio Split View (Tables Canvas vs Unassigned Sidebar) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Visual Tables Canvas (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-warmgray">Active Floor Layout Canvas</span>
          <span class="text-xs text-warmgray">Tip: Drag guests directly onto tables or use dropdown assign</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="tbl in seatingStore.tableStats" 
            :key="tbl.id"
            @dragover.prevent
            @drop="onDropToTable($event, tbl.id)"
            class="p-6 rounded-3xl bg-white dark:bg-charcoal border-2 transition-all flex flex-col justify-between shadow-soft hover:shadow-luxury"
            :class="tbl.isOver 
              ? 'border-rose-dark bg-rose/5' 
              : tbl.isFull 
                ? 'border-emerald-500/50' 
                : 'border-champagne/50 dark:border-charcoal-light'"
          >
            <!-- Table Header -->
            <div class="space-y-2 pb-3 border-b border-champagne/30 dark:border-charcoal-light/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <!-- Visual Shape Representation -->
                  <div 
                    class="w-8 h-8 rounded-lg border-2 border-gold/60 flex items-center justify-center font-bold text-[10px] text-gold"
                    :class="{
                      'rounded-full': tbl.shape === 'Round',
                      'rounded-none': tbl.shape === 'Rectangle',
                      'rounded-sm': tbl.shape === 'Square'
                    }"
                  >
                    {{ tbl.shape[0] }}
                  </div>
                  <div>
                    <h3 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ tbl.name }}</h3>
                    <span class="text-[10px] text-warmgray">{{ tbl.shape }} Table • Cap {{ tbl.capacity }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <button 
                    type="button" 
                    @click="openTableModal(tbl)"
                    class="p-1 rounded-md text-warmgray hover:text-gold"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button" 
                    @click="confirmDeleteTable(tbl.id)"
                    class="p-1 rounded-md text-warmgray hover:text-rose-dark"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Seat count badge -->
              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-warmgray">Occupancy:</span>
                <span 
                  class="font-mono font-bold"
                  :class="tbl.isOver ? 'text-rose-dark' : tbl.isFull ? 'text-emerald-600' : 'text-gold'"
                >
                  {{ tbl.occupied }} / {{ tbl.capacity }} Seats
                </span>
              </div>
            </div>

            <!-- Assigned Guests at this Table -->
            <div class="my-4 min-h-[100px] space-y-1.5 overflow-y-auto max-h-48">
              <div 
                v-for="guest in tbl.guests" 
                :key="guest.id"
                draggable="true"
                @dragstart="onDragStart($event, guest.id)"
                class="p-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light flex items-center justify-between text-xs cursor-move hover:border-gold transition-colors group"
              >
                <div class="flex items-center gap-2 truncate">
                  <Move class="w-3 h-3 text-warmgray shrink-0 group-hover:text-gold" />
                  <span class="font-medium text-charcoal dark:text-ivory truncate">{{ guest.fullName }}</span>
                  <span v-if="guest.accompanyingGuests" class="text-[10px] text-warmgray">(+{{ guest.accompanyingGuests }})</span>
                </div>
                <button 
                  type="button" 
                  @click="seatingStore.removeGuestFromTable(guest.id)"
                  class="text-warmgray hover:text-rose-dark opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Unseat guest"
                >
                  <UserX class="w-3.5 h-3.5" />
                </button>
              </div>

              <div v-if="tbl.guests.length === 0" class="h-24 flex items-center justify-center text-center text-xs text-warmgray/70 border border-dashed border-champagne/50 rounded-xl">
                Drop guests here or use dropdown
              </div>
            </div>

            <!-- Quick Seat Selection Dropdown (Accessible control) -->
            <div class="pt-3 border-t border-champagne/30 dark:border-charcoal-light/30">
              <select 
                @change="(e: any) => { if (e.target.value) { seatingStore.assignGuestToTable(e.target.value, tbl.id); e.target.value = ''; } }"
                class="w-full px-2.5 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-[11px] text-warmgray focus:outline-hidden"
              >
                <option value="">+ Assign Guest to this table...</option>
                <option 
                  v-for="unassigned in seatingStore.unassignedGuests" 
                  :key="unassigned.id" 
                  :value="unassigned.id"
                >
                  {{ unassigned.fullName }} ({{ unassigned.group }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="seatingStore.tables.length === 0" class="p-12 text-center text-warmgray text-xs bg-white dark:bg-charcoal rounded-3xl border border-champagne/40">
          No tables created for this function yet. Click "+ Add Table" above to create round, rectangular, or square tables.
        </div>
      </div>

      <!-- Right: Unassigned Guests List Sidebar (4 cols) -->
      <div 
        @dragover.prevent
        @drop="onDropToUnassigned($event)"
        class="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4"
      >
        <div class="flex items-center justify-between pb-2 border-b border-champagne/30 dark:border-charcoal-light/30">
          <div>
            <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Unassigned Guests</h3>
            <p class="text-xs text-warmgray">{{ seatingStore.unassignedGuests.length }} guests without tables</p>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-gold animate-pulse"></span>
        </div>

        <!-- Search input for unassigned guests -->
        <div class="relative">
          <Search class="w-3.5 h-3.5 text-warmgray absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="guestSearchQuery"
            type="text" 
            placeholder="Filter unassigned guests..."
            class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
          />
        </div>

        <!-- Draggable Guest Cards -->
        <div class="max-h-[500px] overflow-y-auto space-y-2 pr-1">
          <div 
            v-for="guest in filteredUnassignedGuests"
            :key="guest.id"
            draggable="true"
            @dragstart="onDragStart($event, guest.id)"
            class="p-3 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 dark:border-charcoal-light cursor-move hover:border-gold transition-all shadow-xs flex items-center justify-between text-xs group"
          >
            <div class="truncate min-w-0 pr-2">
              <div class="font-semibold text-charcoal dark:text-ivory truncate">{{ guest.fullName }}</div>
              <div class="text-[10px] text-warmgray">{{ guest.side }} • {{ guest.group }}</div>
            </div>

            <!-- Table select shortcut -->
            <select 
              @change="(e: any) => { if (e.target.value) seatingStore.assignGuestToTable(guest.id, e.target.value) }"
              class="px-2 py-1 rounded-lg bg-white dark:bg-charcoal border border-champagne/60 text-[10px] text-gold font-medium focus:outline-hidden"
            >
              <option value="">Assign...</option>
              <option v-for="t in seatingStore.tables" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>

          <div v-if="filteredUnassignedGuests.length === 0" class="py-8 text-center text-xs text-warmgray">
            All guests are seated!
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Add / Edit Table -->
    <Modal :is-open="isAddTableModalOpen" :title="editingTableId ? 'Edit Table Settings' : 'Add New Table'" size="sm" @close="isAddTableModalOpen = false">
      <form @submit.prevent="handleSaveTable" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Table Name *</label>
          <input 
            v-model="tableForm.name"
            type="text" 
            required
            placeholder="e.g. Table 1: Royal Family"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Shape</label>
            <select 
              v-model="tableForm.shape"
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
            >
              <option value="Round">Round Table</option>
              <option value="Rectangle">Rectangular Banquet</option>
              <option value="Square">Square Lounge</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Seat Capacity</label>
            <input 
              v-model.number="tableForm.capacity"
              type="number" 
              min="2"
              max="30"
              required
              class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-mono focus:outline-hidden"
            />
          </div>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isAddTableModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold shadow-xs">
            {{ editingTableId ? 'Save Table' : 'Create Table' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Table Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Table"
      message="Are you sure you want to delete this table? All seated guests will be returned to the unassigned list."
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDeleteTable"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
