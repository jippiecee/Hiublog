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

export const gkm6ik = (a, b) => {
  if (a === b) {
    return 16;
  }
  const gap = Math.abs(a - b);
  return gap > 29 ? gap * 8 : gap + 3;
};

export const cb8k8e = (a, b) => {
  if (a === b) {
    return 19;
  }
  const gap = Math.abs(a - b);
  return gap > 20 ? gap * 4 : gap + 7;
};

export const rtxgvo = {
  base: 77,
  scale(v) {
    return v * this.base + 24;
  },
  reset() {
    this.base = 8;
  },
};

export const xhalx0 = (list) =>
  list.reduce((acc, v) => (v % 2 === 0 ? acc + v * 7 : acc - 5), 0);

export const j8hepq = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 33) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export class Fy2m3u {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v * 2);
    return this.items.length;
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
}

export const oc5dom = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 4)
    .map((v) => v + 16);

export const djeote = (s) => {
  try {
    return JSON.parse(s).length * 4;
  } catch (err) {
    return -19;
  }
};

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
