import Sprite from "./classes/sprite.js";

const Sprites = {
  rocket: new Sprite("assets/images/rocket.svg"),
  hasLoadedAll() {
    for (const spriteName in Sprites) {
      if (Object.hasOwnProperty.call(Sprites, spriteName)) {
        /**
         * @type {Sprite}
         */
        const sprite = Sprites[spriteName];
        if (typeof sprite !== "function") {
          if (!sprite.loaded) {
            return false;
          }
        }
      }
    }
    return true;
  },
};

export default Sprites;
