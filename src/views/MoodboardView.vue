<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  Tag,
  FolderPlus,
  Upload,
  Check,
  Filter,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next'
import { useMoodboardStore } from '@/stores/moodboard'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { MoodboardItem, MoodboardCollection } from '@/types'

const moodboardStore = useMoodboardStore()

const activeCollectionId = ref(moodboardStore.collections[0]?.id || '')
const selectedCategory = ref<string>('')

const isItemModalOpen = ref(false)
const isCollectionModalOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const itemToDeleteId = ref<string | null>(null)
const editingItemId = ref<string | null>(null)

// Item form
const itemForm = ref({
  title: '',
  category: 'Decoration' as MoodboardItem['category'],
  imageUrl: '',
  notes: '',
  tagsString: '',
  collectionId: activeCollectionId.value
})

// Collection form
const collectionForm = ref({
  title: '',
  description: '',
  coverImage: ''
})

const categories: MoodboardItem['category'][] = [
  'Decoration',
  'Bridal outfits',
  'Groom outfits',
  'Flowers',
  'Stage design',
  'Table settings',
  'Photography',
  'Invitations',
  'Color palettes'
]

function openAddItem() {
  editingItemId.value = null
  itemForm.value = {
    title: '',
    category: 'Decoration',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    notes: '',
    tagsString: 'Mandap, Flowers',
    collectionId: activeCollectionId.value
  }
  isItemModalOpen.value = true
}

function handleSaveItem() {
  if (!itemForm.value.title.trim() || !itemForm.value.imageUrl.trim()) return

  const tags = itemForm.value.tagsString
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  if (editingItemId.value) {
    moodboardStore.updateItem(editingItemId.value, {
      title: itemForm.value.title,
      category: itemForm.value.category,
      imageUrl: itemForm.value.imageUrl,
      notes: itemForm.value.notes,
      tags,
      collectionId: itemForm.value.collectionId
    })
  } else {
    moodboardStore.addItem({
      title: itemForm.value.title,
      category: itemForm.value.category,
      imageUrl: itemForm.value.imageUrl,
      notes: itemForm.value.notes,
      tags,
      collectionId: itemForm.value.collectionId || activeCollectionId.value
    })
  }
  isItemModalOpen.value = false
}

function handleSaveCollection() {
  if (collectionForm.value.title.trim()) {
    const newCol = moodboardStore.addCollection(
      collectionForm.value.title.trim(),
      collectionForm.value.description,
      collectionForm.value.coverImage
    )
    activeCollectionId.value = newCol.id
    collectionForm.value = { title: '', description: '', coverImage: '' }
    isCollectionModalOpen.value = false
  }
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Use local Object URL
    itemForm.value.imageUrl = URL.createObjectURL(file)
  }
}

function confirmDeleteItem(id: string) {
  itemToDeleteId.value = id
  isDeleteDialogOpen.value = true
}

function executeDelete() {
  if (itemToDeleteId.value) {
    moodboardStore.deleteItem(itemToDeleteId.value)
    itemToDeleteId.value = null
  }
  isDeleteDialogOpen.value = false
}

const currentCollection = computed(() => {
  return moodboardStore.collections.find(c => c.id === activeCollectionId.value) || moodboardStore.collections[0]
})

