import type { iGameState } from "@/types/props";

const LEFT_PADDLE_X = 25;
const RIGHT_PADDLE_X = 775 - 16;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 60;
const BALL_RADIUS = 8;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const scaleForCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas;
  return {
    x: (x: number) => (x / CANVAS_WIDTH) * width,
    y: (y: number) => (y / CANVAS_HEIGHT) * height,
  };
};

const drawLeftPaddle = (ctx: CanvasRenderingContext2D, leftPaddleY: number) => {
  const { x, y } = scaleForCanvas(ctx.canvas);

  ctx.fillStyle = "#8979F2";
  ctx.fillRect(x(LEFT_PADDLE_X), y(leftPaddleY), x(PADDLE_WIDTH), y(PADDLE_HEIGHT));
};

const drawRightPaddle = (ctx: CanvasRenderingContext2D, rightPaddleY: number) => {
  const { x, y } = scaleForCanvas(ctx.canvas);
  ctx.fillStyle = "#8979F2";
  ctx.fillRect(x(RIGHT_PADDLE_X), y(rightPaddleY), x(PADDLE_WIDTH), y(PADDLE_HEIGHT));
};

const drawBall = (ctx: CanvasRenderingContext2D, ballX: number, ballY: number) => {
  const { x, y } = scaleForCanvas(ctx.canvas);
  ctx.beginPath();
  ctx.arc(x(ballX), y(ballY), x(BALL_RADIUS), 0, Math.PI * 2);
  ctx.fillStyle = "#8979F2";
  ctx.fill();
  ctx.closePath();
};

const drawMiddleLine = (ctx: CanvasRenderingContext2D) => {
  const { x, y } = scaleForCanvas(ctx.canvas);

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x(CANVAS_WIDTH / 2), 0);
  ctx.lineTo(x(CANVAS_WIDTH / 2), y(CANVAS_HEIGHT));
  ctx.strokeStyle = "#8979F2";
  ctx.stroke();
  ctx.closePath();
};

export const scaleCanvas = (canvas: HTMLCanvasElement, wrapper: HTMLDivElement) => {
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
};

export const updateGameCanvas = (ctx: CanvasRenderingContext2D, state: iGameState) => {
  const { leftPlayerY, rightPlayerY, ballPosition } = state;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawMiddleLine(ctx);
  drawLeftPaddle(ctx, leftPlayerY);
  drawRightPaddle(ctx, rightPlayerY);
  drawBall(ctx, ballPosition.x, ballPosition.y);
};
