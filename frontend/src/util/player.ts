import type p5 from "p5";

export default class {
  private position: p5.Vector;
  private directions: Record<string, boolean> = {
    UP: false,
    LEFT: false,
    DOWN: false,
    RIGHT: false,
  };

  constructor(private p: p5) {
    this.position = this.p.createVector(0, 0);
  }

  public draw(): void {
    this.p.ellipse(this.position.x, this.position.y, 50, 50);
  }

  public handleInput(): void {
    if (this.directions.UP) this.position.y -= 5;
    if (this.directions.LEFT) this.position.x -= 5;
    if (this.directions.DOWN) this.position.y += 5;
    if (this.directions.RIGHT) this.position.x += 5;
  }

  public stop(): void {
    this.directions.UP = false;
    this.directions.LEFT = false;
    this.directions.DOWN = false;
    this.directions.RIGHT = false;
  }

  public updateDirection(key: number, value: boolean): void {
    switch (key) {
      case this.p.UP_ARROW:
        this.directions.UP = value;
        break;
      case this.p.LEFT_ARROW:
        this.directions.LEFT = value;
        break;
      case this.p.DOWN_ARROW:
        this.directions.DOWN = value;
        break;
      case this.p.RIGHT_ARROW:
        this.directions.RIGHT = value;
        break;
    }
  }
}
