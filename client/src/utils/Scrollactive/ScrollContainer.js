export default class ScrollContainer {
  constructor(containerSelector) {
    let container = window;

    if (containerSelector) {
      container = document.querySelector(containerSelector) || window;
    }

    this.container = container;
    console.log(container.scroll);
  }

  addScrollListener(callback) {
    this.scrollListenerCallback = callback;
    this.container.addEventListener('scroll', callback);
    console.log(this.container.scroll);
  }

  removeScrollListener() {
    this.container.removeEventListener('scroll', this.scrollListenerCallback);
  }

  getDistanceFromTop() {
    return this.container.scrollTop || this.container.pageYOffset;
  }

  scrollTo(x, y) {
    return this.container.scrollTo(x, y);
  }

  getOffsetTop() {
    return this.container.offsetTop;
  }
}
