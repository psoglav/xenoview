import Color from 'color'
import { capitalize } from '../../utils'
import { VElement, Button } from '.'
import { EventEmitter } from '..'

export class Position extends VElement {
  public options: OrderModel

  public get color() {
    return new Color(this.chart.options.candles.colors[this.options.side === 'buy' ? 'higher' : 'lower']).alpha(
      this.options.disabled ? 0.5 : 1
    )
  }

  public get fillColor() {
    return new Color(this.chart.options.bgColor)
  }

  private buttonGroup: Record<string, Button> = {}

  constructor(canvas: HTMLCanvasElement, options: OrderModel) {
    super(canvas)
    this.options = options

    this.setPosition(
      this.chart.canvasRect.width - 200,
      this.chart.normalizeToY(this.options.deltaPrice + this.options.price)
    )

    const padding = {
      x: 8,
      y: 4
    }

    const fillColor = {
      default: this.fillColor,
      hover: this.fillColor.lighten(0.8),
      active: this.fillColor.lighten(2)
    }

    const textColor = {
      default: this.color,
      hover: this.color.lighten(0.4),
      active: this.color.lighten(2)
    }

    const self = this

    this.buttonGroup.modifyButton = new Button(canvas, 0, 0, {
      padding,
      fillColor,
      textColor,
      text: options.units.toString(),
      click() {
        EventEmitter.dispatch('trading:order-modify', options.id)
      }
    })

    this.buttonGroup.handleButton = new Button(canvas, 0, 0, {
      padding,
      fillColor: {
        default: this.chart.options.bgColor
      },
      textColor: {
        default: this.color
      },
      text: `${capitalize(options.side)} ${capitalize(options.type)}`,
      grab() {
        self.options.deltaPrice = self.chart.normalizeToPrice(self.chart.uiLayer.mouse.y) - self.options.price
      }
    })

    this.buttonGroup.removeButton = new Button(canvas, 0, 0, {
      padding,
      fillColor,
      textColor,
      text: 'x',
      click() {
        EventEmitter.dispatch('trading:order-cancel', options)
      }
    })
  }

  update() {
    if (this.options.status !== 'working') return

    this.setPosition(
      this.chart.canvasRect.width - 200,
      this.chart.normalizeToY(this.options.deltaPrice + this.options.price)
    )

    let xshift = 0
    let height = 0

    Object.values(this.buttonGroup).forEach(btn => {
      btn.setPosition(this.position.x + xshift, this.position.y)
      xshift += btn.rect.width
      height = btn.rect.height
      btn.update()
    })

    this._rect.x = this.buttonGroup.modifyButton.rect.x
    this._rect.y = this.buttonGroup.modifyButton.rect.y
    this._rect.width = xshift
    this._rect.height = height

    this.draw()
  }

  draw() {
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.position.y)
    this.ctx.lineTo(this.chart.canvasRect.width, this.position.y)
    this.ctx.closePath()
    this.ctx.stroke()

    Object.values(this.buttonGroup).forEach(btn => {
      btn.options.textColor.default = this.color
      btn.update()
    })

    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = this.color
    this.ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
  }

  onMouseDown(e: MouseEvent): void {}
  onMouseUp(e: MouseEvent): void {
    console.log(this.options.isGrabbed)
    if (this.options.isGrabbed) this.options.disabled = true
  }
  onMouseEnter(e: MouseEvent): void {}
  onMouseMove(e: MouseEvent): void {}
  onMouseLeave(e: MouseEvent): void {}

  destroy(): void {
    Object.values(this.buttonGroup).forEach(btn => {
      btn.destroy()
    })
    this.isDestroyed = true
  }
}
