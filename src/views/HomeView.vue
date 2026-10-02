<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Coins,
  Armchair,
  CheckCircle,
  Building2,
  Camera,
  Heart,
  ChevronRight,
  ShieldCheck,
  Send,
  Star
} from 'lucide-vue-next'
import { WEDDING_TRADITIONS, BRAND } from '@/config/constants'
import { defaultVenues, defaultVendors } from '@/data/mockData'
import { formatCurrency } from '@/utils/currency'

const router = useRouter()
const newsletterEmail = ref('')
const newsletterSubmitted = ref(false)

function handleNewsletterSubmit() {
  if (newsletterEmail.value.trim()) {
    newsletterSubmitted.value = true
    setTimeout(() => {
      newsletterEmail.value = ''
      newsletterSubmitted.value = false
    }, 4000)
  }
}

const planningFeatures = [
  {
    title: 'Financial & Budget Governance',
    desc: 'Track down-payments, category allocations, advance installments, and vendor invoices with zero guesswork.',
    icon: Coins,
    to: '/budget',
    tag: 'Budget Studio'
  },
  {
    title: 'Dynamic Guest List & RSVP Portal',
    desc: 'Manage family delegations, plus-ones, distinct meal preferences, dietary allergies, and unique RSVP digital codes.',
    icon: Users,
    to: '/guests',
    tag: 'Guest Manager'
  },
  {
    title: 'Interactive Seating Studio',
    desc: 'Visually arrange round, royal rectangular, and banquet tables with drag-and-drop seat allocations.',
    icon: Armchair,
    to: '/seating',
    tag: 'Seating Planner'
  },
  {
    title: 'Multi-Day Wedding Timeline',
    desc: 'Seamlessly schedule Haldi, Mehendi, Sangeet, Pheras, and Reception with automated conflict and overlap detection.',
    icon: Calendar,
    to: '/timeline',
    tag: 'Timeline Engine'
  },
  {
    title: 'Curated Venues & Vendor Marketplace',
    desc: 'Discover royal palaces, beachfront resorts, top-tier cinematographers, caterers, and bridal artists with instant comparison.',
    icon: Building2,
    to: '/venues',
    tag: 'Discovery Hub'
  },
  {
    title: 'Digital Invitations & Microsite',
    desc: 'Build couture invitations and publish a personalized no-code wedding website for your guests in minutes.',
    icon: Sparkles,
    to: '/invitations',
    tag: 'Creative Suite'
  }
]

const steps = [
  {
    step: '01',
    title: 'Create Your Wedding Workspace',
    desc: 'Set your partner names, celebration style (Palace, Beach, Minimalist, Royal), approximate guest count, and master budget.'
  },
  {
    step: '02',
    title: 'Curate Functions & Dream Vendors',
    desc: 'Configure your multi-day events, compare top-tier photographers and heritage venues, and maintain a centralized shortlist.'
  },
  {
    step: '03',
    title: 'Manage Guests, Seating & Budget',
    desc: 'Send invitations with unique demo RSVP codes, assign guests to custom table floor-plans, and log every payment advance.'
  },
  {
    step: '04',
    title: 'Execute a Flawless Celebration',
    desc: 'Print comprehensive schedules, coordinate with family members via shared checklists, and savor every unforgettable memory.'
  }
]

const testimonials = [
  {
    quote: 'EverAfter simplified our 4-day Udaipur royal wedding beyond belief. Tracking 350 guests across 5 different functions with dietary preferences was completely effortless.',
    couple: 'Pooja & Siddharth',
    location: 'Destination Wedding in Udaipur',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80',
    stars: 5
  },
  {
    quote: 'The seating arrangement studio and budget allocation breakdown kept us calm and on-track through 9 months of intense planning. Truly an editorial-grade tool.',
    couple: 'Rhea & Dev',
    location: 'Heritage Wedding in Jaipur',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=200&q=80',
    stars: 5
  },
  {
    quote: 'Being able to customize the Haldi, Mehendi, Sangeet, and Reception timelines without rigid software limitations was exactly what our families needed.',
    couple: 'Ananya & Kabir',
    location: 'Coastal Celebration in Goa',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80',
    stars: 5
  }
]

