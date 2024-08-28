import { fillTextWithinWidth } from "../utils/fitTextInBound.js";
import secludedDraw from "../utils/secludedDraw.js";
import Page from "./page.js";

class StoryPage extends Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(page) => void} pageExitCallback
   */
  constructor(canvas, exitToPage) {
    super(canvas, exitToPage);
    this.displayTextTimeStart = null;
    this.displayTextTime = 4000;
    this.displayText = "";
    this.currentTextId = 0;
    this.currentTextCharId = 0;
    this.writeSpeed = 0.4;
    this.wordReadTime = 300;
    this.texts = [
      "It is a distant dystopian future.",
      "Earth is a sick and an inhabitable planet now.",
      "People had to move out of the earth to live in space.",
      "They built colonies on other planets.",
      "They are thriving on those extraterrestrial habitats.",
      "The central space station is experiencing a crisis.",
      "It is the station where most people live.",
      "It is losing power fast.",
      "You are a new space pilot.",
      "You have to save the space station.",
      "Find special rocks to give it power.",
      "It is up to you, the galaxy's last hope.",
      "You must navigate hazardous asteroid fields.",
      "You must avoid cosmic commotion.",
      "You must outwit nefarious rivals.",
      "Can you assume the mantle of galactic hero and avert catastrophe?",
      "Can you save this space station from this cataclysmic distress?",
      "Can you be a hero?",
    ];
    this.handleKeydownHandler = this.handleKeydown.bind(this)
    // this.currentTextId = this.getLongestTextIndex()
    // this.currentTextId = this.getTextIndexWithLongestWord();
  }
  handleKeydown(e) {
    if (e.key === "Enter") {
      if (this.currentTextCharId < this.texts[this.currentTextId].length) {
        this.currentTextCharId = this.texts[this.currentTextId].length;
      } else {
        this.nextText();
      }
      // this.exit();
    }
  }
  exit() {
    this.exitToPage("play");
  }
  createEvents() {
    addEventListener("keydown", this.handleKeydownHandler);
  }
  removeEvents() {
    removeEventListener("keydown", this.handleKeydownHandler);
  }
  // getLongestTextIndex() {
  //   return this.texts.findIndex(
  //     (v) =>
  //       v === this.texts.reduce((t1, t2) => (t1.length > t2.length ? t1 : t2))
  //   );
  // }
  // getTextIndexWithLongestWord() {
  //   function getLongestWordLength(words) {
  //     return words
  //       .split(" ")
  //       .reduce((word, word2) => (word.length > word2.length ? word : word2))
  //       .length;
  //   }
  //   return this.texts.findIndex(
  //     (v) =>
  //       v ===
  //       this.texts.reduce((text, text2, i) =>
  //         getLongestWordLength(text) > getLongestWordLength(text2)
  //           ? text
  //           : text2
  //       )
  //   );
  // }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  update(dt) {
    secludedDraw(this.ctx, () => {
      this.ctx.textBaseline = "top";
      this.ctx.textAlign = "start";
      const w = Math.min(1000, (this.canvas.width * 4) / 5);
      const h = Math.min(550, (this.canvas.height * 4) / 5);
      const x = (this.canvas.width - w) / 2;
      const y = this.canvas.height - h;
      secludedDraw(this.ctx, () => {
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, 10);
        this.ctx.fillStyle = "hsl(240, 100%, 50%)";
        this.ctx.fill();
        this.ctx.strokeStyle = "hsl(0, 0%, 100%)";
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
      });
      const text =
        this.texts[this.currentTextId]
          .toUpperCase()
          .substring(0, Math.floor(this.currentTextCharId)) + "";
      const margin = Math.min(30, this.canvas.width / 46);
      this.ctx.textBaseline = "top";
      this.ctx.font =
        Math.min(100, this.canvas.width / 13, this.canvas.height / 6) +
        'px "Ubuntu Sans Mono", system-ui';
      secludedDraw(this.ctx, () => {
        this.ctx.fillStyle = "white";
        fillTextWithinWidth(
          text,
          this.ctx,
          x + margin,
          y + margin,
          w - margin * 2
        );
      });
      if (this.currentTextCharId < this.texts[this.currentTextId].length) {
        if (this.texts[this.currentTextId][this.currentTextCharId] === " ") {
          this.currentTextCharId += 1;
        }
        this.currentTextCharId += this.writeSpeed * dt;
      } else if (this.displayTextTimeStart === null) {
        this.displayTextTimeStart = Date.now();
      }
      if (
        this.displayTextTimeStart !== null &&
        Date.now() - this.displayTextTimeStart >
          this.texts[this.currentTextId].split(" ").length * this.wordReadTime
      ) {
        this.nextText();
      }
    });
  }
  nextText() {
    if (this.currentTextId + 1 < this.texts.length) {
      this.displayTextTimeStart = null;
      this.currentTextId += 1;
      this.currentTextCharId = 0;
    } else {
      this.exit();
    }
  }
}

export default StoryPage;
