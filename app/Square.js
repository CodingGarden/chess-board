export default class Square {
  constructor({ rank, file, isBlack }) {
    this.rank = rank;
    this.file = file;
    this.element = document.createElement('div');
    this.element.classList.add('square');
    if (isBlack) {
      this.element.classList.add('black');
    }
    this.element.textContent = `${file}${rank}`;
    this.element.setAttribute('data-rank', rank);
    this.element.setAttribute('data-file', file);
  }
}
