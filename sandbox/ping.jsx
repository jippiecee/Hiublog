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
