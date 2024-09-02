import Sprites from "../sprites.js";
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
    this.sprite.addEventListener("load", () => {
      let scale = this.width / this.sprite.width;
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
      this.vx *= 0.99;
      this.vy *= 0.99;
    }
  }
  get isTooFast() {
    return this.speed > this.maxSpeed;
  }
  move(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (!this.thrusting) {
      this.vx *= 0.999;
      this.vy *= 0.999;
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
    let fx = this.x + (Math.cos(this.rotation + Math.PI / 2) * this.height *3/5) / 2,
      fy = this.y + (Math.sin(this.rotation + Math.PI / 2) * this.height*3/5 ) / 2;
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
        this.x + (Math.cos(this.rotation + Math.PI / 2) * this.height*4/5) / 2;
      let fy =
        this.y + (Math.sin(this.rotation + Math.PI / 2) * this.height*4/5) / 2;

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
        Math.max(10),
        {
          dx: () => Math.cos(randAngle()) * rrand(1), //(Math.cos(this.rotation - Math.PI / 2) * 20) / 2,
          dy: () => Math.sin(randAngle()) * rrand(1), //(Math.sin(this.rotation - Math.PI / 2) * 20) / 2,
        },
        Math.max(60, this.speed / 2)
      );
      this.fuel -= 0.0001;
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
    const easeOut = (n) => n ** 2;
    const detailsContainerHeight = 160;
    const margin = 20;

    // ctx.save();
    // ctx.fillStyle = "hsl(240, 50%, 10%)";
    // ctx.fillRect(0, 0, ctx.canvas.width, detailsContainerHeight);
    ctx.fillStyle = "none";

    const fuelContainerRadius = (detailsContainerHeight - margin * 2) / 2;
    const fuelAngle = -easeOut(this.fuel) * Math.PI + Math.PI / 2;
    const fuelContainerX = fuelContainerRadius;
    const fuelContainerY = fuelContainerRadius + margin;
    ctx.save();
    ctx.translate(fuelContainerX, detailsContainerHeight / 2);
    ctx.scale(1.5, 1.5);
    ctx.translate(-35, -12);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    ctx.stroke(
      new Path2D(
        "M4 5C4 4.44772 4.44772 4 5 4H12C12.5523 4 13 4.44772 13 5V21H4V5ZM13 11.5H18V19C18 20.1046 18.8954 21 20 21V21C21.1046 21 22 20.1046 22 19V9M17.5 2L20.5 4.66667M20.5 4.66667L22 6V9M20.5 4.66667V9H22M15 21L2 21M10 8L7 8"
      )
    );
    ctx.restore();
    ctx.beginPath();
    ctx.arc(
      fuelContainerX,
      fuelContainerY,
      fuelContainerRadius,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.translate(fuelContainerX, fuelContainerY);
    ctx.rotate(fuelAngle);
    const dotRadius = fuelContainerRadius / 10;
    ctx.beginPath();
    ctx.arc(0, 0, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    const pointerHeight = fuelContainerRadius / 2;
    ctx.moveTo(0, dotRadius / 2);
    ctx.lineTo(0, -dotRadius / 2);
    ctx.lineTo(pointerHeight, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.moveTo(fuelContainerX, fuelContainerY);
    ctx.lineTo(
      fuelContainerX + (Math.cos(fuelAngle) * fuelContainerRadius) / 3,
      fuelContainerY + (Math.sin(fuelAngle) * fuelContainerRadius) / 3
    );
    ctx.beginPath();
    ctx.arc(
      fuelContainerX,
      fuelContainerY,
      fuelContainerRadius,
      fuelAngle,
      Math.PI / 2
    );
    ctx.lineWidth = 4;
    const breakage = 255 / 4;
    const colorLevel =
      Math.round((easeOut(this.fuel) * 255) / breakage) * breakage;
    ctx.strokeStyle = `#${toHexString(255 - colorLevel, 2)}${toHexString(
      colorLevel,
      2
    )}00`;
    ctx.stroke();

    ctx.font = Math.max(15) + 'px "Ubuntu Sans Mono"';
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "F",
      fuelContainerX + Math.cos(-Math.PI / 2) * fuelContainerRadius - 12.5,
      fuelContainerY + Math.sin(-Math.PI / 2) * fuelContainerRadius
    );
    ctx.fillText(
      "E",
      fuelContainerX + Math.cos(Math.PI / 2) * fuelContainerRadius - 12.5,
      fuelContainerY + Math.sin(Math.PI / 2) * fuelContainerRadius
    );
    const fuelContainerRuleSegments = 8;
    const fuelContainerRuleHeight = fuelContainerRadius / 4;
    const fuelContainerComputedInnerRadius =
      fuelContainerRadius - fuelContainerRuleHeight / 2;
    const fuelContainerComputedOuterRadius =
      fuelContainerRadius + fuelContainerRuleHeight / 2;
    for (let i = 0; i <= fuelContainerRuleSegments; i++) {
      ctx.beginPath();
      const cos = Math.cos(
        (Math.PI / fuelContainerRuleSegments) * i - Math.PI / 2
      );
      const sin = Math.sin(
        (Math.PI / fuelContainerRuleSegments) * i - Math.PI / 2
      );
      const x = fuelContainerX;
      const y = fuelContainerY;
      ctx.moveTo(
        x + cos * fuelContainerComputedInnerRadius,
        y + sin * fuelContainerComputedInnerRadius
      );
      ctx.lineTo(
        x + cos * fuelContainerComputedOuterRadius,
        y + sin * fuelContainerComputedOuterRadius
      );
      ctx.lineWidth = i % 2 === 0 ? 3 : 1;
      ctx.strokeStyle = "white";

      ctx.stroke();
    }

    const speedContainerRadius = fuelContainerRadius;
    const speedContainerAngle = Math.PI + Math.PI / 4;
    const speedContainerAngleStart = -Math.PI / 2 - speedContainerAngle / 2;
    const speedContainerAngleEnd = -Math.PI / 2 + speedContainerAngle / 2;
    const speedContainerX = ctx.canvas.width - speedContainerRadius - margin;
    const speedContainerY = speedContainerRadius + margin;
    const speedAngle =
      speedContainerAngleStart +
      (this.speed / this.maxSpeed) * speedContainerAngle;

    ctx.beginPath();
    ctx.arc(
      speedContainerX,
      speedContainerY,
      speedContainerRadius,
      speedContainerAngleStart,
      speedContainerAngleEnd
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      speedContainerX,
      speedContainerY,
      speedContainerRadius,
      speedContainerAngleStart,
      speedAngle
    );
    ctx.lineWidth = 4;
    ctx.strokeStyle = "blue";
    ctx.stroke();

    const speedContainerRuleSegments = 8;
    const speedContainerRuleHeight = fuelContainerRadius / 4;
    const speedContainerComputedInnerRadius =
      fuelContainerRadius - speedContainerRuleHeight / 2;
    const speedContainerComputedOuterRadius =
      fuelContainerRadius + speedContainerRuleHeight / 2;
    for (let i = 0; i <= speedContainerRuleSegments; i++) {
      ctx.beginPath();
      const cos = Math.cos(
        speedContainerAngleStart +
          (speedContainerAngle / speedContainerRuleSegments) * i
      );
      const sin = Math.sin(
        speedContainerAngleStart +
          (speedContainerAngle / speedContainerRuleSegments) * i
      );
      const x = speedContainerX;
      const y = speedContainerY;
      ctx.moveTo(
        x + cos * speedContainerComputedInnerRadius,
        y + sin * speedContainerComputedInnerRadius
      );
      ctx.lineTo(
        x + cos * speedContainerComputedOuterRadius,
        y + sin * speedContainerComputedOuterRadius
      );
      ctx.lineWidth = i % 2 === 0 ? 3 : 1;
      ctx.strokeStyle = "white";

      ctx.stroke();
    }

    ctx.save();
    ctx.translate(speedContainerX, speedContainerY);
    ctx.rotate(speedAngle);
    const speedDotRadius = fuelContainerRadius / 10;
    ctx.beginPath();
    ctx.arc(0, 0, speedDotRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    const speedPointerHeight = fuelContainerRadius / 2;
    ctx.moveTo(0, speedDotRadius / 2);
    ctx.lineTo(0, -speedDotRadius / 2);
    ctx.lineTo(speedPointerHeight, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const textFontSize = Math.max(15);
    const text =
      (this.speed >= 1
        ? Math.round(this.speed)
        : Number(this.speed.toPrecision(1)).toLocaleString()) + "km/h";
    ctx.font = textFontSize + 'px "Ubuntu Sans Mono"';
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText(text, speedContainerX, speedContainerY + textFontSize);

    // ctx.textAlign = "start";
    // ctx.textBaseline = "middle";
    // ctx.fillStyle = "white";
    // ctx.font =
    //   detailsContainerHeight -
    //   detailsContainerPadding * 2 +
    //   'px "Ubuntu Sans Mono"';
    // const ft = "Fuel";
    // const ftW = ctx.measureText(ft).width;
    // ctx.fillText(ft, detailsContainerPadding, detailsContainerHeight / 2);

    // const fuelContainerWidth = 60;
    // const fuelContainerHeight = (fuelContainerWidth * 1) / 4;
    // const fuelContainerX = detailsContainerPadding * 2 + ftW;
    // const fuelContainerY = (detailsContainerHeight - fuelContainerHeight) / 2;
    // const fuelWidth = easeOut(this.fuel) * fuelContainerWidth; // easeOut to make fuel look like its about to finish when its not
    // ctx.beginPath()
    // ctx.rect(
    //   fuelContainerX,
    //   fuelContainerY,
    //   fuelContainerWidth,
    //   fuelContainerHeight
    // );
    // ctx.fillStyle = "hsl(0, 0%, 90%)";
    // ctx.fill()
    // ctx.strokeStyle = 'black'
    // ctx.stroke()
    // const breakage = 255 / 5;
    // const colorLevel =
    //   Math.ceil((easeOut(this.fuel) * 255) / breakage) * breakage;
    // ctx.fillStyle = `#${toHexString(255 - colorLevel, 2)}${toHexString(
    //   colorLevel,
    //   2
    // )}00`;
    // ctx.fillRect(
    //   fuelContainerX,
    //   fuelContainerY,
    //   fuelWidth,
    //   fuelContainerHeight
    // );
    // let fuelWidth = easeOut(this.fuel) * this.fuel * fuelContainerWidth;

    // const textPadding = 10;

    // let textHeight = 30;
    // const text =
    //   (this.speed >= 1
    //     ? Math.round(this.speed)
    //     : Number(this.speed.toPrecision(1)).toLocaleString()) + "km/h";
    // ctx.textBaseline = "top";
    // ctx.fillStyle = "blue";
    // ctx.fillText(text, fuelHeight + textPadding, 0);
    // let y = textHeight / 2 - fuelContainerWidth / 2;
    // ctx.fillStyle = "#f0f0f0";
    // ctx.fillRect(0, y, fuelHeight, fuelContainerWidth);
    // let breakage = 255 / 5;
    // let colorLevel =
    //   Math.floor((easeOut(this.fuel) * 255) / breakage) * breakage;
    // ctx.fillStyle = `#${toHexString(255 - colorLevel, 2)}${toHexString(
    //   colorLevel,
    //   2
    // )}00`;
    // // console.log(easeOut(this.fuel), this.fuel);
    // ctx.fillRect(
    //   0, // -ow / 2,
    //   fuelContainerWidth - fuelWidth + y, // oh - h - oh / 2,
    //   fuelHeight,
    //   fuelWidth
    // );

    ctx.restore();
  }
}

export default Rocket;
