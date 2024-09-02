import HomePage from "./pages/home_page.js";
import PlayPage from "./pages/play_page.js";
import StartPage from "./pages/start_page.js";
import StoryPage from "./pages/story_page.js";
import {
  fillTextWithinWidth,
  measureTextWithinWidth,
} from "./utils/fitTextInBound.js";
import search from "./utils/search.js";

class Game {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.animationStarted = false;
    this.lastTimeStamp = 0;
    this.stepRate = 1 / 16;
    this.transiting = false;
    this.transitPercent = 0;
    this.transitTimeSpent = 0;
    this.transitDuration = 10;
    this.setupCanvasSizing();
    this.setup();
  }
  get currentPage() {
    return this.pages[this.page]
  }
  setup() {
    this.pages = {
      start: new StartPage(this.canvas, this.navigateToPage.bind(this)),
      home: new HomePage(this.canvas, this.navigateToPage.bind(this), () =>
        console.log("For now, we haven't implemented audio status changing")
      ),
      play: new PlayPage(this.canvas, this.navigateToPage.bind(this)),
      story: new StoryPage(this.canvas, this.navigateToPage.bind(this)),
    };

    this.page = null;
    this.navigateToPage("start");
  }
  navigateToPage(page) {
    if (Object.keys(this.pages).includes(page)) {
      if (this.page) {
        this.currentPage.removeEvents();
        console.debug(`cleaned up events for the ${this.page} page`);
      }
      this.page = page;
      this.currentPage.createEvents();
      console.debug(`created events for the ${page} page`);
    } else {
      const alike = search(Object.keys(this.pages), page);
      console.error(
        "The page that was attempted to navigate to is not an actual page" +
          (alike.length > 0 ? ". Did you mean " + alike.join(" or ") + "?" : "")
      );
    }
  }
  sizeCanvas() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
  }
  setupCanvasSizing() {
    this.sizeCanvas();
    addEventListener("resize", this.sizeCanvas.bind(this));
  }
  requestAnimationFrame() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  animate(timeStamp) {
    this.requestAnimationFrame();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const dt = (timeStamp - this.lastTimeStamp) * this.stepRate;
    try {
      this.pages[this.page].update(dt);
    } catch (error) {
      this.drawError(error.name, error.message);
      console.log(error);
    }
    this.showTransitionFX();
    this.lastTimeStamp = timeStamp;
  }
  drawError(header, message) {
    const headerFont = Math.max(40, 1) + 'px "Ubuntu Sans Mono"';
    const messageFont = Math.max(10, 1) + 'px "Ubuntu Sans Mono"';
    // const gh = (p) => parseInt(p.substring(0, p.indexOf("p")));
    const headerWidth = (() => {
      this.ctx.font = headerFont;
      return this.ctx.measureText(header).width;
    })();
    const headerHeight = (textBoxW, margin) => {
      this.ctx.font = headerFont;
      return measureTextWithinWidth(header, this.ctx, textBoxW - margin * 2)
        .height;
    };
    const messageWidth = (() => {
      this.ctx.font = messageFont;
      return this.ctx.measureText(message).width;
    })();
    const messageHeight = (textBoxW, margin) => {
      this.ctx.font = messageFont;
      return measureTextWithinWidth(message, this.ctx, textBoxW - margin * 2)
        .height;
    };
    const completeTextWidth = (() => {
      return Math.max(headerWidth, messageWidth);
    })();
    const completeTextHeight = (textBoxW, margin) => {
      return (
        messageHeight(textBoxW, margin) +
        margin * 6 +
        headerHeight(textBoxW, margin)
      );
    };
    const margin = 10;
    const textBoxW = Math.min(completeTextWidth, 700);
    const textBoxH = completeTextHeight(textBoxW, margin);
    const textBoxX = (this.canvas.width - textBoxW) / 2;
    const textBoxY = (this.canvas.height - textBoxH) / 2;
    this.ctx.beginPath();
    this.ctx.roundRect(textBoxX, textBoxY, textBoxW, textBoxH, margin / 2);
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
    this.ctx.textBaseline = "top";
    this.ctx.font = headerFont;
    this.ctx.fillStyle = "white";
    fillTextWithinWidth(
      header,
      this.ctx,
      textBoxX + margin,
      textBoxY + margin,
      textBoxW - margin * 2
    );
    this.ctx.font = messageFont;
    fillTextWithinWidth(
      message,
      this.ctx,
      textBoxX + margin,
      textBoxY + margin + headerHeight(textBoxW, margin) + margin * 2,
      textBoxW - margin * 2
    );
  }
  showTransitionFX() {}
  startAnimation() {
    this.animationStarted = true;
    this.requestAnimationFrame();
  }
  stopAnimation() {
    cancelAnimationFrame(this.animationId);
  }
}

export default Game;
