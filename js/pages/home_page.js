import Page from "./page.js";
import { drawName } from "./start_page.js";

class HomePage extends Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {() => void} pageExitCallback
   */
  constructor(canvas, pageExitCallback) {
    super(canvas, pageExitCallback);

    this.menu = [
      {
        name: "New Game",
        callback() {
          pageExitCallback();
        },
      },
      {
        name: "Continue",
        callback() {
          pageExitCallback();
        },
      },
      {
        name: "Audio: On",
        callback() {
          pageExitCallback();
        },
      },
    ];
  }
  handleKeydown(e) {
    if (e.key === "Enter") {
      console.log('hey');
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
    drawName(this.ctx);

    const size = 30;
    this.ctx.beginPath();
    this.ctx.roundRect(
      (this.canvas.width - (size * this.menu)) / 2,
      (this.canvas.height-size) / 2,
      size * this.menu,
      size,
      size/4
    );
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 2
    this.ctx.stroke();
    // for (let i = 0; i < this.menu; i++) {
    //   this.ctx.beginPath();
    //   this.ctx.roundRect();
    // }
  }
}

export default HomePage;
