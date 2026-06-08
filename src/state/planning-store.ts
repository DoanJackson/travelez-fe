import { create } from 'zustand'

export interface TripPlanningState {
  // Step 1: Destinations (multi-destination support)
  destinations: string[]
  
  // Step 2: Dates
  dateMode: 'day' | 'month'
  dayRange: {
    start: Date | null
    end: Date | null
  }
  monthRange: {
    startMonth: string | null  // Format: "2025-12"
    endMonth: string | null
  }
  
  // Step 3: Trip Type & Companions
  tripType: 'solo' | 'partner' | 'friends' | 'family' | null
  withPets: boolean | null
  withKids: boolean | null
  
  // Step 4: Budget (currency-aware)
  budget: number | null
  currency: 'VND' | 'USD'
  
  // Step 5: Travel Styles (multi-select with max 3)
  travelStyles: string[]
  extraPreferences: string | null  // New: freeform text for additional preferences
  customNote: string | null
  
  // Edit flow management
  comingFromSummary: boolean
  summaryReturnStep: number | null
  
  // Actions
  addDestination: (destination: string) => void
  removeDestination: (destination: string) => void
  setDestinations: (destinations: string[]) => void
  
  setDateMode: (mode: 'day' | 'month') => void
  setDayRange: (start: Date | null, end: Date | null) => void
  setMonthRange: (startMonth: string | null, endMonth: string | null) => void
  
  setTripType: (type: 'solo' | 'partner' | 'friends' | 'family') => void
  setWithPets: (value: boolean) => void
  setWithKids: (value: boolean) => void
  
  setBudget: (budget: number) => void
  setCurrency: (currency: 'VND' | 'USD') => void
  
  addTravelStyle: (style: string) => void
  removeTravelStyle: (style: string) => void
  setTravelStyles: (styles: string[]) => void
  setExtraPreferences: (text: string) => void
  setCustomNote: (note: string) => void
  
  setComingFromSummary: (value: boolean, returnStep?: number) => void
  
  reset: () => void
  
  // Validation helpers
  isStep1Valid: () => boolean
  isStep2Valid: () => boolean
  isStep3Valid: () => boolean
  isStep4Valid: () => boolean
  isStep5Valid: () => boolean
  
  // Computed properties
  getTripDuration: () => number | null
  getFormattedBudget: () => string
  getSummaryText: () => string
  getFormattedDateRange: () => string
}

const initialState = {
  destinations: [],
  dateMode: 'day' as const,
  dayRange: { start: null, end: null },
  monthRange: { startMonth: null, endMonth: null },
  tripType: null,
  withPets: null,
  withKids: null,
  budget: null,
  currency: 'VND' as const,
  travelStyles: [],
  extraPreferences: null,
  customNote: null,
  comingFromSummary: false,
  summaryReturnStep: null,
}

