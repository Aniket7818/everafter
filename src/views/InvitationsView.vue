<script setup lang="ts">
import { ref } from 'vue'
import {
  Mail,
  Copy,
  Printer,
  Sparkles,
  Share2,
  Check,
  Eye,
  RotateCcw,
  Palette,
  ExternalLink
} from 'lucide-vue-next'
import { useInvitationStore } from '@/stores/invitations'
import { useWorkspaceStore } from '@/stores/workspace'
import type { InvitationTemplate } from '@/types'

const invitationStore = useInvitationStore()
const workspaceStore = useWorkspaceStore()

const templates: { id: InvitationTemplate; name: string; desc: string }[] = [
  { id: 'Royal', name: 'Royal Rajputana', desc: 'Arched gold filigree & palatial grandeur' },
  { id: 'Traditional Indian', name: 'Vedic Heritage', desc: 'Warm vermilion, marigold & sacred mantras' },
  { id: 'Minimal', name: 'Contemporary Minimal', desc: 'Editorial serif typography & ample whitespace' },
  { id: 'Floral', name: 'Romantic Botanical', desc: 'Pastel peonies, eucalyptus & botanical wreaths' },
  { id: 'Modern', name: 'Metropolitan Chic', desc: 'Sleek dark card with foil-stamped gold accents' },
  { id: 'Garden', name: 'English Garden', desc: 'Soft sage greens and delicate hand-drawn florals' },
  { id: 'Destination', name: 'Azure Coastal', desc: 'Golden sands and breezy sunset watercolor' }
]

const isCopied = ref(false)

function copyInvitationText() {
  const inv = invitationStore.invitation
  const text = `✨ ${inv.title} ✨\n\n${inv.coupleNames} joyfully invite you to:\n${inv.eventName}\n\n📅 Date: ${inv.date}\n⏰ Time: ${inv.time}\n📍 Venue: ${inv.venue}, ${inv.address}\n👔 Dress Code: ${inv.dressCode || 'Formal Ethnic'}\n\n"${inv.personalMessage}"\n\nRSVP online: ${window.location.origin}/rsvp/EA-9001 (Demo code)`

  navigator.clipboard.writeText(text)
  isCopied.value = true
  setTimeout(() => { isCopied.value = false }, 3000)
}

