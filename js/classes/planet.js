import boxCircCollision from "../utils/boxCircCollision.js";
import boxCircCollisionResponse from "../utils/boxCircCollisionResponse.js";
import randomItem from "../utils/randomItem.js";
import Rocket from "./rocket.js";
import Sprite from "./sprite.js";

class Planet {
  constructor(x, y, imageUrl) {
    this.x = x;
    this.y = y;
    this.sprite = new Sprite(imageUrl);
    this.radius = Planet.r;
    this.athmosphereRadius = (this.radius * 1) / 5;
    this.name = randomItem(Planet.names);
    this.friction = 0.01;
    this.gravity = 0.2;
  }
  /**
   *
   * @param {Rocket} rocket
   */
  pullRocketToCenter(rocket) {
    const dx = this.x - rocket.x;
    const dy = this.y - rocket.y;
    const length = Math.hypot(dx, dy);
    const normalizedDX = dx / length;
    const normalizedDY = dy / length;
    const force = rocket.mass * this.gravity;
    let vx = normalizedDX * force;
    let vy = normalizedDY * force;
    if (
      !this.collidesWithRocket({
        ...rocket,
        x: rocket.x,
        y: rocket.y,
      })
    ) {
      if (
        !this.collidesWithRocket({
          ...rocket,
          x: rocket.x + vx,
          y: rocket.y + vy,
        })
      ) {
        rocket.vx += vx;
        rocket.vy += vy;
      }
    } else {
      const fp = boxCircCollisionResponse(
        {
          x: this.x,
          y: this.y,
          r: this.radius,
        },
        {
          x: rocket.x,
          y: rocket.y,
          h: rocket.height,
          w: rocket.width,
          r: rocket.rotation,
        }
      );
      rocket.x = fp.x;
      rocket.y = fp.y;

      const angle = Math.atan2(rocket.y - this.y, rocket.x - this.x);
      rocket.rotation = angle + Math.PI / 2;
      // this.attachRocket(rocket);
      rocket.vx *= 1 - this.friction;
      rocket.vy *= 1 - this.friction;
    }
  }

  isRocketApproaching(rocket) {
    let dist2Rocket = Math.hypot(rocket.x - this.x, rocket.y - this.y);
    return dist2Rocket <= this.radius + this.athmosphereRadius;
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.sprite.loaded) {
      // let w = this.sprite.width;
      let ww = this.radius * 2;
      // let h = this.sprite.height;
      let wh = this.radius * 2;
      ctx.drawImage(this.sprite, -ww / 2, -wh / 2, ww, wh);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "brown";
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + this.athmosphereRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0000ff0f";
    ctx.fill();
    ctx.restore();
  }
  attachRocket(rocket, zeroVel) {
    const angle = Math.atan2(rocket.y - this.y, rocket.x - this.x);
    rocket.rotation = angle + Math.PI / 2;
    rocket.x =
      this.x +
      Math.cos(angle) * this.radius +
      (Math.cos(rocket.rotation - Math.PI / 2) * rocket.height) / 2;
    rocket.y =
      this.y +
      Math.sin(angle) * this.radius +
      (Math.sin(rocket.rotation - Math.PI / 2) * rocket.height) / 2;
    if (zeroVel) {
      rocket.vx = 0;
      rocket.vy = 0;
      rocket.thrusting = false;
    }
  }
  /**
   *
   * @param {Rocket} rocket
   */
  collidesWithRocket(rocket) {
    return boxCircCollision(
      {
        x: this.x,
        y: this.y,
        r: this.radius,
      },
      {
        x: rocket.x,
        y: rocket.y,
        w: rocket.width,
        h: rocket.height,
        r: rocket.rotation,
      }
    );
  }
}

Planet.r = 10000;
Planet.names = [
  "Aetheris",
  "Aldorion",
  "Arcantis",
  "Arctalon",
  "Calyxis",
  "Celestara",
  "Cryphos",
  "Crystallis",
  "Drakonis",
  "Eryndor",
  "Etheron",
  "Galderon",
  "Halcyon V",
  "Klyvora",
  "Krysalon",
  "Luxoria",
  "Lytheron",
  "Myxalis",
  "Nexalia",
  "Nymoria",
  "Nyxara",
  "Polara",
  "Pyronis",
  "Qilara",
  "Seraphex",
  "Solara Prime",
  "Syntheris",
  "Thaloria",
  "Thryndor",
  "Umbrelis",
  "Vesperis",
  "Virexia",
  "Volturna",
  "Vorazis",
  "Vortis Prime",
  "Xandora",
  "Ythoria",
  "Zentaros",
  "Zephyria",
  "Zorynthia",
];
export default Planet;
