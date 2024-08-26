import secludedDraw from "../utils/secludedDraw.js";
import Sprite from "./sprite.js";

class FuelCanister {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = new Sprite("");
    this.sprite.addEventListener("load", () => {
      let s = 0.1;
      this.width = this.sprite.width * s;
      this.height = this.sprite.height * s;
    });
    this.height = 20;
    this.width = 20;
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    secludedDraw(ctx, () => {
      ctx.translate(this.x, this.y);
      if (this.sprite.loaded) {
        ctx.drawImage(
          this.sprite,
          -this.sprite.width / 2,
          -this.sprite.height / 2,
          this.sprite.width,
          this.sprite.height
        );
      } else {
        ctx.fillRect(
          -this.sprite.width / 2,
          -this.sprite.height / 2,
          this.sprite.width,
          this.sprite.height
        )
      }
    });
  }
}

export default FuelCanister;
