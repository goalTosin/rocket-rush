import randAngle from "../utils/randAngle.js";
import rrand from "../utils/rrand.js";
import secludedDraw from "../utils/secludedDraw.js";

class StarField {
  constructor(x, y, w, h) {
    this.stars = Array.from({ length: 1000 }, () => {
      const a = randAngle();
      const r = rrand(Math.hypot(w, h) / 2);
      let s = new Star(
        Math.cos(a) * r + w / 2,
        Math.sin(a) * r + h / 2,
        1
      );
      let multt = Math.random();
      s.mult = multt;
      s.x *= 1 / multt;
      s.y *= 1 / multt;
      return s;
    });
  }
  update(ctx, camera) {
    this.stars.forEach((star) => {
      secludedDraw(ctx, () => {
        // ctx.translate(-camera.x,-camera.y)
        star.draw(ctx);
        if (star.isOutOfView(camera.x, camera.y, ctx.canvas.width, ctx.canvas.height)) {
          star.flip(-camera.x, -camera.y)
        }
        })
    });
  }

}

class Star {
  constructor(x, y, mult) {
    this.x = x;
    this.y = y;
    this.mult = mult;
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    secludedDraw(ctx, () => {
      ctx.beginPath();
      ctx.rect(this.x * this.mult, this.y * this.mult, 2, 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  }

  isOutOfView(x, y, w, h) {
    let gx = this.x * this.mult;
    let gy = this.y * this.mult;
    return gx < x || gy < y || gx > x + w || gy > y + h;
  }

  flip(x, y) {
    this.x = x - this.x;
    this.y = y - this.y;
  }
}

export default StarField;
