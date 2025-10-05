import { LitElement, html, css, unsafeCSS } from 'lit'

import rawStyles from '@/styles/layout/app-main.scss?inline'

export class AppMain extends LitElement {
  static styles = css`
    ${unsafeCSS(rawStyles)}
  `
  render() {
    return html`<main id="main"></main>`
  }
}

customElements.define('app-main', AppMain)
