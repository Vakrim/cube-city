export const screen = {
  width: window.innerWidth,
  height: window.innerHeight,
  get aspectRatio() {
    return this.width / this.height;
  },
};
