import { Ball } from "@/util/ball";
import { Paddle } from "@/util/paddle"

export class Player extends Paddle {
  wasReachedBy (ball: Ball): boolean {
    return (ball.x - ball.radius <= this.x + this.width && ball.x > this.x)
      && this.isAtTheSameHeightOf(ball)
  }
}
