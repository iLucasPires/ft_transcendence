import { Paddle } from "@/util/paddle"
import { Ball } from "@/util/ball"

export class Player2 extends Paddle {
  wasReachedBy(ball: Ball): boolean {
    return ball.x + ball.radius >= this.x && ball.x <= this.x + this.width
    && this.isAtTheSameHeightOf(ball)
  }
}