export const useTripPlanningStore = create<TripPlanningState>((set, get) => ({
  ...initialState,
  
  // Destinations
  addDestination: (destination) => {
    const state = get()
    
    // Normalize: trim and collapse multiple spaces
    const normalized = destination.trim().replace(/\s+/g, " ")
    
    // Only add if we have space and it's not a duplicate (case-insensitive)
    if (normalized && state.destinations.length < 5) {
      const isDuplicate = state.destinations.some(
        (d) => d.toLowerCase() === normalized.toLowerCase()
      )
      
      if (!isDuplicate) {
        set({ destinations: [...state.destinations, normalized] })
      }
    }
  },
  
  removeDestination: (destination) => {
    const state = get()
    set({ destinations: state.destinations.filter(d => d !== destination) })
  },
  
  setDestinations: (destinations) => set({ destinations }),
  
  // Dates
  setDateMode: (mode) => set({ dateMode: mode }),
  
  setDayRange: (start, end) => set({ dayRange: { start, end } }),
  
  setMonthRange: (startMonth, endMonth) => 
    set({ monthRange: { startMonth, endMonth } }),
  
  // Trip type
  setTripType: (type) => set({ tripType: type }),
  
  setWithPets: (value) => set({ withPets: value }),
  
  setWithKids: (value) => set({ withKids: value }),
  
  // Budget
  setBudget: (budget) => set({ budget }),
  
  setCurrency: (currency) => {
    const state = get()
    // Convert budget when currency changes
    if (state.budget) {
      let newBudget = state.budget
      if (currency === 'USD' && state.currency === 'VND') {
        // VND to USD (rough conversion ~25,000:1)
        newBudget = Math.round(state.budget / 25000)
      } else if (currency === 'VND' && state.currency === 'USD') {
        // USD to VND
        newBudget = Math.round(state.budget * 25000)
      }
      set({ currency, budget: newBudget })
    } else {
      set({ currency })
    }
  },
  
  // Travel styles
  addTravelStyle: (style) => {
    const state = get()
    if (state.travelStyles.length < 3 && !state.travelStyles.includes(style)) {
      set({ travelStyles: [...state.travelStyles, style] })
    }
  },
  
  removeTravelStyle: (style) => {
    const state = get()
    set({ travelStyles: state.travelStyles.filter(s => s !== style) })
  },
  
  setTravelStyles: (styles) => {
    // Enforce max 3
    set({ travelStyles: styles.slice(0, 3) })
  },
  
  setExtraPreferences: (text) => set({ extraPreferences: text }),
  
  setCustomNote: (note) => set({ customNote: note }),
  
  // Edit flow
  setComingFromSummary: (value, returnStep) => 
    set({ comingFromSummary: value, summaryReturnStep: returnStep || null }),
  
  reset: () => set(initialState),
  
  // Validation
  isStep1Valid: () => {
    const state = get()
    return state.destinations.length > 0
  },
  
  isStep2Valid: () => {
    const state = get()
    if (state.dateMode === 'day') {
      return !!state.dayRange.start && !!state.dayRange.end
    } else {
      return !!state.monthRange.startMonth && !!state.monthRange.endMonth
    }
  },
  
  isStep3Valid: () => {
    const state = get()
    return !!state.tripType && 
           state.withPets !== null && 
           state.withKids !== null
  },
  
  isStep4Valid: () => {
    const state = get()
    return !!state.budget && state.budget > 0
  },
  
  isStep5Valid: () => {
    // Styles are optional
    return true
  },
  
  // Computed
  getTripDuration: () => {
    const state = get()
    if (state.dateMode === 'day' && state.dayRange.start && state.dayRange.end) {
      const diff = state.dayRange.end.getTime() - state.dayRange.start.getTime()
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
    }
    return null
  },
  
  getFormattedBudget: () => {
    const state = get()
    if (!state.budget) return ''
    
    if (state.currency === 'VND') {
      return `${state.budget.toLocaleString('vi-VN')} VND`
    } else {
      return `$${state.budget.toLocaleString('en-US')}`
    }
  },
  
  getFormattedDateRange: () => {
    const state = get()
    
    if (state.dateMode === 'day' && state.dayRange.start && state.dayRange.end) {
      const start = state.dayRange.start
      const end = state.dayRange.end
      const sameYear = start.getFullYear() === end.getFullYear()
      const sameMonth = start.getMonth() === end.getMonth()
      
      if (sameMonth && sameYear) {
        // Same month: "Dec 20 – 26, 2025"
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.getDate()}, ${start.getFullYear()}`
      } else if (sameYear) {
        // Same year: "Dec 20 – Jan 15, 2025"
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`
      } else {
        // Different years: "Dec 20, 2025 – Jan 15, 2026"
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      }
    }
    
    if (state.dateMode === 'month' && state.monthRange.startMonth && state.monthRange.endMonth) {
      const start = new Date(state.monthRange.startMonth + '-01')
      const end = new Date(state.monthRange.endMonth + '-01')
      
      if (state.monthRange.startMonth === state.monthRange.endMonth) {
        // Single month: "June 2026"
        return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      } else {
        // Range: "June 2026 – August 2026"
        return `${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }
    }
    
    return 'Not set'
  },
  
  getSummaryText: () => {
    const state = get()
    const parts: string[] = []
    
    if (state.destinations.length > 0) {
      parts.push(state.destinations.join(', '))
    }
    
    if (state.tripType) {
      parts.push(state.tripType.charAt(0).toUpperCase() + state.tripType.slice(1))
    }
    
    return parts.join(' · ')
  },
}))