const filteredItems = computed(() => {
  return moodboardStore.items
    .filter(i => i.collectionId === activeCollectionId.value)
    .filter(i => !selectedCategory.value || i.category === selectedCategory.value)
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-serif font-bold text-charcoal dark:text-ivory">Moodboard &amp; Inspiration Studio</h1>
        <p class="text-xs text-warmgray">Curate visual boards for mandap designs, bridal couture, florals, and color palettes</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          type="button" 
          @click="isCollectionModalOpen = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs font-semibold text-charcoal dark:text-ivory hover:border-gold transition-colors"
        >
          <FolderPlus class="w-3.5 h-3.5 text-gold" />
          <span>New Collection</span>
        </button>

        <button 
          type="button" 
          @click="openAddItem()"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs font-semibold shadow-soft transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Add Inspiration</span>
        </button>
      </div>
    </div>

    <!-- Collection Switcher Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-champagne/30 text-xs">
      <button 
        v-for="col in moodboardStore.collections"
        :key="col.id"
        type="button" 
        @click="activeCollectionId = col.id"
        class="px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-2"
        :class="activeCollectionId === col.id 
          ? 'bg-gold text-white shadow-xs' 
          : 'bg-white dark:bg-charcoal text-warmgray hover:text-charcoal border border-champagne/40'"
      >
        <span>{{ col.title }}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="activeCollectionId === col.id ? 'bg-white/20' : 'bg-champagne/30'">
          {{ moodboardStore.items.filter(i => i.collectionId === col.id).length }}
        </span>
      </button>
    </div>

    <!-- Active Collection Banner & Category Filter -->
    <div class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">{{ currentCollection?.title }}</h3>
        <p class="text-xs text-warmgray mt-0.5">{{ currentCollection?.description || 'Bespoke moodboard collection.' }}</p>
      </div>

      <div class="flex items-center gap-2">
        <Filter class="w-3.5 h-3.5 text-warmgray" />
        <select 
          v-model="selectedCategory"
          class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 text-xs text-charcoal dark:text-ivory focus:outline-hidden"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Masonry-Style Image Grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="break-inside-avoid rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light shadow-soft hover:shadow-luxury transition-all group"
      >
        <div class="relative overflow-hidden">
          <img :src="item.imageUrl" :alt="item.title" class="w-full object-cover group-hover:scale-103 transition-transform duration-500" />
          <div class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-charcoal/80 text-[10px] text-ivory font-semibold">
            {{ item.category }}
          </div>
          <button 
            type="button" 
            @click="confirmDeleteItem(item.id)"
            class="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-charcoal/90 text-warmgray hover:text-rose-dark opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete item"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="p-4 space-y-2">
          <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ item.title }}</h4>
          <p v-if="item.notes" class="text-xs text-warmgray italic">{{ item.notes }}</p>

          <div class="flex flex-wrap gap-1 pt-1">
            <span 
              v-for="tag in item.tags" 
              :key="tag"
              class="px-2 py-0.5 rounded-md bg-ivory dark:bg-charcoal-900 border border-champagne/30 text-[10px] text-warmgray"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredItems.length === 0" class="p-12 text-center text-warmgray text-xs bg-white dark:bg-charcoal rounded-3xl border border-champagne/40">
      No items found in this moodboard collection. Click "+ Add Inspiration" above to save images.
    </div>

    <!-- Modal: Add Inspiration Item -->
    <Modal :is-open="isItemModalOpen" title="Save Inspiration to Moodboard" size="md" @close="isItemModalOpen = false">
      <form @submit.prevent="handleSaveItem" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Title *</label>
          <input 
            v-model="itemForm.title"
            type="text" 
            required
            placeholder="e.g. Floating Lake Mandap with Peonies"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Category</label>
            <select v-model="itemForm.category" class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-warmgray uppercase">Collection</label>
            <select v-model="itemForm.collectionId" class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs">
              <option v-for="c in moodboardStore.collections" :key="c.id" :value="c.id">{{ c.title }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Image Web URL</label>
          <input 
            v-model="itemForm.imageUrl"
            type="url" 
            placeholder="https://images.unsplash.com/..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <!-- Local Browser Upload option -->
        <div class="p-3 rounded-xl bg-ivory dark:bg-charcoal-900 border border-dashed border-champagne/60 space-y-1 text-center">
          <label class="cursor-pointer block text-gold hover:underline font-semibold">
            <span>Or browse image file from computer (Local browser session)</span>
            <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
          </label>
          <p class="text-[10px] text-warmgray italic">
            Images uploaded from your device are kept locally in your browser session and not synced to an external server.
          </p>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Tags (comma separated)</label>
          <input 
            v-model="itemForm.tagsString"
            type="text" 
            placeholder="Mandap, Pink, Gold, Traditional"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Styling Notes</label>
          <textarea 
            v-model="itemForm.notes"
            rows="2"
            placeholder="Fabric choices, floral specifications..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>

        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isItemModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold">Save to Board</button>
        </div>
      </form>
    </Modal>

    <!-- Modal: New Collection -->
    <Modal :is-open="isCollectionModalOpen" title="Create Inspiration Collection" size="sm" @close="isCollectionModalOpen = false">
      <form @submit.prevent="handleSaveCollection" class="space-y-4 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Collection Title *</label>
          <input 
            v-model="collectionForm.title"
            type="text" 
            required
            placeholder="e.g. Royal Rajputana Mandap &amp; Florals"
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          />
        </div>
        <div class="space-y-1">
          <label class="font-semibold text-warmgray uppercase">Description</label>
          <textarea 
            v-model="collectionForm.description"
            rows="2"
            placeholder="Aesthetic notes and mood..."
            class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-charcoal-900 border border-champagne/60 text-xs focus:outline-hidden"
          ></textarea>
        </div>
        <div class="pt-4 flex items-center justify-end gap-2">
          <button type="button" @click="isCollectionModalOpen = false" class="px-4 py-2 rounded-xl text-warmgray">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gold text-white font-semibold">Create Collection</button>
        </div>
      </form>
    </Modal>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog 
      :is-open="isDeleteDialogOpen"
      title="Delete Item"
      message="Are you sure you want to remove this image from the moodboard?"
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>
