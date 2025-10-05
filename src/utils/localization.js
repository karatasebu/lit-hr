import { translations as enTranslations } from '@/locales/en.js'
import { translations as trTranslations } from '@/locales/tr.js'

const locales = {
  en: enTranslations,
  tr: trTranslations,
}

let localeChangeListeners = new Set()

// Get current locale from URL or default to 'en'
export const getLocale = () => {
  const url = new URL(window.location.href)
  const localeFromUrl = url.searchParams.get('locale')
  return localeFromUrl && locales[localeFromUrl] ? localeFromUrl : 'en'
}

// Set locale and update URL
export const setLocale = locale => {
  if (locales[locale]) {
    const url = new URL(window.location.href)
    url.searchParams.set('locale', locale)
    window.history.replaceState({}, '', url)

    // Notify all listeners about locale change
    localeChangeListeners.forEach(listener => {
      try {
        listener(locale)
      } catch (error) {
        console.error('Error in locale change listener:', error)
      }
    })

    return true
  }
  return false
}

// Get translation for a key
export const t = key => {
  const locale = getLocale()
  return locales[locale]?.[key] || key
}

// Initialize locale from URL
export const setLocaleFromUrl = () => {
  const locale = getLocale()
  setLocale(locale)
  return locale
}

// Subscribe to locale changes
export const onLocaleChange = listener => {
  localeChangeListeners.add(listener)
  return () => localeChangeListeners.delete(listener)
}

// Unsubscribe from locale changes
export const offLocaleChange = listener => {
  localeChangeListeners.delete(listener)
}
