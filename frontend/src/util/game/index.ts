import PFive from "p5";
import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Player, Player2 } from "./player";

export function startGame(clientWidth: number, clientHeight: number) {
  return new PFive(function (p5: PFive) {
    let player: Player;
    let player2: Player2;
    let ball: Ball;

    p5.setup = function () {
      const sizeScreen = p5.createVector(clientWidth, clientHeight);

      p5.createCanvas(sizeScreen.x, sizeScreen.y).parent("game");
      player = new Player(26, p5.height / 2, p5.height);
      player2 = new Player2(p5.width - 48, p5.height / 2, p5.height);
      ball = new Ball(p5.width, p5.height);
    };

    function displayPaddle(paddle: Paddle) {
      p5.stroke(255);
      p5.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function displayBall(ball: Ball) {
      p5.stroke(255);
      p5.ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
    }

    function handleCollision(player: Paddle, player2: Paddle, ball: Ball) {
      if (player.wasReachedBy(ball) || player2.wasReachedBy(ball)) {
        ball.changeDirection();
      }
    }

    function updateEntities() {
      player.update();
      ball.update();
    }

    function drawEntities() {
      displayPaddle(player);
      displayPaddle(player2);
      displayBall(ball);
    }

    function clearBackground() {
      p5.background(0);
    }

    p5.keyPressed = () => {
      player.isUp = p5.keyCode === p5.UP_ARROW ? true : false;
      player.isDown = p5.keyCode === p5.DOWN_ARROW ? true : false;
    };

    p5.keyReleased = () => {
      player.isUp = p5.keyCode === p5.UP_ARROW ? false : player.isUp;
      player.isDown = p5.keyCode === p5.DOWN_ARROW ? false : player.isDown;
    };

    p5.draw = () => {
      clearBackground();
      drawEntities();
      updateEntities();
      handleCollision(player, player2, ball);
    };
  });
}
