import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import rawStyles from '@/styles/components/icon-element.scss?inline'

// Load raw SVG strings from assets/svgs
const svgGlob = import.meta.glob('/src/assets/svgs/*', { query: '?raw', import: 'default' })

export class IconElement extends LitElement {
  static properties = {
    name: { type: String },
    size: { type: Number },
    colorType: { type: String },
    title: { type: String },
    ariaHidden: { type: Boolean, attribute: 'aria-hidden', reflect: true },
    role: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  createRenderRoot() {
    return super.createRenderRoot()
  }

  constructor() {
    super()
    this.size = 16
    this.colorType = null
    this.role = 'img'
  }

  async updated(changed) {
    if (changed.has('name')) {
      const svg = await this.resolveSvg(this.name)
      this._svg = svg
      this.requestUpdate()
    }
  }

  async resolveSvg(name) {
    if (!name) return undefined
    const key = String(name)
    const file = key.endsWith('.svg') ? key : `${key}.svg`
    const path = `/src/assets/svgs/${file}`
    if (svgGlob[path]) {
      const mod = await svgGlob[path]()
      return String(mod)
    }
    return undefined
  }

  render() {
    const rawSize = this.size
    const numericSize = Number(rawSize) || 0
    const sizeCss = `${numericSize}px`
    const svg = this._svg
    const ariaHidden = this.ariaHidden ?? undefined
    const title = this.title ?? undefined
    const colorType = this.colorType
    const colorClass = colorType ? `--${colorType}` : ''
    const iconClass = `icon ${colorClass}`.trim()

    const style = `width:${sizeCss};height:${sizeCss};`

    return html`
      <span
        class=${iconClass}
        style=${unsafeCSS(style)}
        role=${ifDefined(this.role)}
        aria-hidden=${ifDefined(ariaHidden)}
        title=${ifDefined(title)}
      >
        ${svg ? unsafeHTML(svg) : ''}
      </span>
    `
  }
}

customElements.define('icon-element', IconElement)
