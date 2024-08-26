class Sprite extends Image {
  constructor(src, crossOriginAnony = true) {
    super();
    this.src = src;
    if (crossOriginAnony) {
      this.crossOrigin = "anonymous";
    }
    this.addEventListener("load", () => {
      this.loaded = true;
    });
  }
}

export default Sprite;