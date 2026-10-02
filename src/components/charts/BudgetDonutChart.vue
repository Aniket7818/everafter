<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { formatCompactCurrency } from '@/utils/currency'
import { useWorkspaceStore } from '@/stores/workspace'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  categories: { name: string; spent: number; color?: string }[]
}>()

const workspaceStore = useWorkspaceStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const validCategories = props.categories.filter(c => c.spent > 0)
  const labels = validCategories.map(c => c.name)
  const data = validCategories.map(c => c.spent)
  const backgroundColors = validCategories.map((c, i) => {
    if (c.color) return c.color
    const palette = ['#B99A62', '#D8C29D', '#AAB5A0', '#D9B8B0', '#BD968D', '#77716B', '#937740', '#EAD7D2']
    return palette[i % palette.length]
  })

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['No expenses yet'],
      datasets: [
        {
          data: data.length ? data : [1],
          backgroundColor: data.length ? backgroundColors : ['#E8D8B9'],
          borderWidth: 2,
          borderColor: document.documentElement.classList.contains('dark') ? '#292725' : '#FFFFFF',
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#292725',
          titleColor: '#FAF7F2',
          bodyColor: '#E8D8B9',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const val = Number(context.raw)
              return ` ${context.label}: ${formatCompactCurrency(val, workspaceStore.currency)}`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  renderChart()
})

watch(() => props.categories, () => {
  renderChart()
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<template>
  <div class="relative w-full h-full min-h-[220px] flex items-center justify-center">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
