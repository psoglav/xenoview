import { TLinearChartOptions, LinearHistory, ChartData } from '../types'

import Chart from '../base'

export class LinearChart extends Chart {
  private CHART_HOVER_STROKE_WIDTH = 1.5
  private CHART_CURRENT_STROKE_WIDTH = this.CHART_HOVER_STROKE_WIDTH
  private CHART_STROKE_WIDTH = 1
  private CHART_STROKE_COLOR = '#ffffff99'
  private CHART_POINTER_COLOR = '#aaaaff99'

  private CHART_PRICE_SEGMENTS = 6
  private CHART_GRADIENT: CanvasGradient | undefined

  private GRAPH_LEFT = 0
  private GRAPH_RIGHT = this.width

  private pointerYPosIndex = 4
  private pointerIsVisible = false
  private panningIsActive = false

  private mousePosition = { x: 0, y: 0 }

  private history: LinearHistory | undefined
  private chartData: ChartData | undefined

  constructor(
    container: HTMLElement | string,
    data?: LinearHistory,
    opts?: TLinearChartOptions,
  ) {
    super(container)

    if (data) this.loadHistory(data)

    if (opts) this.applyOptions(opts)
    this.draw()
  }

  applyOptions(opts: TLinearChartOptions) {
    if (opts.chartStroke) {
      let { color, width, hoverWidth } = opts.chartStroke

      if (color) this.CHART_STROKE_COLOR = color
      if (hoverWidth) this.CHART_HOVER_STROKE_WIDTH = hoverWidth
      if (width) {
        this.CHART_STROKE_WIDTH = width
        this.CHART_CURRENT_STROKE_WIDTH = width
      }
    }

    if (opts.chartFill) {
      let { gradientStart, gradientEnd } = opts.chartFill

      if (gradientStart && gradientEnd) {
        this.CHART_GRADIENT = this.chartContext.createLinearGradient(
          0,
          0,
          0,
          this.height,
        )
        this.CHART_GRADIENT.addColorStop(0, gradientStart)
        this.CHART_GRADIENT.addColorStop(1, gradientEnd)
      }
    }
  }

  get visibleChartData() {
    return this.chartData?.filter((y, i) => {
      let x =
        this.GRAPH_LEFT + i * (this.floatingWidth! / this.chartData!.length)

      return x > this.GRAPH_LEFT && x < this.GRAPH_RIGHT
    })
  }

  get chartDataWithPadding() {
    let hh = this.height / 2
    return this.visibleChartData?.map((y) => (y - hh) / 1.5 + hh)
  }

