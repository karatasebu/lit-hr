import { Router } from '@vaadin/router'
import { LitElement, html, css, unsafeCSS } from 'lit'

import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/layout/app-header.scss?inline'
import { t, getLocale, setLocaleFromUrl, setLocale } from '@/utils/localization.js'

import '@/components/image-element.js'
import '@/components/icon-element.js'
import '@/components/button-element.js'

export class AppHeader extends LocalizedMixin(LitElement) {
  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  static properties = {
    isMobileMenuOpen: { type: Boolean },
  }

  constructor() {
    super()
    this.isMobileMenuOpen = false
  }

  get currentLocale() {
    return getLocale()
  }

  get currentPath() {
    return window.location.pathname
  }

  connectedCallback() {
    super.connectedCallback()
    this._handleRouteChange = () => this.requestUpdate()
    window.addEventListener('popstate', this._handleRouteChange)
    window.addEventListener('vaadin-router-location-changed', this._handleRouteChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('popstate', this._handleRouteChange)
    window.removeEventListener('vaadin-router-location-changed', this._handleRouteChange)
  }

  localeChanged(locale) {
    if (locale !== getLocale()) {
      const url = new URL(window.location.href)
      url.searchParams.set('locale', locale)
      window.history.pushState(null, '', url.toString())
      setLocaleFromUrl()
    }
  }

  _go(path) {
    const url = new URL(window.location.href)
    const locale = url.searchParams.get('locale') || 'en'
    Router.go(`${path}?locale=${locale}`)
    // Close mobile menu when navigating
    this.isMobileMenuOpen = false
  }

  _toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  _localeChanged(locale) {
    setLocale(locale)
  }

  render() {
    return html`
      <div class="app-header">
        <div class="app-header__logo" @click=${() => this._go('/')}>
          <image-element src="ing.webp" width="50" height="50" alt="ING logo"></image-element>
          <span>ING</span>
        </div>

        <!-- Mobile menu button -->
        <button-element
          variant="ghost"
          justIcon
          icon="menu"
          size="lg"
          @click=${this._toggleMobileMenu}
        ></button-element>

        <!-- Navigation -->
        <nav class="app-header__nav ${this.isMobileMenuOpen ? '--open' : ''}">
          <div class="app-header__buttons">
            <button-element
              variant="ghost"
              colorType=${this.currentPath === '/' ? 'orange' : 'orange-pale'}
              icon="user"
              @click=${() => this._go('/')}
            >
              <span>${t('employees')}</span>
            </button-element>
            <button-element
              variant="ghost"
              colorType=${this.currentPath === '/form' ? 'orange' : 'orange-pale'}
              icon="plus"
              @click=${() => this._go('/form')}
            >
              <span>${t('addNew')}</span>
            </button-element>
          </div>
          <div class="app-header__flags">
            <image-element
              class=${`app-header__flag ${this.currentLocale === 'tr' ? '--active' : ''}`}
              width="30"
              src="tr-flag.webp"
              alt="TR Flag"
              @click=${() => this._localeChanged('tr')}
            ></image-element>
            <image-element
              class=${`app-header__flag ${this.currentLocale === 'en' ? '--active' : ''}`}
              width="30"
              src="en-flag.png"
              alt="EN Flag"
              @click=${() => this._localeChanged('en')}
            ></image-element>
          </div>
        </nav>
      </div>
    `
  }
}

customElements.define('app-header', AppHeader)
