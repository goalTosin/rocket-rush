import randAngle from "../utils/randAngle.js";
import randomItem from "../utils/randomItem.js";
import rotatePoint from "../utils/rotatePoint.js";
import rrand from "../utils/rrand.js";
import secludedDraw from "../utils/secludedDraw.js";

class StarField {
  constructor(x, y, w, h, r) {
    this.stars = Array.from({ length: 100 }, () => {
      const p = rotatePoint(
        { x: Math.random() * w + x - w / 2, y: Math.random() * h + y - h / 2 },
        { x, y },
        -r
      );
      return new Star(p.x, p.y);
    });
  }

  update(ctx, camera) {
    // const { x: camX, y: camY } = rotatePoint(
    //   camera,
    //   { x: camera.x + camera.width / 2, y: camera.y + camera.height / 2 },
    //   -camera.rotation
    // );
    const camX = camera.x;
    const camY = camera.y;
    this.stars.forEach((star) => {
      star.draw(ctx);
      // console.log(star.x, star.y,);
      if (
        star.isOutOfView(
          camX,
          camY,
          ctx.canvas.width,
          ctx.canvas.height,
          camera.rotation
        )
      ) {
        star.enterView(camera,ctx)
      }
    });
  }
}

class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   *
   * @param { CanvasRenderingContext2D } ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 2, 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  enterView(camera, ctx) {
    const mainGenerationAxis = randomItem(["x", "y"]);
        const x =
          mainGenerationAxis === "x"
            ? ctx.canvas.width * Math.random() - ctx.canvas.width / 2
            : randomItem([0, ctx.canvas.width]) - ctx.canvas.width / 2;
        const y =
          mainGenerationAxis === "y"
            ? ctx.canvas.height * Math.random() - ctx.canvas.height / 2
            : randomItem([0, ctx.canvas.height]) - ctx.canvas.height / 2;
        const p = rotatePoint(
          { x: camera.x + x, y: camera.y + y },
          camera,
          camera.rotation
        );
        this.x = p.x;
        this.y = p.y;
  }

  isOutOfView(x, y, w, h, r) {
    const p = rotatePoint({ x: this.x, y: this.y }, { x, y }, -r);
    let tx = p.x;
    let ty = p.y;
    return tx < x - w / 2 || ty < y - h / 2 || tx > x + w / 2 || ty > y + h / 2;
  }
}

export default StarField;
