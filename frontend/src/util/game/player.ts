import { Ball } from "./ball";
import { Paddle } from "./paddle";

export class Player extends Paddle {
  wasReachedBy(ball: Ball): boolean {
    const isWithinXBounds =
      ball.x - ball.radius <= this.x + this.width && ball.x > this.x;

    return isWithinXBounds && this.isAtTheSameHeightOf(ball);
  }
}

export class Player2 extends Paddle {
  wasReachedBy(ball: Ball): boolean {
    const isWithinXBounds =
      ball.x + ball.radius >= this.x && ball.x <= this.x + this.width;

    return isWithinXBounds && this.isAtTheSameHeightOf(ball);
  }
}
