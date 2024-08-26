import secludedDraw from "../utils/secludedDraw.js";
import Page from "./page.js";

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function drawName(ctx) {
  ctx.fillStyle = "white";
  ctx.font = Math.min(100, ctx.canvas.width / 6.5) + 'px "Ubuntu Sans Mono"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "ROCKET RUSH",
    ctx.canvas.width / 2,
    (ctx.canvas.height * 3) / 8
  );
  return (ctx.canvas.width - ctx.measureText("ROCKET RUSH").width) / 2;
}

class StartPage extends Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(eventCleanupCallback) => void} pageExitCallback
   */
  constructor(canvas, pageExitCallback) {
    super(canvas, pageExitCallback);
  }
  handleKeydown(e) {
    if (e.key === "Enter") {
      this.exit();
    }
  }
  exit() {
    this.pageExitCallback();
  }
  createEvents() {
    addEventListener("keydown", this.handleKeydown.bind(this));
  }
  removeEvents() {
    removeEventListener("keydown", this.handleKeydown.bind(this));
  }
  update(dt) {
    secludedDraw(this.ctx, () => {
      this.scaleTime += 0.015 * dt * 1.5;
      let x = drawName(this.ctx);
      // if ((this.scaleTime % 1) > 0.5) {
      this.ctx.fillStyle = "white";
      this.ctx.font =
        Math.min(30, this.canvas.width / 15) + 'px "Ubuntu Sans Mono"';
      this.ctx.textAlign = "start";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("by Goal Ogunsina", x, (this.canvas.height * 3.7) / 8);

      this.ctx.textAlign = "center";
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, (this.canvas.height * 3) / 4);
      let sz =
        // Math.round
        (40 + Math.sin((this.scaleTime % 1) * Math.PI * 2) * 7) *
        Math.min(0.02, this.canvas.width / 20000);
      this.ctx.scale(sz, sz);
      // console.log(sz);
      this.ctx.font = '50px "Ubuntu Sans Mono"';
      this.ctx.fillText("ENTER TO START", 0, 0);
      this.ctx.restore();
    });
    // }
  }
}

export default StartPage;
export { drawName };
