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
    let audioOn = true;
    this.menu = [
      {
        name: "New Game",
        callback() {
          exitToPage("story");
        },
      },
      {
        name: "Continue",
        callback() {
          exitToPage("play");
        },
      },
      {
        name: "Tutorial",
        callback() {
          exitToPage("story");
        },
      },
      {
        get name() {
          return "Audio: " + (audioOn ? "On" : "Off");
        },
        callback: () => {
          audioOn = !audioOn;
          changeAudioStatus(audioOn);
        },
      },
    ];
    this.selectedMenuItem = 0;
    this.handleKeydownHandler = this.handleKeydown.bind(this)
  }
  handleKeydown(e) {
    if (e.key === "Enter") {
      this.menu[this.selectedMenuItem].callback();
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
  createEvents() {
    addEventListener("keydown", this.handleKeydownHandler);
  }
  removeEvents() {
    removeEventListener("keydown", this.handleKeydownHandler);
  }
  update(dt) {
    drawName(this.ctx);

    // Serves as height for menu items container. Also serves as width for each menu item (this width includes the gap)
    const size = Math.min(150, (this.canvas.width * 2) / 8.2);
    const rad = size / 4;
    const gap = 2;
    const computedMenuItemWidth =
      (this.menu.length * size - gap * (this.menu.length + 1)) /
      this.menu.length;
    const radius2heightRatio = rad / size;
    const computedMenuItemRadius = radius2heightRatio * (size - gap * 2);

    const drawMenuItem = (i) => {
      const leftRad = i === 0 ? computedMenuItemRadius : 0;
      const rightRad = i === this.menu.length - 1 ? computedMenuItemRadius : 0;
      this.ctx.roundRect(
        (this.canvas.width - size * this.menu.length) / 2 +
          computedMenuItemWidth * i +
          gap * (i + 1), //*(i === this.menu.length - 1 ? 2: 1),
        (this.canvas.height + size) / 2 + gap,
        computedMenuItemWidth,
        size - gap * 2,
        [leftRad, rightRad, rightRad, leftRad]
      );
    };
    const drawMenuItemText = (i) => {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font =
        Math.min(20, this.canvas.width / 24) + 'px "Ubuntu Sans Mono"';
      this.ctx.fillStyle = "white";

      this.ctx.fillText(
        this.menu[i].name,
        (this.canvas.width - size * this.menu.length) / 2 +
          computedMenuItemWidth * i +
          gap * (i + 1) +
          computedMenuItemWidth / 2,
        (this.canvas.height + size) / 2 + gap + size / 2 - gap
      );
    };
    const drawAllMenuItems = () => {
      for (let i = 0; i < this.menu.length; i++) {
        drawMenuItem(i);
      }
    };
    const drawAllMenuItemTexts = () => {
      for (let i = 0; i < this.menu.length; i++) {
        drawMenuItemText(i);
      }
    };
    const drawMenuContainer = () => {
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
    drawAllMenuItems();
    this.ctx.clip("evenodd");

    this.ctx.beginPath();
    drawMenuContainer();
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.beginPath();
    drawMenuItem(this.selectedMenuItem);
    this.ctx.fillStyle = "#ffffff20";
    this.ctx.fill();

    drawAllMenuItemTexts();
  }
}

export default HomePage;
