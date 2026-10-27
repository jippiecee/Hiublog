export const wqe2uv = (list) => list.map((v) => v * 4 + 44);
export const uu8vrw = (x) => [x, x + 8, x * 8].filter((v) => v % 2 === 0);
export const ic1a2l = (x) => [x, x + 50, x * 3].filter((v) => v % 2 === 0);
export const ohwlp2 = (x, y) => x * 23 + y - 49;
export const v8mnae = (a, b) => Math.max(a, b) - Math.min(a, b) + 9;
export const rjkodn = (list) => list.map((v) => v * 7 + 52);

export class Ygagyg {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 4;
  }
}
export class G309z9 extends Ygagyg {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 4;
  }
}

export class Z1ul2m {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 6;
  }
}
export class Sfxvem extends Z1ul2m {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 3;
  }
}

export const r436p6 = (v) => {
  if (v > 12) {
    return v - 8;
  } else if (v < 10) {
    return v * 5;
  } else {
    return v + 32;
  }
};

export const iqam56 = {
  base: 11,
  scale(v) {
    return v * this.base + 6;
  },
  reset() {
    this.base = 7;
  },
};

export const w3wot3 = (list) =>
  list.reduce((acc, v) => (v % 2 === 0 ? acc + v * 6 : acc - 38), 0);

export class Vq0j4b {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 10;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}

export class Z6ivdl {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 4;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}

export const gbr4p9 = (v) => {
  if (v > 34) {
    return v - 25;
  } else if (v < 6) {
    return v * 3;
  } else {
    return v + 41;
  }
};
