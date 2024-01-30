import PFive from "p5";
import { Paddle } from "./paddle";
import { Ball } from "./ball";

export class Player extends Paddle {
  wasReachedBy(ball: Ball): boolean {
    const isWithinXBounds = ball.x - ball.radius <= this.x + this.width && ball.x > this.x;

    return isWithinXBounds && this.isAtTheSameHeightOf(ball);
  }
}

export function startGame(clientWidth: number, clientHeight: number) {
  return new PFive(function (p5: PFive) {
    let player: Player;
    let enemy: Player;
    let ball: Ball;

    p5.setup = function () {
      const sizeScreen = p5.createVector(clientWidth, clientHeight);

      p5.createCanvas(sizeScreen.x, sizeScreen.y).parent("game");
      player = new Player(26, p5.height / 2, p5.height);
      enemy = new Player(p5.width - 48, p5.height / 2, p5.height);
      ball = new Ball(p5.width, p5.height);
    };

    function displayPaddle(paddle: Paddle) {
      p5.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function displayBall(ball: Ball) {
      p5.ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
    }

    function handleCollision(player: Paddle, enemy: Paddle, ball: Ball) {
      if (player.wasReachedBy(ball) || enemy.wasReachedBy(ball)) {
        ball.changeDirection();
      }
    }

    function updateEntities() {
      player.update();
      enemy.update();
      ball.update();
    }

    function drawEntities() {
      displayPaddle(player);
      displayPaddle(enemy);
      displayBall(ball);
    }

    function clearBackground() {
      p5.background(0);
    }

    p5.keyPressed = () => {
      player.isUp = p5.keyCode === p5.UP_ARROW ? true : false;
      player.isDown = p5.keyCode === p5.DOWN_ARROW ? true : false;

      enemy.isUp = p5.keyCode === p5.UP_ARROW ? true : false;
      enemy.isDown = p5.keyCode === p5.DOWN_ARROW ? true : false;
    };

    p5.keyReleased = () => {
      player.isUp = p5.keyCode === p5.UP_ARROW ? false : player.isUp;
      player.isDown = p5.keyCode === p5.DOWN_ARROW ? false : player.isDown;

      enemy.isUp = p5.keyCode === p5.UP_ARROW ? false : enemy.isUp;
      enemy.isDown = p5.keyCode === p5.DOWN_ARROW ? false : enemy.isDown;
    };

    p5.draw = () => {
      clearBackground();
      drawEntities();
      updateEntities();
      handleCollision(player, enemy, ball);
    };
  });
}
