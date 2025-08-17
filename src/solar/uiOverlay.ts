import * as AnimeJS from 'animejs'
const anime: any = (AnimeJS as any).default ?? (AnimeJS as any)

export function clearSvg(svg: SVGSVGElement) {
  svg.innerHTML = ''
}

export function showLabel(svg: SVGSVGElement, text: string) {
  clearSvg(svg)
  const ns = 'http://www.w3.org/2000/svg'
  const g = document.createElementNS(ns, 'g')
  g.setAttribute('transform', 'translate(24,24)')
  const rect = document.createElementNS(ns, 'rect')
  rect.setAttribute('x', '0'); rect.setAttribute('y', '0'); rect.setAttribute('rx', '12')
  rect.setAttribute('width', '260'); rect.setAttribute('height', '48')
  rect.setAttribute('fill', 'rgba(17,24,39,0.65)')
  rect.setAttribute('stroke', 'rgba(99,102,241,0.6)')
  rect.setAttribute('stroke-width', '1')
  const label = document.createElementNS(ns, 'text')
  label.setAttribute('x', '16'); label.setAttribute('y', '30')
  label.setAttribute('fill', '#fff')
  label.setAttribute('font-size', '18')
  label.setAttribute('font-weight', '700')
  label.textContent = text
  g.appendChild(rect); g.appendChild(label)
  svg.appendChild(g)

  anime({ targets: g, opacity: [0, 1], duration: 450, easing: 'easeOutQuad' })
}

