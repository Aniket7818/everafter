<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  data: number[]
  colors?: string[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  const defaultColors = ['#AAB5A0', '#B99A62', '#D9B8B0', '#77716B', '#D8C29D']
  const bgColors = props.colors || props.labels.map((_, i) => defaultColors[i % defaultColors.length])

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: bgColors,
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#292725',
          titleColor: '#FAF7F2',
          bodyColor: '#E8D8B9',
          padding: 8,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: '"Plus Jakarta Sans"', size: 11 },
            color: '#77716B'
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(232, 216, 185, 0.2)' },
          ticks: {
            precision: 0,
            font: { family: '"Plus Jakarta Sans"', size: 10 },
            color: '#77716B'
          }
        }
      }
    }
  })
}

onMounted(() => renderChart())
watch(() => [props.labels, props.data], () => renderChart(), { deep: true })
onBeforeUnmount(() => { if (chartInstance) chartInstance.destroy() })
</script>

<template>
  <div class="relative w-full h-full min-h-[180px]">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
