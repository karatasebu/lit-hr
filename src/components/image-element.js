import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import rawStyles from '@/styles/components/image-element.scss?inline'

// Dynamically import any file in /src/assets/images as URL when needed
const assetsGlob = import.meta.glob('/src/assets/images/*', { query: '?url', import: 'default' })

export class ImageElement extends LitElement {
  static properties = {
    src: { type: String },
    alt: { type: String },
    width: { type: String },
    height: { type: String },
    loading: { type: String },
    decoding: { type: String },
    referrerpolicy: { type: String, attribute: 'referrerpolicy' },
    sizes: { type: String },
    srcset: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  createRenderRoot() {
    return super.createRenderRoot()
  }

  async resolveSrc(raw) {
    if (!raw) return undefined
    const key = String(raw)
    if (/^(https?:\/\/|data:|\/)/.test(key)) return key

    const file = key
    const path = `/src/assets/images/${file}`
    if (assetsGlob[path]) {
      const loader = assetsGlob[path]
      return await loader()
    }
    return key
  }

  async updated(changed) {
    if (changed.has('src')) {
      const url = await this.resolveSrc(this.src)
      this._resolvedSrc = url
      this.requestUpdate()
    }
  }

  render() {
    const forwardedClass = this.getAttribute('class') ?? ''
    const classes = ['image', forwardedClass].filter(Boolean).join(' ')
    const resolved = this._resolvedSrc ?? this.src
    return html`
      <img
        class=${ifDefined(classes)}
        src=${ifDefined(resolved)}
        alt=${ifDefined(this.alt)}
        width=${ifDefined(this.width)}
        height=${ifDefined(this.height)}
        loading=${ifDefined(this.loading)}
        decoding=${ifDefined(this.decoding)}
        referrerpolicy=${ifDefined(this.referrerpolicy)}
        sizes=${ifDefined(this.sizes)}
        srcset=${ifDefined(this.srcset)}
      />
    `
  }
}

customElements.define('image-element', ImageElement)
