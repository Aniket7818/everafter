<script setup lang="ts">
import { ref } from 'vue'
import {
  Share2,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  Send,
  UserPlus,
  MessageSquare
} from 'lucide-vue-next'
import { useCollaborationStore } from '@/stores/collaboration'
import { useChecklistStore } from '@/stores/checklist'
import { useWorkspaceStore } from '@/stores/workspace'
import Modal from '@/components/common/Modal.vue'

const collabStore = useCollaborationStore()
const checklistStore = useChecklistStore()
const workspaceStore = useWorkspaceStore()

const newNote = ref('')
const selectedRole = ref<'Partner' | 'Family' | 'Planner'>('Partner')

const teamMembers = [
  { name: workspaceStore.workspace.couple.partner1Name || 'Partner 1', role: 'Partner (Bride)', avatar: 'P1', color: 'bg-gold/20 text-gold-dark' },
  { name: workspaceStore.workspace.couple.partner2Name || 'Partner 2', role: 'Partner (Groom)', avatar: 'P2', color: 'bg-champagne/40 text-charcoal' },
  { name: 'Devika Narain', role: 'Lead Wedding Planner', avatar: 'DN', color: 'bg-sage/20 text-sage-dark' },
  { name: 'Pooja Auntie', role: 'Family Delegate', avatar: 'PA', color: 'bg-rose/20 text-rose-dark' }
]

function postActivityNote() {
  if (newNote.value.trim()) {
    collabStore.logActivity(
      'posted note',
      `"${newNote.value.trim()}"`,
      selectedRole.value === 'Partner' ? workspaceStore.workspace.couple.partner1Name : selectedRole.value,
      selectedRole.value
    )
    newNote.value = ''
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Family &amp; Planner Collaboration Hub</h1>
        <p class="text-xs text-warmgray">Coordinate delegated responsibilities, log discussions, and track family updates</p>
      </div>

      <div class="px-3.5 py-1.5 rounded-full bg-champagne/30 text-gold-dark text-xs font-semibold">
        Local Multi-User Simulation
      </div>
    </div>

    <!-- Team Members Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="member in teamMembers" 
        :key="member.name"
        class="p-5 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-3"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" :class="member.color">
            {{ member.avatar }}
          </div>
          <div>
            <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ member.name }}</h4>
            <span class="text-[10px] text-warmgray">{{ member.role }}</span>
          </div>
        </div>
        <div class="text-[11px] text-warmgray flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Access Granted</span>
        </div>
      </div>
    </div>

    <!-- Main Two-Column Grid: Live Activity Feed vs Shared Task Delegation -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Activity Feed & Note Posting (7 cols) -->
      <div class="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-6">
        <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
          <div>
            <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Shared Activity Stream</h3>
            <p class="text-xs text-warmgray">Audit trail of payments, RSVP approvals, and updates</p>
          </div>
          <Clock class="w-4 h-4 text-warmgray" />
        </div>

        <!-- Post a Note Box -->
        <div class="p-4 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/40 space-y-3">
          <textarea 
            v-model="newNote"
            rows="2"
            placeholder="Share an update with the family or planner..."
            class="w-full p-3 rounded-xl bg-white dark:bg-charcoal border border-champagne/50 text-xs focus:outline-hidden"
          ></textarea>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs">
              <span class="text-warmgray">Posting as:</span>
              <select v-model="selectedRole" class="px-2 py-1 rounded-lg bg-white dark:bg-charcoal border border-champagne/50 text-xs">
                <option value="Partner">Partner (Bride / Groom)</option>
                <option value="Planner">Wedding Planner</option>
                <option value="Family">Family Member</option>
              </select>
            </div>

            <button 
              type="button" 
              @click="postActivityNote"
              class="px-4 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-xs flex items-center gap-1"
            >
              <span>Post Note</span>
              <Send class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Feed List -->
        <div class="space-y-4">
          <div 
            v-for="act in collabStore.activities" 
            :key="act.id"
            class="p-4 rounded-2xl bg-ivory/50 dark:bg-charcoal-900 border border-champagne/30 flex items-start justify-between gap-3 text-xs"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-charcoal dark:text-ivory">{{ act.authorName }}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-champagne/30 text-gold-dark font-medium">
                  {{ act.authorRole }}
                </span>
              </div>
              <p class="text-warmgray">
                {{ act.action }} <span class="font-semibold text-charcoal dark:text-ivory">{{ act.target }}</span>
              </p>
            </div>
            <span class="text-[10px] text-warmgray shrink-0">{{ act.timestamp }}</span>
          </div>
        </div>
      </div>

      <!-- Shared Task Delegations (5 cols) -->
      <div class="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-champagne/30 dark:border-charcoal-light/40">
          <div>
            <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory">Delegated Tasks</h3>
            <p class="text-xs text-warmgray">Assignments by team member</p>
          </div>
          <router-link to="/checklist" class="text-xs text-gold font-semibold hover:underline">
            Checklist →
          </router-link>
        </div>

        <div class="space-y-3">
          <div 
            v-for="task in checklistStore.tasks.slice(0, 6)"
            :key="task.id"
            class="p-3.5 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/30 space-y-1.5"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-charcoal dark:text-ivory line-clamp-1" :class="{ 'line-through text-warmgray': task.completed }">
                {{ task.title }}
              </span>
              <input 
                type="checkbox" 
                :checked="task.completed"
                @change="checklistStore.toggleTask(task.id)"
                class="w-4 h-4 rounded text-gold cursor-pointer"
              />
            </div>
            <div class="flex items-center justify-between text-[10px] text-warmgray">
              <span>Assigned: <strong class="text-gold">{{ task.assignedTo }}</strong></span>
              <span>Due: {{ task.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
