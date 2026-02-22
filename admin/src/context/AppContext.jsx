import { createContext } from 'react'

export const AppContext = createContext()

/**
 * App Context Provider
 * Provides global utility functions and configuration
 * Used across the application for common operations
 */
const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Month names for date formatting (index 0 is empty for 1-based months)
  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  /**
   * Format slot date from "DD_MM_YYYY" to "DD MMM YYYY"
   * Example: "15_02_2026" -> "15 Feb 2026"
   * @param {string} slotDate - Date in format "DD_MM_YYYY"
   * @returns {string} Formatted date string
   */
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    )
  }

  /**
   * Calculate age from date of birth
   * @param {string} dob - Date of birth string
   * @returns {number|string} Age in years or empty string if no DOB
   */
  const calculateAge = (dob) => {
    if (!dob) return ''
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    return age
  }

  // Context value with configuration and utility functions
  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}

export default AppContextProvider
