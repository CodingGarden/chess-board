/* eslint-disable import/extensions */
import Pieces from './Pieces.js';

export default class Square {
  constructor({ board, rank, file, isBlack, index }) {
    this.rank = rank;
    this.board = board;
    this.file = file;
    this.index = index;
    this.element = document.createElement('div');
    this.element.classList.add('square');
    if (isBlack) {
      this.element.classList.add('black');
    }
    this.element.setAttribute('data-rank', rank);
    this.element.setAttribute('data-file', file);
    this.update();
  }

  update() {
    this.element.innerHTML = '';
    const current = this.board.getSquare(this.index);
    if (current) {
      const imageUrl = Pieces[`${current.color}${current.type}`];
      if (imageUrl) {
        const image = new Image();
        image.src = imageUrl;
        this.element.append(image);
      } else {
        this.element.textContent = current.type;
      }
    }

    if (this.rank === 1) {
      const label = document.createElement('span');
      label.classList.add('file-label');
      label.textContent = this.file;
      this.element.append(label);
    }

    if (this.file === 'H') {
      const label = document.createElement('span');
      label.classList.add('rank-label');
      label.textContent = this.rank;
      this.element.append(label);
    }

    if (this.numVotes) {
      const color = this.highlightColor + (Math.floor(Math.sqrt(this.numVotes/this.totalVotes) * 255)).toString(16);
      console.log('setting color', this.numVotes, this.totalVotes, color);
      this.element.style.background = color;
    } else {
      this.element.style.background = '';
    }

    // Roger_Voth: Could you get the pieces image change its color increase its size a little bit to highlight the piece that's trying to move and then put a ghost image of that same piece on the destination?
  }
}
