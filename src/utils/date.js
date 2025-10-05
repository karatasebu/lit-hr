/**
 * Date conversion utilities
 */
export const dateUtils = {
  convertDateForInput(dateString) {
    if (!dateString) return ''
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return dateString
  },

  convertDateForStorage(dateString) {
    if (!dateString) return ''
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
    return dateString
  },
}
