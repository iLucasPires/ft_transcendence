export class Ball {
  readonly radius = 10;
  x: number = 0;
  y: number = 0;
  private ySpeed: number = 0;
  private xSpeed: number = 0;
  private readonly canvasHeight: number;
  private readonly canvasWidth: number;
  private readonly paddleWidth: number = 42;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  update(): void {
    if (this.y < this.radius || this.y > this.canvasHeight - this.radius) {
      this.ySpeed = -this.ySpeed;
    }

    if (this.playerScored() || this.player2Scored()) {
      this.reset();
    }

    // Update ball position
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  playerScored(): boolean {
    return this.x > this.canvasWidth - this.paddleWidth + this.radius;
  }

  player2Scored(): boolean {
    return this.x - this.radius < 0;
  }

  reset(): void {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;
    this.xSpeed = this.randomBetween(10, 11) * (Math.random() > 0.5 ? 1 : -1);
    this.ySpeed = this.randomBetween(-3, 3);
  }

  randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  changeDirection(): void {
    this.xSpeed = -this.xSpeed;
  }
}