const faqs = [
  {
    q: 'Does EverAfter support multi-day Indian wedding traditions?',
    a: 'Yes, absolutely. EverAfter is natively architected for multi-day celebrations including Roka, Haldi, Mehendi, Sangeet, Vedic Pheras, and Reception. You can reorder, add, rename, or remove any event to fit your family traditions.'
  },
  {
    q: 'Is this demo completely functional without creating an account?',
    a: 'Yes! EverAfter is an entirely client-side, production-grade frontend demo. All changes to your budget, guest list, tasks, vendors, and seating plans are preserved in your browser’s LocalStorage. You can export your data anytime as a JSON backup.'
  },
  {
    q: 'Can I export guest lists and budget reports?',
    a: 'Yes. Every key module (Budget, Guests, Timeline, and Reports) features one-click CSV export and print-optimized views.'
  },
  {
    q: 'Can family members or wedding planners collaborate?',
    a: 'The platform includes a Family & Planner Collaboration Hub where task assignments, role labels, and an activity log are simulated locally.'
  }
]

const openFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div class="space-y-24 md:space-y-36 pb-12 overflow-hidden">
    <!-- 3. HERO SECTION -->
    <section class="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Left Hero Copy -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/40 dark:bg-charcoal-light/60 border border-gold/40 text-xs font-semibold uppercase tracking-widest text-gold-dark dark:text-gold-light">
            <Sparkles class="w-3.5 h-3.5" />
            <span>The Premier Wedding Planning Platform</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal dark:text-ivory leading-[1.12]">
            Your Story. <br class="hidden sm:inline" />
            Your Celebration. <br />
            <span class="text-gold italic font-normal">Your EverAfter.</span>
          </h1>

          <p class="text-base sm:text-lg text-warmgray dark:text-warmgray-light max-w-xl font-light leading-relaxed">
            From the initial engagement toast to your royal palace pheras — orchestrate budgets, guests, seating, and multi-day festivities in one breathtaking workspace.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button 
              type="button" 
              @click="router.push('/start-planning')"
              class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-gold hover:bg-gold-dark text-white shadow-luxury hover:shadow-gold-glow transition-all duration-300 hover:scale-[1.02]"
            >
              <span>Start Planning Free</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <button 
              type="button" 
              @click="router.push('/dashboard')"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-charcoal dark:text-ivory hover:text-gold bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light shadow-soft transition-all duration-300"
            >
              <span>Explore Demo Workspace</span>
            </button>
          </div>

          <!-- Quick Metrics Trust Row -->
          <div class="grid grid-cols-3 gap-6 pt-6 border-t border-champagne/40 dark:border-charcoal-light/40">
            <div>
              <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">8+ Days</div>
              <div class="text-xs text-warmgray dark:text-warmgray-light">Multi-Day Ceremonies</div>
            </div>
            <div>
              <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">100%</div>
              <div class="text-xs text-warmgray dark:text-warmgray-light">Private Local Storage</div>
            </div>
            <div>
              <div class="font-serif text-2xl font-bold text-charcoal dark:text-ivory">Zero Fees</div>
              <div class="text-xs text-warmgray dark:text-warmgray-light">Full Feature Demo</div>
            </div>
          </div>
        </div>

        <!-- Right Hero Visual Grid -->
        <div class="lg:col-span-5 relative">
          <div class="relative mx-auto max-w-md lg:max-w-none">
            <!-- Main Hero Image Frame -->
            <div class="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-charcoal-light">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80" 
                alt="Luxury wedding mandap celebration" 
                class="w-full h-[420px] object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span class="text-[11px] font-semibold tracking-widest uppercase text-champagne">Featured Royal Ceremony</span>
                <h3 class="font-serif text-xl font-bold">The Oberoi Udaivilas, Udaipur</h3>
                <p class="text-xs text-white/80">320 Guests • Multi-day Rajputana Festivities</p>
              </div>
            </div>

            <!-- Floating Preview Card 1: Budget Snapshot -->
            <div class="absolute -top-6 -left-6 z-20 rounded-2xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-md p-4 shadow-xl border border-champagne/40 dark:border-charcoal-light hidden sm:flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage-dark dark:text-sage-light">
                <Coins class="w-5 h-5" />
              </div>
              <div>
                <div class="text-[10px] uppercase font-semibold text-warmgray">Budget Health</div>
                <div class="text-sm font-serif font-bold text-charcoal dark:text-ivory">92% On Budget</div>
              </div>
            </div>

            <!-- Floating Preview Card 2: RSVP Count -->
            <div class="absolute -bottom-6 -right-6 z-20 rounded-2xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-md p-4 shadow-xl border border-champagne/40 dark:border-charcoal-light hidden sm:flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                <Users class="w-5 h-5" />
              </div>
              <div>
                <div class="text-[10px] uppercase font-semibold text-warmgray">RSVP Status</div>
                <div class="text-sm font-serif font-bold text-charcoal dark:text-ivory">268 Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. HOW IT WORKS SECTION -->
    <section id="how-it-works" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Methodology</span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
          How EverAfter Orchestrates Your Dream Wedding
        </h2>
        <p class="text-sm sm:text-base text-warmgray dark:text-warmgray-light">
          An intuitive, step-by-step suite that transforms months of complex wedding coordination into effortless, joyous celebration.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="s in steps" 
          :key="s.step"
          class="relative p-6 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-soft hover:shadow-luxury transition-all duration-300 group"
        >
          <div class="font-serif text-4xl font-bold text-gold/30 group-hover:text-gold transition-colors mb-4">
            {{ s.step }}
          </div>
          <h3 class="font-serif text-lg font-bold text-charcoal dark:text-ivory mb-2">
            {{ s.title }}
          </h3>
          <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">
            {{ s.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- 7. WEDDING PLANNING FEATURE CARDS -->
    <section id="features" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Integrated Modules</span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
          Every Dimension of Wedding Architecture
        </h2>
        <p class="text-sm text-warmgray dark:text-warmgray-light">
          Designed specifically for bespoke modern couples, multi-day celebrations, and detail-oriented families.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="feat in planningFeatures" 
          :key="feat.title"
          class="p-6 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-soft hover:shadow-luxury hover:border-gold/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          @click="router.push(feat.to)"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-ivory dark:bg-charcoal-900 border border-champagne/50 dark:border-charcoal-light flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                <component :is="feat.icon" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-champagne/30 text-gold-dark dark:text-gold-light">
                {{ feat.tag }}
              </span>
            </div>

            <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
              {{ feat.title }}
            </h3>

            <p class="text-xs text-warmgray dark:text-warmgray-light leading-relaxed">
              {{ feat.desc }}
            </p>
          </div>

          <div class="pt-6 mt-6 border-t border-champagne/20 dark:border-charcoal-light/20 flex items-center justify-between text-xs font-semibold text-gold">
            <span>Explore module</span>
            <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>

    <!-- 11. INDIAN WEDDING CELEBRATIONS SECTION -->
    <section id="traditions" class="py-16 bg-ivory-light dark:bg-charcoal-900 border-y border-champagne/40 dark:border-charcoal-light/40">
      <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="space-y-2 max-w-xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Cultural Traditions</span>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
              Multi-Day Celebration Architecture
            </h2>
            <p class="text-sm text-warmgray dark:text-warmgray-light">
              Indian weddings are a symphony of color, music, and sacred rites. Rename, add, or sequence your functions freely.
            </p>
          </div>
          <router-link 
            to="/timeline" 
            class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-dark"
          >
            <span>Open Timeline Studio</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <div 
            v-for="tradition in WEDDING_TRADITIONS" 
            :key="tradition.id"
            class="p-5 rounded-2xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-xs hover:border-gold/50 transition-all text-center space-y-2"
          >
            <div 
              class="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white font-serif font-bold text-sm"
              :style="{ backgroundColor: tradition.color }"
            >
              {{ tradition.name[0] }}
            </div>
            <h4 class="font-serif font-bold text-sm text-charcoal dark:text-ivory">
              {{ tradition.name }}
            </h4>
            <div class="text-[11px] text-warmgray dark:text-warmgray-light">
              Avg. {{ tradition.defaultDuration }} Hours
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. FEATURED VENUES SECTION -->
    <section id="venues" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div class="space-y-2 max-w-xl">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Palaces &amp; Resorts</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
            Featured Heritage Venues
          </h2>
          <p class="text-sm text-warmgray dark:text-warmgray-light">
            Iconic royal palaces, romantic lakeside promontories, and serene coastal settings across India.
          </p>
        </div>
        <router-link 
          to="/venues" 
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-dark"
        >
          <span>Browse All {{ defaultVenues.length }}+ Venues</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="venue in defaultVenues.slice(0, 3)" 
          :key="venue.id"
          class="rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-soft hover:shadow-luxury transition-all duration-300 group flex flex-col"
        >
          <div class="relative h-60 overflow-hidden">
            <img 
              :src="venue.coverImage" 
              :alt="venue.name" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-xs text-[10px] font-semibold text-ivory">
              {{ venue.venueType }} • {{ venue.city }}
            </div>
            <div class="absolute bottom-4 right-4 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-xs text-xs font-bold text-charcoal dark:text-ivory flex items-center gap-1 shadow-sm">
              <Star class="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{{ venue.rating }}</span>
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
                {{ venue.name }}
              </h3>
              <p class="text-xs text-warmgray dark:text-warmgray-light mt-1.5 line-clamp-2">
                {{ venue.description }}
              </p>
            </div>

            <div class="pt-4 border-t border-champagne/30 dark:border-charcoal-light/30 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-warmgray block">Starting from</span>
                <span class="font-serif font-bold text-base text-charcoal dark:text-ivory">
                  {{ formatCurrency(venue.startingPrice, venue.currency) }}
                </span>
              </div>
              <router-link 
                to="/venues" 
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-ivory dark:bg-charcoal-light text-charcoal dark:text-ivory hover:bg-gold hover:text-white transition-colors"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. POPULAR VENDORS SECTION -->
    <section id="vendors" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div class="space-y-2 max-w-xl">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Curated Masters</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
            Celebrity &amp; Heritage Vendors
          </h2>
          <p class="text-sm text-warmgray dark:text-warmgray-light">
            Vetted fine-art photographers, royal catering ateliers, bridal couturiers, and theatrical entertainers.
          </p>
        </div>
        <router-link 
          to="/vendors" 
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-dark"
        >
          <span>Explore All Vendors</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="vendor in defaultVendors.slice(0, 3)" 
          :key="vendor.id"
          class="rounded-3xl overflow-hidden bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-soft hover:shadow-luxury transition-all duration-300 group flex flex-col"
        >
          <div class="relative h-56 overflow-hidden">
            <img 
              :src="vendor.coverImage" 
              :alt="vendor.name" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-xs text-[10px] font-semibold text-ivory">
              {{ vendor.category }}
            </div>
            <div class="absolute bottom-4 right-4 px-2.5 py-1 rounded-xl bg-white/95 dark:bg-charcoal/95 backdrop-blur-xs text-xs font-bold text-charcoal dark:text-ivory flex items-center gap-1 shadow-sm">
              <Star class="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{{ vendor.rating }}</span>
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="font-serif text-xl font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">
                {{ vendor.name }}
              </h3>
              <p class="text-xs text-warmgray dark:text-warmgray-light mt-1.5 line-clamp-2">
                {{ vendor.shortDescription }}
              </p>
            </div>

            <div class="pt-4 border-t border-champagne/30 dark:border-charcoal-light/30 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-warmgray block">Starting package</span>
                <span class="font-serif font-bold text-base text-charcoal dark:text-ivory">
                  {{ formatCurrency(vendor.startingPrice, vendor.currency) }}
                </span>
              </div>
              <router-link 
                to="/vendors" 
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-ivory dark:bg-charcoal-light text-charcoal dark:text-ivory hover:bg-gold hover:text-white transition-colors"
              >
                Inquire Demo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 10. WEDDING INSPIRATION GALLERY -->
    <section id="inspiration" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Moodboard &amp; Aesthetics</span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
          Curated Visual Inspiration
        </h2>
        <p class="text-sm text-warmgray dark:text-warmgray-light">
          Explore spatial decor, bridal zardozi lehengas, floating lake mandaps, and regal table landscapes.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="relative rounded-2xl overflow-hidden group h-64">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Floral mandap" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-serif font-bold">
            Floral Lake Mandaps
          </div>
        </div>
        <div class="relative rounded-2xl overflow-hidden group h-64">
          <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80" alt="Bridal portrait" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-serif font-bold">
            Bridal Heritage Silks
          </div>
        </div>
        <div class="relative rounded-2xl overflow-hidden group h-64">
          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80" alt="Marigold decor" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-serif font-bold">
            Haldi Petals &amp; Brass Urlis
          </div>
        </div>
        <div class="relative rounded-2xl overflow-hidden group h-64">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" alt="Sangeet illumination" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-serif font-bold">
            Mirror Chandeliers &amp; Sangeet
          </div>
        </div>
      </div>

      <div class="text-center mt-8">
        <router-link 
          to="/moodboard" 
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white dark:bg-charcoal border border-champagne/60 dark:border-charcoal-light shadow-soft hover:border-gold text-charcoal dark:text-ivory"
        >
          <span>Open Full Moodboard Studio</span>
          <ArrowRight class="w-3.5 h-3.5 text-gold" />
        </router-link>
      </div>
    </section>

    <!-- 12. TESTIMONIALS (CLEARLY FICTIONAL DEMO) -->
    <section id="testimonials" class="py-16 bg-ivory-light dark:bg-charcoal-900 border-y border-champagne/40 dark:border-charcoal-light/40">
      <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Love Stories</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
            Words from EverAfter Couples
          </h2>
          <p class="text-xs text-warmgray dark:text-warmgray-light italic">
            (Fictional sample testimonials for demo presentation purposes)
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="t in testimonials" 
            :key="t.couple"
            class="p-8 rounded-3xl bg-white dark:bg-charcoal border border-champagne/40 dark:border-charcoal-light/40 shadow-soft flex flex-col justify-between space-y-6"
          >
            <div class="space-y-4">
              <div class="flex items-center gap-1 text-gold">
                <Star v-for="i in t.stars" :key="i" class="w-4 h-4 fill-gold text-gold" />
              </div>
              <p class="text-sm text-warmgray dark:text-warmgray-light leading-relaxed italic">
                “{{ t.quote }}”
              </p>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-champagne/20 dark:border-charcoal-light/20">
              <img :src="t.image" :alt="t.couple" class="w-12 h-12 rounded-full object-cover border-2 border-champagne" />
              <div>
                <h4 class="font-serif font-bold text-base text-charcoal dark:text-ivory">{{ t.couple }}</h4>
                <p class="text-xs text-warmgray dark:text-warmgray-light">{{ t.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 13. FAQ SECTION -->
    <section id="faq" class="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs font-semibold uppercase tracking-widest text-gold dark:text-gold-light">Clarity &amp; Assurance</span>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-charcoal dark:text-ivory">
          Frequently Asked Questions
        </h2>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(item, idx) in faqs" 
          :key="item.q"
          class="rounded-2xl border border-champagne/40 dark:border-charcoal-light/40 bg-white dark:bg-charcoal overflow-hidden transition-colors"
        >
          <button 
            type="button" 
            @click="toggleFaq(idx)"
            class="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-charcoal dark:text-ivory"
          >
            <span>{{ item.q }}</span>
            <ChevronRight 
              class="w-5 h-5 text-gold shrink-0 transition-transform duration-200"
              :class="{ 'rotate-90': openFaq === idx }"
            />
          </button>
          <div 
            v-if="openFaq === idx"
            class="px-5 pb-5 text-xs sm:text-sm text-warmgray dark:text-warmgray-light leading-relaxed border-t border-champagne/20 dark:border-charcoal-light/20 pt-3"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- 14. NEWSLETTER SIGNUP -->
    <section class="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div class="relative rounded-3xl p-8 sm:p-12 bg-charcoal text-ivory overflow-hidden border border-gold/40 shadow-2xl">
        <!-- Decorative golden circles -->
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <span class="text-xs font-semibold uppercase tracking-widest text-champagne">The EverAfter Gazette</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white">
            Curated Inspiration Delivered to Your Inbox
          </h2>
          <p class="text-xs sm:text-sm text-champagne/80 font-light max-w-lg mx-auto">
            Receive royal venue spotlights, couture bridal moodboards, and budgeting guides directly from our editorial team.
          </p>

          <form @submit.prevent="handleNewsletterSubmit" class="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input 
              v-model="newsletterEmail"
              type="email" 
              required
              placeholder="Enter your email address" 
              class="w-full px-4 py-3 rounded-full bg-charcoal-light text-white placeholder-warmgray text-xs focus:outline-hidden focus:ring-2 focus:ring-gold border border-charcoal-light"
            />
            <button 
              type="submit" 
              class="w-full sm:w-auto px-6 py-3 rounded-full bg-gold hover:bg-gold-dark text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <Send class="w-3.5 h-3.5" />
            </button>
          </form>

          <div v-if="newsletterSubmitted" class="text-xs text-emerald-400 font-medium animate-fade">
            Thank you for subscribing! (Demo subscription simulated locally).
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
