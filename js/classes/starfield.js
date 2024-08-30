import randAngle from "../utils/randAngle.js";
import randomItem from "../utils/randomItem.js";
import rrand from "../utils/rrand.js";
import secludedDraw from "../utils/secludedDraw.js";

class StarField {
  constructor(x, y, w, h) {
    this.stars = Array.from({ length: 100 }, () => {
      return new Star(Math.random() * w + x, Math.random() * h + y);
    });
  }

  update(ctx, camera) {
    this.stars.forEach((star) => {
      secludedDraw(ctx, () => {
        ctx.translate(-camera.x, -camera.y);
        star.draw(ctx);
        
        if (
          star.isOutOfView(
            camera.x,
            camera.y,
            ctx.canvas.width,
            ctx.canvas.height
          )
        ) {
          const mainGenerationAxis = randomItem(["x", "y"]);
          const x =
            mainGenerationAxis === "x"
              ? ctx.canvas.width * Math.random()
              : randomItem([0, ctx.canvas.width]);
          const y =
            mainGenerationAxis === "y"
              ? ctx.canvas.height * Math.random()
              : randomItem([0, ctx.canvas.height]);
          star.x = camera.x + x;
          star.y = camera.y + y;
        }
      });
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
    secludedDraw(ctx, () => {
      ctx.beginPath();
      ctx.rect(this.x, this.y, 2, 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  }

  isOutOfView(x, y, w, h) {
    let tx = this.x;
    let ty = this.y;
    return tx < x || ty < y || tx > x + w || ty > y + h;
  }
}

export default StarField;
