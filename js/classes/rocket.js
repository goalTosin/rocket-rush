import Sprites from "../sprites.js";
import easeOut from "../utils/easeout.js";
import randAngle from "../utils/randAngle.js";
import randomItem from "../utils/randomItem.js";
import rrand from "../utils/rrand.js";
import toHexString from "../utils/toHexString.js";
import Smoke from "./smoke.js";

class Rocket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.sprite = Sprites.rocket;
    let scale = 0.1;
    this.sprite.addEventListener("load", () => {
      this.width = this.sprite.width * scale;
      this.height = this.sprite.height * scale;
    });
    this.width = 60.8;
    this.height = 106.4;
    this.rotation = -Math.PI / 2;
    this.thrustSpeed = 0.2;
    this.fuel = 1;
    this.turnSpeed = (Math.PI / 180) * 4;
    this.thrusting = false;
    // this.fire = new Smoke("rgb(219 40 40 / 63%)", 4, 10);
    this.smoke = new Smoke("#c8c8c8", 10, 1000);
    this.fuelFinishedAware = false;
    this.maxSpeed = 225;
    this.mass = 0.8;
  }
  thrust(dt) {
    const angle = this.rotation - Math.PI / 2;
    const dist = this.thrustSpeed * dt;
    this.vx += Math.cos(angle) * dist;
    this.vy += Math.sin(angle) * dist;
    if (this.isTooFast) {
      this.vx *= 0.99
      this.vy *= 0.99
    }
 }
  get isTooFast() {
    return this.speed > this.maxSpeed;
  }
  move(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (!this.thrusting) {
      this.vx *= 0.995;
      this.vy *= 0.995;
    }
  }
  turnLeft(dt) {
    this.rotation -= this.turnSpeed * dt;
  }
  turnRight(dt) {
    this.rotation += this.turnSpeed * dt;
  }
  get speed() {
    return Math.hypot(this.vx, this.vy) * 10;
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawFire(ctx) {
    const circ = (x, y) => {
      // ctx.save();
      // ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      let p = toHexString(rrand(0xffac3d, 0xffcc4d), 6);
      ctx.fillStyle =
        "#" + randomItem([p, "faf080", "ff0000"]) + toHexString(60);
      // ctx.fillStyle = "#ffac3d";
      ctx.fill();
      // ctx.restore();
    };
    let fx = this.x + (Math.cos(this.rotation + Math.PI / 2) * this.height) / 2,
      fy = this.y + (Math.sin(this.rotation + Math.PI / 2) * this.height) / 2;
    for (let i = 0; i < 10; i++) {
      circ(
        Math.cos(randAngle()) * rrand(6) + fx,
        Math.sin(randAngle()) * rrand(6) + fy
      );
    }
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx, dt, direction, dist) {
    if (this.thrusting && this.fuel > 0) {
      let fx =
        this.x + (Math.cos(this.rotation + Math.PI / 2) * this.height) / 2;
      let fy =
        this.y + (Math.sin(this.rotation + Math.PI / 2) * this.height) / 2;

      // this.fire.update(ctx, dt)
      // this.fire.shoot(
      //   this.x + Math.cos(this.rotation) * -this.height/ 2,
      //   this.y + Math.sin(this.rotation) * -this.height/ 2,
      //   4,
      //   0,
      //   -10,100
      // );
      this.smoke.shoot(
        fx + Math.cos(this.rotation + Math.PI / 2) * 15,
        fy + Math.sin(this.rotation + Math.PI / 2) * 15,
        Math.max(30),
        {
          dx: () => Math.cos(randAngle()) * rrand(1), //(Math.cos(this.rotation - Math.PI / 2) * 20) / 2,
          dy: () => Math.sin(randAngle()) * rrand(1), //(Math.sin(this.rotation - Math.PI / 2) * 20) / 2,
        },
        Math.max(60, this.speed / 2)
      );
      this.fuel -= 0.0002;
    }
    if (this.fuel <= 0 && !this.fuelFinishedAware && this.thrusting) {
      alert(
        "Sorry, your fuel has finished and you cannot thrust yourself anymore"
      );
      this.fuelFinishedAware = true;
      setTimeout(() => (this.fuelFinishedAware = false), 3000);
      this.thrusting = false;
    }
    // ctx.save()
    this.smoke.update(ctx, dt);
    // for (let i = 0; i < 23023; i++) {
    //   let m = Math.sin(1234)
    //   let m2 = Math.sin(1234)
    //   let fd = Math.sin(1234)
    //   let asm2 = Math.sin(1234)
    //   let dm2 = Math.sin(1234)
    //   let fsdm2 = Math.sin(1234)
    //   let ms2 = Math.sin(1234)
    //   let md2 = Math.sin(1234)
    //   let mfas2 = Math.sin(1234)
    //   let mf2 = Math.sin(1234)
    //   let masd2 = Math.sin(1234)
    // }
    // ctx.restore()
    // if (Math.abs(this.x - ctx.canvas.width / 2) >= ctx.canvas.width / 2) {
    //   ctx.beginPath
    // }
    if (this.thrusting && this.fuel > 0) {
      this.drawFire(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.save();

    ctx.rotate(this.rotation);
    // ctx.scale()
    if (this.sprite.loaded) {
      // ctx.fillStyle = "green";
      // ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.drawImage(
        this.sprite,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    // console.log(this.thrusting);
    ctx.restore();
    if (dist > this.height) {
      ctx.beginPath();
      const r = this.height * 2;
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.beginPath();
      const pr = Math.max(this.height, Math.min(dist / 10, r));
      ctx.arc(
        Math.cos(direction) * pr,
        Math.sin(direction) * pr,
        4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "white";
      ctx.fill();
    }
    ctx.restore();
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawDashboard(ctx) {
    ctx.save();
    ctx.textAlign = 'start'
    // ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
    let fuelContainerHeight = 60;
    let fuelWidth = (fuelContainerHeight * 1) / 8;
    // easeOut to make fuel look like its about to finish when its not
    let fuelHeight = easeOut(this.fuel) * this.fuel * fuelContainerHeight;

    const textPadding = 10;

    let textHeight = 100;
    const text =
      (this.speed >= 1
        ? Math.round(this.speed)
        : Number(this.speed.toPrecision(1)).toLocaleString()) + "km/h";
    ctx.font = textHeight + 'px "Ubuntu Sans Mono"';
    ctx.textBaseline = "top";
    ctx.fillStyle = "blue";
    ctx.fillText(text, fuelWidth + textPadding, 0);
    let y = textHeight / 2 - fuelContainerHeight / 2;
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, y, fuelWidth, fuelContainerHeight);
    let breakage = 255 / 5;
    let colorLevel =
      Math.floor((easeOut(this.fuel) * 255) / breakage) * breakage;
    ctx.fillStyle = `#${toHexString(255 - colorLevel, 2)}${toHexString(
      colorLevel,
      2
    )}00`;
    // console.log(easeOut(this.fuel), this.fuel);
    ctx.fillRect(
      0, // -ow / 2,
      fuelContainerHeight - fuelHeight + y, // oh - h - oh / 2,
      fuelWidth,
      fuelHeight
    );

    ctx.restore();
  }
}

export default Rocket;
