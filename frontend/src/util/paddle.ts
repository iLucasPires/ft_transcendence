export class Paddle {
  readonly x: number
  y: number
  readonly height: number = 80
  readonly width: number = 20
  readonly canvasHeight: number
  isDown = false
  isUp = false

  constructor(x: number, y:number, canvasHeight: number) {
    this.x = x
    this.y = y
    this.canvasHeight = canvasHeight
  }
  moveUp() {
    if (this.y > 0){
      this.y -= 10
    }
  
  }
  moveDown() {
    if (this.y < this.canvasHeight - this.height) {
      this.y += 10
    }
  }

  update() {
    if (this.isUp) {
      this.moveUp()
    } else if (this.isDown) {
      this.moveDown()
    }
  }
}
