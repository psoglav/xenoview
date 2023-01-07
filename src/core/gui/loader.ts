interface LoaderOptions {
  container: HTMLElement
  color: string
}

export const createLoader = (opts: LoaderOptions) => {
  let xmlns = 'http://www.w3.org/2000/svg'
  let boxWidth = '65'
  let boxHeight = '65'

  const { container, color } = opts

  const el = <HTMLElement>document.createElementNS(xmlns, 'svg')
  el.id = '#cryptoview-spinner'
  el.style.color = color
  el.setAttributeNS(null, 'viewBox', '0 0 256 256')
  el.setAttributeNS(null, 'width', boxWidth)
  el.setAttributeNS(null, 'height', boxHeight)

  el.style.display = 'block'
  el.style.position = 'absolute'
  el.style.left = 'calc(50% - 70px)'
  el.style.top = 'calc(50% - 28px)'
  el.style.transform = 'translate(-50%, -50%)'
  el.style.transition = 'all .1s ease'
  el.style.pointerEvents = 'none'

  let path: HTMLElement = <HTMLElement>document.createElementNS(xmlns, 'path')
  path.setAttributeNS(null, 'stroke', 'currentColor')
  path.setAttributeNS(null, 'fill', 'currentColor')
  path.setAttributeNS(
    null,
    'd',
    'M228,128A100,100,0,1,1,86.3,37.1a4,4,0,1,1,3.4,7.2,92,92,0,1,0,76.6,0,3.9,3.9,0,0,1-1.9-5.3,4,4,0,0,1,5.3-1.9A100.2,100.2,0,0,1,228,128Z'
  )
  el.style.animation = '0.5s linear infinite rotate'

  el.appendChild(path)
  container.appendChild(el)

  return {
    set isActive(value) {
      el.style.display = value ? 'block' : 'none'
      container.style.opacity = value ? '0.3' : '1'
    }
  }
}
