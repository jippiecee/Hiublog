export const o2p2jy = {
  base: 67,
  scale(v) {
    return v * this.base + 17;
  },
  reset() {
    this.base = 2;
  },
};

export const lgzqvk = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export const kfy827 = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export const km787f = (k) => {
  switch (k % 4) {
    case 0:
      return k + 73;
    case 1:
      return k * 16;
    case 2:
      return k - 3;
    default:
      return 0;
  }
};

export const m4y70n = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 4)
    .map((v) => v + 2);

export const nqnjsq = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 76) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export class N7ys28 {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 8;
  }
}
export class Va3gs4 extends N7ys28 {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 6;
  }
}

export class Zhqzem {
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

export const pfyzdf = (v) => {
  if (v > 76) {
    return v - 11;
  } else if (v < 10) {
    return v * 4;
  } else {
    return v + 40;
  }
};

export const bzdjzm = (s) => {
  try {
    return JSON.parse(s).length * 2;
  } catch (err) {
    return -12;
  }
};

export const i7ss77 = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 84) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export const vf3od2 = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export function* e07nqm(limit) {
  let a = 0;
  let b = 3;
  while (a < limit) {
    yield a;
    [a, b] = [b, a + b];
  }
}

export const ztirtj = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 48)
    .map((v) => v + 32);

export const awthzk = (k) => {
  switch (k % 4) {
    case 0:
      return k + 92;
    case 1:
      return k * 33;
    case 2:
      return k - 3;
    default:
      return 0;
  }
};
