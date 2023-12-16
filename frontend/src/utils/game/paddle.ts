import { Ball } from "./ball";

export abstract class Paddle {
  readonly x: number;
  y: number;
  readonly height: number = 80;
  readonly width: number = 20;
  readonly canvasHeight: number;
  isDown = false;
  isUp = false;

  constructor(x: number, y: number, canvasHeight: number) {
    this.x = x;
    this.y = y;
    this.canvasHeight = canvasHeight;
  }

  moveUp(): void {
    if (this.y > 0) {
      this.y -= Paddle.MOVE_AMOUNT;
    }
  }

  moveDown(): void {
    if (this.y < this.canvasHeight - this.height) {
      this.y += Paddle.MOVE_AMOUNT;
    }
  }

  update(): void {
    this.isUp && this.moveUp();
    this.isDown && this.moveDown();
  }

  abstract wasReachedBy(ball: Ball): boolean;

  isAtTheSameHeightOf(ball: Ball): boolean {
    return ball.y >= this.y && ball.y <= this.y + this.height;
  }

  static readonly MOVE_AMOUNT: number = 10;
}
