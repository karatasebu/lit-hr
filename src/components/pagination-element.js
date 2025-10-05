import { LitElement, html, css, unsafeCSS } from 'lit'

import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/components/pagination-element.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/button-element.js'

export class PaginationElement extends LocalizedMixin(LitElement) {
  static properties = {
    page: { type: Number },
    pageSize: { type: Number },
    total: { type: Number },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.page = 1
    this.pageSize = 10
    this.total = 0
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize))
  }

  _emit() {
    this.dispatchEvent(
      new window.CustomEvent('paginate', {
        detail: { page: this.page, pageSize: this.pageSize },
        bubbles: true,
        composed: true,
      })
    )
  }

  _setPage(page) {
    const next = Math.min(Math.max(1, page), this.totalPages)
    if (next !== this.page) {
      this.page = next
      this._emit()
    }
  }

  render() {
    const pages = []
    const tp = this.totalPages
    const maxButtons = 5

    let start = Math.max(1, this.page - 2)
    let end = Math.min(tp, start + maxButtons - 1)

    start = Math.max(1, end - maxButtons + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    return html`
      <div class="pagination">
        <button-element
          variant="ghost"
          shape="circle"
          icon="chevron-left"
          title=${t('previous')}
          @click=${() => this._setPage(this.page - 1)}
          ?disabled=${this.page <= 1}
        ></button-element>
        ${start > 1
          ? html`
              <button-element
                variant="ghost"
                shape="circle"
                class="pagination__page"
                @click=${() => this._setPage(1)}
              >
                1
              </button-element>
            `
          : ''}
        ${start > 2 ? html`<span>…</span>` : ''}
        ${pages.map(
          p => html`
            <button-element
              variant="${p === this.page ? 'primary' : 'ghost'}"
              shape="circle"
              class="pagination__page ${p === this.page ? '--active' : ''}"
              @click=${() => this._setPage(p)}
            >
              ${p}
            </button-element>
          `
        )}
        ${end < tp - 1 ? html`<span>…</span>` : ''}
        ${end < tp
          ? html`
              <button-element
                variant="ghost"
                shape="circle"
                class="pagination__page"
                @click=${() => this._setPage(tp)}
              >
                ${tp}
              </button-element>
            `
          : ''}
        <button-element
          variant="ghost"
          shape="circle"
          icon="chevron-right"
          title=${t('next')}
          style="color:#ff6200"
          @click=${() => this._setPage(this.page + 1)}
          ?disabled=${this.page >= tp}
        ></button-element>
      </div>
    `
  }
}

customElements.define('pagination-element', PaginationElement)
