/* eslint-disable import/extensions */
import { Chess } from 'https://cdn.skypack.dev/chess.js';
import Square from './Square.js';

const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const colors = [
  '#5d8aa8',
  '#f0f8ff',
  '#e32636',
  '#efdecd',
  '#e52b50',
  '#ffbf00',
  '#ff033e',
  '#9966cc',
  '#a4c639',
  '#f2f3f4',
  '#cd9575',
  '#915c83',
  '#faebd7',
  '#008000',
];

let moveColors = new Map();

export default class Board {
  constructor({ selector, size }) {
    this.size = size;
    this.cells = [];
    this.element = document.querySelector(selector);
    this.element.classList.add('board');
    this.init();
  }

  init() {
    this.socket = io('ws://localhost:4782', {
      transports: ['websocket'],
    });
    this.chess = new Chess();
    this.board = this.chess.board().flat();
    let currentMoves = '';
    this.socket.on('game-event', (event) => {
      if (event.type === 'bad-move') {
        moveColors = new Map();
        this.cells.forEach((cell) => {
          cell.highlightColor = undefined;
          cell.numVotes = undefined;
        });
        this.update();
      } else if (event.type === 'votes') {
        let totalVotes = 0;
        // eslint-disable-next-line no-return-assign
        event.choices.forEach(([, numVotes]) => totalVotes += numVotes);
        event.choices.forEach(([move, numVotes]) => {
          const [, from, to] = move.match(/([a-h][1-8])([a-h][1-8])/);
          if (!moveColors.get(move)) {
            moveColors.set(move, colors[Math.floor(Math.random() * colors.length)]);
          }
          const fromCell = this.cellsByLocation.get(from);
          fromCell.highlightColor = moveColors.get(move);
          fromCell.numVotes = numVotes;
          fromCell.totalVotes = totalVotes;
          const toCell = this.cellsByLocation.get(to);
          toCell.highlightColor = moveColors.get(move);
          toCell.numVotes = numVotes;
          toCell.totalVotes = totalVotes;
          console.log({ from, to, numVotes });
        });
        this.update();
      } else {
        console.log('event!', event);
        const moves = event.state.moves.replace(currentMoves, '').split(' ');
        currentMoves = event.state.moves;
        moves.forEach((move) => {
          this.chess.move(move, { sloppy: true });
        });
        moveColors = new Map();
        this.cells.forEach((cell) => {
          cell.highlightColor = undefined;
          cell.numVotes = undefined;
        });
        this.update();
      }
    });
    if (this.size) {
      this.element.style.width = this.size;
      this.element.style.height = this.size;
    } else {
      const size = '90vmin';
      this.element.style.width = size;
      this.element.style.height = size;
    }
    this.cellsByLocation = new Map();
    this.cells = Array.from({ length: 64 }, (_, index) => {
      const rank = 8 - Math.floor(index / 8);
      const fileNum = index % 8;
      const file = files[fileNum];
      const isBlack = !(rank % 2 === fileNum % 2);
      const cell = new Square({
        board: this,
        isBlack,
        rank,
        file,
        index,
      });
      this.cellsByLocation.set(`${file.toLowerCase()}${rank}`, cell);
      this.element.appendChild(cell.element);
      return cell;
    });
  }

  getSquare(index) {
    return this.board[index];
  }

  update() {
    this.board = this.chess.board().flat();
    this.cells.forEach((cell) => cell.update());
  }
}
