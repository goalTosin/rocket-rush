class Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {() => void} pageExitCallback
   */
  constructor(canvas, pageExitCallback) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.scaleTime = 0;
    this.pageExitCallback = pageExitCallback;
  }
  /*
  createEvents() {}
  removeEvents() {}
  exit() {}
  update() {}
  */
}

export default Page