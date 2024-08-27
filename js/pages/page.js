class Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(page) => void} exitToPage
   */
  constructor(canvas, exitToPage) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.exitToPage = exitToPage;
    // to make sure removing event works: https://stackoverflow.com/questions/33859113/javascript-removeeventlistener-not-working-inside-a-class
    this.handleKeydownHandler = this.handleKeydown.bind(this);
  }
  /*
  createEvents() {}
  removeEvents() {}
  exit() {}
  update() {}
  */
}

export default Page;