  get topHistoryPrice() {
    let history = this.history!.map(([_, price]) => price)
    let max = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p > max) {
        max = p
        i = ii
      }
    })

    return [i, max]
  }

  get bottomHistoryPrice() {
    let history = this.history!.map(([_, price]) => price)
    let min = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p < min) {
        min = p
        i = ii
      }
    })

    return [i, min]
  }

  get floatingWidth() {
    return this.GRAPH_RIGHT - this.GRAPH_LEFT
  }

  normalizeToChartY(value: number) {
    let max = this.topHistoryPrice[1]
    let min = this.bottomHistoryPrice[1]

    let h = this.height
    let y = h - ((value - min) / (max - min)) * (h || 1)

    return (y - h / 2) / 1.5 + h / 2
  }

  windowMouseMoveHandler(e?: MouseEvent | undefined): void {}
  windowMouseUpHandler(e?: MouseEvent | undefined): void {}

  timeAxisMouseDownHandler(e?: MouseEvent | undefined): void {}
  timeAxisMouseUpHandler(e?: MouseEvent | undefined): void {}

  yAxisMouseDownHandler(e?: MouseEvent | undefined): void {}
  yAxisMouseMoveHandler(e?: MouseEvent | undefined): void {}
  yAxisMouseUpHandler(e?: MouseEvent | undefined): void {}

  mouseMoveHandler(e: MouseEvent) {
    this.CHART_CURRENT_STROKE_WIDTH = this.CHART_HOVER_STROKE_WIDTH
    this.mousePosition.x = e.clientX
    this.mousePosition.y = e.clientY

    if (this.panningIsActive) {
      this.moveChart(e.movementX)
    }

    this.movePointer()
    this.draw()
  }

  mouseEnterHandler() {
    this.pointerIsVisible = true
  }

  mouseLeaveHandler() {
    this.CHART_CURRENT_STROKE_WIDTH = this.CHART_STROKE_WIDTH
    this.pointerIsVisible = false
    this.panningIsActive = false

    this.draw()
  }

  mouseDownHandler(e: MouseEvent) {
    if (e.button == 0) {
      e.preventDefault()
      this.panningIsActive = true
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (e.button == 0) {
      this.panningIsActive = false
    }
  }

  wheelHandler(e: any) {
    this.zoomChart(e.wheelDeltaY > 1 ? 1 : -1)
    this.movePointer()
    this.draw()
  }

  draw(updateChartData?: boolean) {
    this.chartContext.clearRect(0, 0, this.width, this.height)

    this.drawGrid(this.CHART_PRICE_SEGMENTS)
    this.drawChart(updateChartData)
    this.drawPointer()
  }

  zoomChart(side: number) {
    let mx = this.mousePosition.x
    let d = 20 / this.zoomSpeed

    this.GRAPH_RIGHT += ((this.GRAPH_RIGHT - mx) / d) * side
    this.GRAPH_LEFT += ((this.GRAPH_LEFT - mx) / d) * side

    this.clampChart()
  }

  moveChart(movement: number) {
    if (this.GRAPH_RIGHT == this.width - 200 && movement < 0) return
    if (this.GRAPH_LEFT == 0 && movement > 0) return

    this.GRAPH_LEFT += movement
    this.GRAPH_RIGHT += movement

    this.clampChart()
  }

  clampChart() {
    if (this.GRAPH_LEFT > 0) this.GRAPH_LEFT = 0
    if (this.GRAPH_RIGHT < this.width - 200) this.GRAPH_RIGHT = this.width - 200
  }

  movePointer() {
    let data = this.visibleChartData

    if (!data?.length) return

    let x = this.mousePosition.x - this.canvasRect.x
    x = ((x - this.GRAPH_LEFT) / this.floatingWidth) * data.length

    let i = Math.round(x)

    this.pointerYPosIndex =
      i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i
  }

  drawPointer() {
    if (!this.chartData?.length || !this.pointerIsVisible) return

    let ctx = this.chartContext
    let history = this.chartDataWithPadding!
    let x =
      this.GRAPH_LEFT +
      (this.floatingWidth / history.length) * this.pointerYPosIndex
    let y = history[this.pointerYPosIndex]

    ctx.beginPath() // pointer border
    ctx.ellipse(x, y, 8, 8, 0, 0, 10)
    ctx.fillStyle = this.CHART_POINTER_COLOR
    ctx.fill()
    ctx.closePath()

    ctx.beginPath() // pointer
    ctx.ellipse(x, y, 4, 4, 0, 0, 10)
    ctx.fillStyle = '#aaaaff'
    ctx.fill()
    ctx.closePath()

    ctx.beginPath() // pointer vertical line
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this.height)
    ctx.strokeStyle = '#ffffff33'
    let prevLineWidth = ctx.lineWidth
    ctx.lineWidth = 1
    ctx.setLineDash([8, 4])
    ctx.stroke()
    ctx.setLineDash([])
    ctx.lineWidth = prevLineWidth
    ctx.closePath()

    ctx.font = `Verdana`
    ctx.fillStyle = 'white'
    ctx.fillText(this.history![this.pointerYPosIndex][1].toString(), 10, 50)
    ctx.fillText(
      new Date(this.history![this.pointerYPosIndex][0] * 1000).toString(),
      10,
      70,
    )
  }

  drawChart(updateChartData?: boolean) {
    if (updateChartData) {
      this.chartData = this.normalizeData()
    }

    let data = this.chartDataWithPadding || []

    if (!data.length) {
      this.log('no history')
      return
    }

    let ctx = this.chartContext

    ctx.beginPath()

    ctx.strokeStyle = this.CHART_STROKE_COLOR
    ctx.lineWidth = this.CHART_CURRENT_STROKE_WIDTH || this.CHART_STROKE_WIDTH

    ctx.moveTo(this.GRAPH_LEFT - 10, this.height)
    ctx.lineTo(this.GRAPH_LEFT - 10, data[0])

    for (let i = 0; i < data.length; i++) {
      let x = this.GRAPH_LEFT + i * (this.floatingWidth! / data.length)
      let y = data[i]

      ctx.lineTo(x, y)
    }

    ctx.lineTo(this.width + 10, data[data.length - 1])
    ctx.lineTo(this.width + 10, this.height + 1)

    ctx.fillStyle = this.CHART_GRADIENT || ''

    ctx.fill()
    ctx.stroke()

    ctx.closePath()
  }

  drawGrid(segments: number) {
    let ctx = this.chartContext

    let top, bottom

    top = this.topHistoryPrice[1]
    bottom = this.bottomHistoryPrice[1]

    top = Math.round(top / 1000) * 1000
    bottom = Math.round(bottom / 1000) * 1000

    let interval = (bottom - top) / segments

    ctx.strokeStyle = '#ffffff22'
    ctx.strokeRect(0, 0, this.width, this.height)

    ctx.beginPath()

    for (let i = -1; i <= segments + 1; i++) {
      let y = i * interval + top

      ctx.fillStyle = '#ffffff44'
      ctx.fillText(y.toString(), this.width - 35, this.normalizeToChartY(y) - 5)

      y = this.normalizeToChartY(y)

      ctx.moveTo(0, y)
      ctx.lineTo(this.width, y)
    }

    ctx.strokeStyle = '#ffffff33'
    let prevLineWidth = ctx.lineWidth
    ctx.lineWidth = 0.5
    ctx.stroke()
    ctx.lineWidth = prevLineWidth
    ctx.closePath()
  }

  loadHistory(data: LinearHistory) {
    this.history = data
    this.draw(true)
  }

  normalizeData() {
    let h = this.height
    let hist = this.history!
    let result = []

    let min = this.bottomHistoryPrice[1]
    let max = this.topHistoryPrice[1]

    for (let i = 0; i < hist.length; i++) {
      let normalized = h - ((hist[i][1] - min) / (max - min)) * (h || 1)
      result.push(normalized)
    }

    return result
  }
}
