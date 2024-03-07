const scaleForCanvas = (canvas: HTMLCanvasElement) => {
  const { width, height } = canvas;
  return {
    x: (x: number) => (x / 100) * width,
    y: (y: number) => (y / 100) * height,
  };
};

const drawLeftPaddle = (ctx: CanvasRenderingContext2D) => {
  const { x, y } = scaleForCanvas(ctx.canvas);
  ctx.fillStyle = "#8979F2";
  ctx.fillRect(x(3), y(45), x(1), y(10));
};

const drawRightPaddle = (ctx: CanvasRenderingContext2D) => {
  const { x, y } = scaleForCanvas(ctx.canvas);
  ctx.fillStyle = "#8979F2";
  ctx.fillRect(x(97), y(45), x(1), y(10));
};

const drawBall = (ctx: CanvasRenderingContext2D) => {
  const { x, y } = scaleForCanvas(ctx.canvas);
  ctx.fillStyle = "#8979F2";
  ctx.moveTo(x(50), y(50));
  ctx.arc(x(50), y(50), x(1), 0, Math.PI * 2);
  ctx.fill();
};

export const scaleCanvas = (canvas: HTMLCanvasElement, wrapper: HTMLDivElement) => {
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
};

export const updateGameCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawLeftPaddle(ctx);
  drawRightPaddle(ctx);
  drawBall(ctx);
};
