export class Ball {
  readonly radius = 10
  x: number = 0
  y: number = 0
  private ySpeed: number = 0
  private xSpeed: number = 0
  private readonly canvasHeight:number
  private readonly canvasWidth:number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.reset()
  }
  update() {
    if (this.y < this.radius || this.y > this.canvasHeight - this.radius) {
      this.ySpeed = -this.ySpeed
    }
    if (this.playerScored()) {
      this.reset()
    } else if (this.player2Scored()) {
      this.reset()
    }
    this.x += this.xSpeed
    this.y += this.ySpeed
  }

  playerScored():boolean {
    return this.x > (this.canvasWidth - 42) + this.radius
  }

  player2Scored():boolean {
    return this.x - 25 < this.radius
  }

  reset() {
    this.x = this.canvasWidth / 2
    this.y = this.canvasHeight / 2
    this.xSpeed = this.randomBetween(10, 11)
    let isLeft = this.randomBetween(0, 1) > 0.5
    if (isLeft) {
      this.xSpeed = -this.xSpeed
    }
    this.ySpeed = this.randomBetween(-3, 3)
  }
  randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min
  }
  changeDirection() {
    this.xSpeed = -this.xSpeed
  }
}
