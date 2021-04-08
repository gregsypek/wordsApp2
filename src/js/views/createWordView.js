//.js is optional
import View from './View.js';
import icons from '../../img/icons.svg';

class CreateWordView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-word-window');
  _overlay = document.querySelector('.overlay2');
  _btnOpen = document.querySelector('.nav__btn--add-word');
  _btnClose = document.querySelector('.btn--close-modal2');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {
    return `
     
    `;
  }
}

export default new CreateWordView();
