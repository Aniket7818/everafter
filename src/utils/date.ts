import { format, parseISO, differenceInDays, differenceInHours, differenceInMinutes, isValid } from 'date-fns'

export function formatDate(dateString?: string, formatStr: string = 'dd MMM yyyy'): string {
  if (!dateString) return 'Date to be decided'
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    if (!isValid(d)) return dateString
    return format(d, formatStr)
  } catch {
    return dateString || ''
  }
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return ''
  // If time is "14:30" convert to "2:30 PM"
  const parts = timeStr.split(':')
  if (parts.length < 2) return timeStr
  let h = parseInt(parts[0], 10)
  const m = parts[1]
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

export function getDaysRemaining(targetDateStr?: string): number | null {
  if (!targetDateStr) return null
  try {
    const target = parseISO(targetDateStr)
    if (!isValid(target)) return null
    const diff = differenceInDays(target, new Date())
    return diff
  } catch {
    return null
  }
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  isPast: boolean
}

export function getCountdownParts(targetDateStr?: string): CountdownParts | null {
  if (!targetDateStr) return null
  try {
    const target = parseISO(targetDateStr)
    if (!isValid(target)) return null
    const now = new Date()
    const isPast = target.getTime() < now.getTime()

    const totalMinutes = Math.abs(differenceInMinutes(target, now))
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    return { days, hours, minutes, isPast }
  } catch {
    return null
  }
}

export function isTaskOverdue(dueDateStr?: string, completed?: boolean): boolean {
  if (!dueDateStr || completed) return false
  try {
    const due = parseISO(dueDateStr)
    if (!isValid(due)) return false
    const now = new Date()
    // Compare date parts only
    return due.setHours(23, 59, 59, 999) < now.getTime()
  } catch {
    return false
  }
}

export function checkTimeOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  // Convert HH:mm to minutes from midnight
  const toMins = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }
  const sA = toMins(startA)
  const eA = toMins(endA)
  const sB = toMins(startB)
  const eB = toMins(endB)

  return Math.max(sA, sB) < Math.min(eA, eB)
}
