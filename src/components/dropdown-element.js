import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import rawStyles from '@/styles/components/dropdown-element.scss?inline'
import { t } from '@/utils/localization.js'

export class DropdownElement extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: { type: String },
    id: { type: String },
    size: { type: String },
    variant: { type: String },
    options: { type: Array },
    open: { type: Boolean, state: true },
    label: { type: String },
    error: { type: String },
    hasError: { type: Boolean, state: true },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.size = 'md'
    this.variant = 'default'
    this.value = ''
    this.options = []
    this.open = false
    this.placeholder = t('selectOption')
    this.hasError = false
  }

  updated(changedProperties) {
    super.updated(changedProperties)
    if (changedProperties.has('error')) {
      this.hasError = !!this.error
    }
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('click', this._handleOutsideClick.bind(this))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleOutsideClick.bind(this))
  }

  _handleOutsideClick(e) {
    if (this.open && !this.contains(e.target)) {
      this.open = false
    }
  }

  _toggleDropdown(e) {
    if (this.disabled) return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    this.open = !this.open
  }

  _selectOption(option, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.value = option.value
    this.open = false

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: option.value,
          label: option.label,
          option: option,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  _getSelectedLabel() {
    const selectedOption = this.options.find(option => option.value === this.value)
    return selectedOption ? selectedOption.label : t('selectOption')
  }

  _isSelected(option) {
    return option.value === this.value
  }

  render() {
    const variant = this.variant || 'default'
    const size = this.size || 'md'
    const disabled = this.disabled
    const required = this.required
    const name = this.name
    const id = this.id
    const label = this.label
    const error = this.error
    const hasError = this.hasError
    const stateClass = `${this.open ? '--open' : ''} ${hasError ? '--error' : ''}`

    return html`
      ${label
        ? html`<label class="dropdown__label" for=${ifDefined(id)}
            >${label}${required ? html`<span class="dropdown__required"> *</span>` : ''}</label
          >`
        : ''}
      <div class="dropdown --${variant} --${size} ${stateClass}">
        <button
          type="button"
          class="dropdown__trigger"
          ?disabled=${disabled}
          ?required=${required}
          name=${ifDefined(name)}
          id=${ifDefined(id)}
          @click=${this._toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded=${this.open}
        >
          <span class="dropdown__value">${this._getSelectedLabel()}</span>
          <icon-element name="chevron-down" size="20"></icon-element>
        </button>

        ${this.open
          ? html`
              <div class="dropdown__menu" role="listbox">
                ${this.options.map(
                  option => html`
                    <button
                      type="button"
                      class="dropdown__option ${this._isSelected(option)
                        ? 'dropdown__option --selected'
                        : ''}"
                      @click=${e => this._selectOption(option, e)}
                      role="option"
                      aria-selected=${this._isSelected(option)}
                      tabindex="-1"
                    >
                      ${option.label}
                    </button>
                  `
                )}
              </div>
            `
          : ''}
      </div>
      ${error ? html`<div class="dropdown__error">${error}</div>` : ''}
    `
  }
}

customElements.define('dropdown-element', DropdownElement)