function printInvitation() {
  window.print()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Digital Invitation Studio</h1>
        <p class="text-xs text-warmgray">Customize couture stationery, select heritage motifs, and generate digital cards</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="copyInvitationText"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Check v-if="isCopied" class="w-3.5 h-3.5 text-emerald-500" />
          <Copy v-else class="w-3.5 h-3.5 text-gold" />
          <span>{{ isCopied ? 'Text Copied!' : 'Copy Text' }}</span>
        </button>

        <button 
          type="button" 
          @click="printInvitation"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-charcoal border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory shadow-xs hover:border-gold transition-colors"
        >
          <Printer class="w-3.5 h-3.5 text-gold" />
          <span>Print Card</span>
        </button>

        <button 
          type="button" 
          @click="invitationStore.resetInvitation"
          class="p-2 rounded-xl border border-champagne/60 text-warmgray hover:text-charcoal"
          title="Reset to default template"
        >
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Template Chooser Bar -->
    <div class="space-y-2 no-print">
      <span class="text-xs font-semibold uppercase tracking-wider text-warmgray">Choose Aesthetic Template</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div 
          v-for="tmpl in templates" 
          :key="tmpl.id"
          @click="invitationStore.updateInvitation({ template: tmpl.id })"
          class="p-3 rounded-2xl border cursor-pointer transition-all text-center flex flex-col justify-between"
          :class="invitationStore.invitation.template === tmpl.id 
            ? 'border-gold bg-champagne/30 dark:bg-charcoal-light font-bold text-gold-dark dark:text-gold-light shadow-xs' 
            : 'border-champagne/40 dark:border-charcoal-light/40 bg-white dark:bg-charcoal hover:border-gold/40 text-warmgray'"
        >
          <span class="font-serif text-sm">{{ tmpl.name }}</span>
          <span class="text-[10px] opacity-75 mt-1 line-clamp-1">{{ tmpl.desc }}</span>
        </div>
      </div>
    </div>

    <!-- Studio Two-Column Grid (Editor vs Live Card Preview) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Form Controls (5 cols) -->
      <div class="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft space-y-4 no-print text-xs">
        <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory pb-2 border-b border-champagne/30">
          Card Customization
        </h3>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Couple Names</label>
          <input 
            v-model="invitationStore.invitation.coupleNames"
            type="text" 
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Ceremony / Event Name</label>
          <input 
            v-model="invitationStore.invitation.eventName"
            type="text" 
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Date Display</label>
            <input 
              v-model="invitationStore.invitation.date"
              type="text" 
              class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Time Display</label>
            <input 
              v-model="invitationStore.invitation.time"
              type="text" 
              class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Venue Name</label>
          <input 
            v-model="invitationStore.invitation.venue"
            type="text" 
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Address / Location</label>
          <input 
            v-model="invitationStore.invitation.address"
            type="text" 
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Dress Code</label>
          <input 
            v-model="invitationStore.invitation.dressCode"
            type="text" 
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Personal Message / Blessing</label>
          <textarea 
            v-model="invitationStore.invitation.personalMessage"
            rows="3"
            class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Theme Accent</label>
            <input 
              v-model="invitationStore.invitation.primaryColor"
              type="color" 
              class="w-full h-9 rounded-xl cursor-pointer bg-transparent border-0"
            />
          </div>
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Background Motif</label>
            <select 
              v-model="invitationStore.invitation.backgroundStyle"
              class="w-full px-3 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs"
            >
              <option value="palace-arches">Royal Palace Arches</option>
              <option value="gold-border">Gold Leaf Border</option>
              <option value="botanical">Botanical Foliage</option>
              <option value="clean">Clean Minimalist</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Right Column: Live Card Preview Canvas (7 cols) -->
      <div class="lg:col-span-7 flex flex-col items-center justify-center">
        <!-- The Invitation Card Frame -->
        <div 
          id="invitation-card-print"
          class="relative w-full max-w-md min-h-[580px] rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-300 flex flex-col justify-between text-center select-none"
          :class="{
            'bg-ivory text-charcoal border-8 border-double border-gold/70': invitationStore.invitation.template === 'Royal',
            'bg-[#FAF4EC] text-[#5C2C1D] border-4 border-[#C88A58]': invitationStore.invitation.template === 'Traditional Indian',
            'bg-white text-charcoal border border-champagne-dark': invitationStore.invitation.template === 'Minimal',
            'bg-[#FDFBF7] text-charcoal border-2 border-sage': invitationStore.invitation.template === 'Floral',
            'bg-charcoal text-ivory border-2 border-gold': invitationStore.invitation.template === 'Modern',
            'bg-[#F4F7F2] text-charcoal border border-sage-dark': invitationStore.invitation.template === 'Garden',
            'bg-[#F5F8FA] text-charcoal border border-sky-300': invitationStore.invitation.template === 'Destination'
          }"
        >
          <!-- Corner Palace Motifs -->
          <div class="text-xs uppercase tracking-[0.3em] font-semibold text-gold mb-4">
            || Shubh Vivah ||
          </div>

          <!-- Top Couple Monogram -->
          <div class="space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full border border-gold/50 flex items-center justify-center font-serif text-lg font-bold text-gold">
              {{ invitationStore.invitation.coupleNames[0] || 'A' }}&amp;{{ invitationStore.invitation.coupleNames.split('&')[1]?.trim()?.[0] || 'R' }}
            </div>
            
            <p class="text-[11px] uppercase tracking-widest text-warmgray">
              Together with their families
            </p>

            <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal dark:text-ivory leading-tight">
              {{ invitationStore.invitation.coupleNames }}
            </h2>

            <p class="text-xs text-warmgray italic">
              request the honor of your presence to celebrate
            </p>

            <div class="font-serif text-xl sm:text-2xl font-bold text-gold-dark dark:text-gold-light py-1">
              {{ invitationStore.invitation.eventName }}
            </div>
          </div>

          <!-- Mid Date & Location -->
          <div class="space-y-2 py-4 border-y border-champagne/50">
            <div class="font-serif text-lg font-bold">
              {{ invitationStore.invitation.date }}
            </div>
            <div class="text-xs uppercase tracking-widest text-warmgray">
              {{ invitationStore.invitation.time }}
            </div>
            <div class="text-xs font-semibold pt-1">
              {{ invitationStore.invitation.venue }}
            </div>
            <div class="text-[11px] text-warmgray">
              {{ invitationStore.invitation.address }}
            </div>
          </div>

          <!-- Personal Message & Dress Code -->
          <div class="space-y-3 mt-4">
            <p class="text-xs italic text-warmgray max-w-xs mx-auto leading-relaxed">
              “{{ invitationStore.invitation.personalMessage }}”
            </p>

            <div v-if="invitationStore.invitation.dressCode" class="text-[11px] text-warmgray">
              <span class="font-semibold text-gold">Dress Code:</span> {{ invitationStore.invitation.dressCode }}
            </div>

            <!-- Demo RSVP Pill -->
            <div class="pt-2">
              <router-link 
                to="/rsvp/EA-9001" 
                target="_blank"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/15 text-gold-dark dark:text-gold-light text-[10px] font-bold uppercase tracking-wider hover:bg-gold hover:text-white transition-colors"
              >
                <span>RSVP Online (Demo)</span>
                <ExternalLink class="w-3 h-3" />
              </router-link>
            </div>
          </div>
        </div>

        <p class="text-[11px] text-warmgray mt-3 text-center no-print">
          This digital invitation preview uses browser-local styling and supports high-resolution printing.
        </p>
      </div>
    </div>
  </div>
</template>
