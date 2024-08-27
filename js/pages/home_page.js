import Page from "./page.js";
import { drawName } from "./start_page.js";

class HomePage extends Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(page) => void} pageExitCallback
   */
  constructor(canvas, exitToPage, changeAudioStatus) {
    super(canvas, exitToPage);

    this.menu = [
      {
        name: "New Game",
        callback() {
          exitToPage('story');
        },
      },
      {
        name: "Continue",
        callback() {
          exitToPage('play');
        },
      },
      {
        name: "Audio: On",
        callback() {
          changeAudioStatus();
        },
      },
    ];
    this.selectedMenuItem = 0;
  }
  handleKeydown(e) {
    if (e.key === "Enter") {
      console.log("hey");
      this.menu[this.selectedMenuItem].callback()
    } else if (e.key === "ArrowLeft") {
      if (this.selectedMenuItem > 0) {
        this.selectedMenuItem -= 1;
      } else {
        this.selectedMenuItem = this.menu.length - 1;
      }
    } else if (e.key === "ArrowRight") {
      if (this.selectedMenuItem < this.menu.length - 1) {
        this.selectedMenuItem += 1;
      } else {
        this.selectedMenuItem = 0;
      }
    }
  }
  exit() {
    this.pageExitCallback();
  }
  createEvents() {
    addEventListener("keydown", this.handleKeydown.bind(this));
  }
  removeEvents() {
    console.log("removed home page events");
    removeEventListener("keydown", this.handleKeydown.bind(this));
  }
  update(dt) {
    drawName(this.ctx);

    const size = Math.min(100, this.canvas.width * 2 / 7);
    const rad = size / 4;
    const gap = 2;
    const cw =
      (this.menu.length * size - gap * (this.menu.length + 1)) /
      this.menu.length;
    const radius2heightRatio = rad / size;
    const br = radius2heightRatio * (size - gap * 2);
    const drawComp = (i) => {
      const leftRad = i === 0 ? br : 0;
      const rightRad = i === this.menu.length - 1 ? br : 0;
      this.ctx.roundRect(
        (this.canvas.width - size * this.menu.length) / 2 +
          cw * i +
          gap * (i + 1), //*(i === this.menu.length - 1 ? 2: 1),
        (this.canvas.height + size) / 2 + gap,
        cw,
        size - gap * 2,
        [leftRad, rightRad, rightRad, leftRad]
      );
    };
    const drawCompText = (i) => {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = Math.min(15, this.canvas.width * 1 / 20) + 'px "Ubuntu Sans Mono"';
      this.ctx.fillStyle = "white";

      // const h = measureTextWithinWidth(this.menu[i].name, this.ctx, cw).height
      this.ctx.fillText(
        this.menu[i].name,
        // this.ctx,
        (this.canvas.width - size * this.menu.length) / 2 +
          cw * i +
          gap * (i + 1) +cw/2,
        (this.canvas.height + size) / 2 + gap + size / 2 - gap,
        // cw - 5
      );
    };
    const drawComps = () => {
      for (let i = 0; i < this.menu.length; i++) {
        drawComp(i);
      }
    };
    const drawCompTexts = () => {
      for (let i = 0; i < this.menu.length; i++) {
        drawCompText(i);
      }
    };
    const drawAround = () => {
      this.ctx.roundRect(
        (this.canvas.width - size * this.menu.length) / 2,
        (this.canvas.height + size) / 2,
        size * this.menu.length,
        size,
        rad
      );
    };
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    drawComps();
    this.ctx.clip("evenodd");

    this.ctx.beginPath();
    drawAround();
    // this.ctx.strokeStyle = "white";
    // this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.beginPath();
    drawComp(this.selectedMenuItem);
    this.ctx.fillStyle = "#ffffff20";
    this.ctx.fill();
    drawCompTexts();
  }
  // this.ctx.moveTo(
  //   (this.canvas.width - size) / 2 +size  * i,
  //   (this.canvas.height + size) / 2
  // );
  // this.ctx.lineTo(
  //   (this.canvas.width - size) / 2 +size* i,
  //   this.canvas.height / 2 + size/2 + size
  // );
}

export default HomePage;
