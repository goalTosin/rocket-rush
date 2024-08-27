class Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(page) => void} exitToPage
   */
  constructor(canvas, exitToPage) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.scaleTime = 0;
    this.exitToPage = exitToPage;
  }
  /*
  createEvents() {}
  removeEvents() {}
  exit() {}
  update() {}
  */
}

export default Page