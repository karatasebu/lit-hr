import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import rawStyles from '@/styles/components/button-element.scss?inline'

import '@/components/icon-element.js'

export class ButtonElement extends LitElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    icon: { type: String },
    disabled: { type: Boolean },
    type: { type: String },
    title: { type: String },
    shape: { type: String },
    justIcon: { type: Boolean },
    colorType: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.variant = 'primary'
    this.size = 'md'
    this.type = 'button'
    this.shape = null
    this.justIcon = false
    this.colorType = null
  }

  render() {
    const variant = this.variant || 'primary'
    const size = this.size || 'md'
    const icon = this.icon
    const disabled = this.disabled
    const type = this.type
    const title = this.title
    const shape = this.shape
    const justIcon = this.justIcon
    const colorType = this.colorType
    const iconPixelSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 16

    const colorClass = colorType ? `--${colorType}` : ''
    const variantClass = colorType ? '' : `--${variant}`

    return html`
      <button
        class="button ${variantClass} ${colorClass} --${size} ${shape
          ? `--${shape}`
          : ''} ${justIcon ? '--just-icon' : ''}"
        ?disabled=${disabled}
        type=${ifDefined(type)}
        title=${ifDefined(title)}
      >
        ${icon ? html`<icon-element name=${icon} size="${iconPixelSize}"></icon-element>` : ''}
        <slot></slot>
      </button>
    `
  }
}

customElements.define('button-element', ButtonElement)
