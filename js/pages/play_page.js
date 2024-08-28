import Planet from "../classes/planet.js";
import Rocket from "../classes/rocket.js";
import StarField from "../classes/starfield.js";
import lerp from "../utils/lerp.js";
import randomItem from "../utils/randomItem.js";
import rrand from "../utils/rrand.js";
import Page from "./page.js";

class PlayPage extends Page {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {(page) => void} pageExitCallback
   */
  constructor(canvas, exitToPage) {
    super(canvas, exitToPage);
    this.keysDown = {};
    this.camera = {
      x: 0,
      y: 0,
      rotation: 0,
      moveBy(x, y) {
        this.x += x;
        this.y += y;
      },
      moveTo(x, y) {
        this.x = x;
        this.y = y;
      },
    };
    this.started = true;
    this.init();
  }
  exit() {
    this.exitToPage("home");
  }
  onSizeChange() {}
  init() {
    this.rocket = new Rocket(
      0, // 7071
      0
      //  -7071
    );
    let n = 20;
    let originX = 0;
    let originY = 0;
    /**
     * @type {Planet[]}
     */
    this.planets = Array.from({ length: n }, (k, i) => {
      let a = (i / n) * Math.PI * 2;
      let d =
        //  rrand(
        90000;
      // );
      return new Planet(Math.cos(a) * d + originX, Math.sin(a) * d + originY);
    });
    let ri = Math.floor(Math.random(this.planets.length));
    this.launchOriginPlanet = this.planets[ri];
    this.launchOriginPlanet.attachRocket(this.rocket, true);
    this.fuelCanisters = Array.from({ length: 12 }, () => {
      return;
    });
    this.destinationPlanet = this.planets[ri + 1];
    //  randomItem(
    // this.planets.filter((k) => k !== this.launchOriginPlanet)
    // );

    this.starfield = new StarField(
      this.rocket.x,
      this.rocket.y,
      this.canvas.width,
      this.canvas.height
    );
    this.handleKeyupHandler = this.handleKeyup.bind(this);
    this.handleKeydownHandler = this.handleKeydown.bind(this);
    // for (let i = 0; i < 4; i++) {
    //   const planet = this.planets[i];

    // }
  }
  createEvents() {
    addEventListener("keydown", this.handleKeydownHandler);
    addEventListener("keyup", this.handleKeyupHandler);
  }
  removeEvents() {
    removeEventListener("keydown", this.handleKeydownHandler);
    removeEventListener("keyup", this.handleKeyupHandler);
  }
  handleKeydown(e) {
    this.handleKeyed(e);
    if (e.code === "KeyW" || e.key === " " || e.key === "ArrowUp") {
      this.rocket.thrusting = !this.rocket.thrusting;
    }
  }

  handleKeyup(e) {
    this.handleKeyed(e);
    // if (e.code === "KeyW" || e.key === " " || e.key === "ArrowUp") {
    //   this.rocket.thrusting = false;
    // }
  }

  handleKeyed(e) {
    this.keysDown[e.key] = e.type === "keydown";
    this.keysDown[e.code] = e.type === "keydown";
    // console.log(this.keysDown);
  }
  update(dt) {
    this.starfield.update(this.ctx, this.camera);
    if (this.started) {
      this.camera.x = this.rocket.x;
      this.camera.y = this.rocket.y;
      this.started = false;
    }
    this.ctx.save();
    this.ctx.translate(
      this.canvas.width / 2 - this.camera.x,
      this.canvas.height / 2 - this.camera.y
    );
    this.ctx.rotate(this.camera.rotation);
    // this.ctx.scale(0.3, 0.3);
    // console.log();
    if (this.rocket.thrusting && this.rocket.fuel > 0) {
      this.rocket.thrust(dt);
    }
    if (this.keysDown["KeyD"] || this.keysDown["ArrowRight"]) {
      this.rocket.turnRight(dt);
    }
    if (this.keysDown["KeyA"] || this.keysDown["ArrowLeft"]) {
      this.rocket.turnLeft(dt);
    }
    // this.drawStars();
    this.planets.forEach((p) => p.draw(this.ctx));
    this.rocket.move(dt);
    this.rocket.draw(
      this.ctx,
      dt,
      Math.atan2(
        this.destinationPlanet.y - this.rocket.y,
        this.destinationPlanet.x - this.rocket.x
      ),
      Math.hypot(
        this.destinationPlanet.x - this.rocket.x,
        this.destinationPlanet.y - this.rocket.y
      )
    );

    // if (this.rocket.x + this.rocket.width / 2 >= this.canvas.width / 2) {
    //   this.rocket.x = this.canvas.width / 2 - this.rocket.width / 2;
    //   this.rocket.vx = 0;
    // }
    // if (this.rocket.x - this.rocket.width / 2 <= -this.canvas.width / 2) {
    //   this.rocket.x = -this.canvas.width / 2 + this.rocket.width / 2;
    //   this.rocket.vx = 0;
    // }
    // if (this.rocket.y + this.rocket.height / 2 >= this.canvas.height / 2) {
    //   this.rocket.y = this.canvas.height / 2 - this.rocket.height / 2;
    //   this.rocket.vy = 0;
    // }
    // if (this.rocket.y - this.rocket.height / 2 <= -this.canvas.height / 2) {
    //   this.rocket.y = -this.canvas.height / 2 + this.rocket.height / 2;
    //   this.rocket.vy = 0;
    // }
    // let ocX = this.camera.x;
    // let ocY = this.camera.y;
    // this.rocketY
    // this.camera.x = this.rocket.x;
    // this.camera.y = this.rocket.y;
    let factor = 0.1;
    let throwFactor = 20;
    // let throwFactor = 1 / (factor * 0.6); // * Math.min(this.canvas.width, this.canvas.height) / 600
    this.camera.x = lerp(
      this.camera.x,
      this.rocket.x + this.rocket.vx * throwFactor,
      factor
    );
    this.camera.y = lerp(
      this.camera.y,
      this.rocket.y + this.rocket.vy * throwFactor,
      factor
    );
    // this.camera.rotation =
    // lerp(
    // this.camera.rotation,
    // this.rocket.rotation,
    // 0.1
    // )
    // this.camera = oc

    // if (this.rocket.x - this.rocket.width / 2 <= -this.canvas.width / 2) {
    //   this.rocket.y = this.rocket.width / 2;
    // }

    // if (this.rocket.y + this.rocket.height / 2 > this.canvas.height / 2) {
    //   this.rocket.y = this.canvas.height - this.rocket.height / 2;
    // }
    // if (this.rocket.y - this.rocket.height / 2 <= -this.canvas.height / 2) {
    //   this.rocket.y = this.rocket.height / 2 -this.canvas.height / 2;

    // }
    this.pullRocketToPlanets();
    this.ctx.restore();
    this.rocket.drawDashboard(this.ctx);
  }
  // createStar(x, y, vx, vy) {
  //   return { x, y, vx, vy };
  // }
  // drawStars() {
  //   for (let i = 0; i < this.stars.length; i++) {
  //     const s = this.stars[i];
  //     this.ctx.beginPath();
  //     this.ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
  //     this.ctx.fillStyle = "white";
  //     this.ctx.fill();
  //   }
  // }

  // create a method that loops over all the planets and if the rocket is in range of the planet pull the rocket towards the planet
  pullRocketToPlanets() {
    for (let i = 0; i < this.planets.length; i++) {
      const planet = this.planets[i];
      if (planet.isRocketApproaching(this.rocket)) {
        planet.pullRocketToCenter(this.rocket);
      }
    }
  }
}

export default PlayPage;
