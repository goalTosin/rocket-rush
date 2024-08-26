class Smoke {
  constructor(color = "red", size = 4, density = 100) {
    this.particles = [];
    this.size = size;
    this.color = color;
    this.density = density;
    // this.thickness = thickness
  }
  explode() {}
  shoot(x, y, r, { dx, dy }, n = 40) {
    let roundParticles = this.generateAround(x, y, r, n);

    roundParticles.forEach((rp) => {
      this.particles.push({
        ...rp,
        vx: dx(), // dx * Math.random()- dx / 2,
        vy: dy(),
      });
    });
  }
  generateAround(x, y, r, n) {
    const ps = [];
    const ra = () => Math.random() * Math.PI * 2;
    const rd = () => Math.random() * r;
    for (let i = 0; i < n; i++) {
      let a = ra()
      let d = rd()
      ps.push(
        this.createParticle(
          Math.cos(a) * d + x,
          Math.sin(a) * d + y
        )
      );
    }
    return ps;
  }
  update(ctx, dt) {
    let up = [];
    this.particles.forEach((p, i) => {
      // ctx.save();
      let s = 1 + ((Date.now() - p.birth) / this.density);
      // ctx.translate(p.x, p.y);
      // ctx.scale(s, s);
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.size * Math.max(0, s), 0, Math.PI * 2);
      let tr = (255 - Math.round(((Date.now() - p.birth) / this.density) * 225))
        .toString(16)
        .padStart(2, "0");
      ctx.fillStyle = p.color;
      ctx.fillStyle += tr;
      // if (i === 0) {
        // console.log(tr, ctx.fillStyle);
      // }
      ctx.fill();
      // ctx.restore();
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.99;
      p.vy *= 0.99;
      if (Date.now() - p.birth > this.density) {
        up.push(i);
      }
    });
    this.deleteParticles(up);
  }
  deleteParticles(ps) {
    ps.forEach((p) => {
      this.particles.splice(p, 1);
    });
  }
  createParticle(x, y, vx = 0, vy = 0) {
    return { x, y, vx, vy, color: this.color, birth: Date.now() };
  }
}

export default Smoke;
