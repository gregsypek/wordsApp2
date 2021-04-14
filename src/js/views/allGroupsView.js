//.js is optional
import View from './View.js';
import icons from '../../img/icons.svg';

class AllGroupsView extends View {
  _parentElement = document.querySelector('.groups');
  _window = document.querySelector('.groups-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--bookmarks');
  _btnClose = document.querySelector('.btn--close-modal');
  _linkPreview = document.querySelector('.preview__link');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  addHandleClick(handler) {
    this._btnOpen.addEventListener('click', function () {
      handler();
    });
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerPreview() {
    // this.toggleWindow();
    this._overlay.classList.add('hidden');
    console.log('click');
    this._window.classList.add('hidden');
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    console.log('click');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));

    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _generateMarkup() {
    console.log(this._data);

    const groups = this._data;
    return `
     <h1 class="groups__heading">All groups</h1>
     <ul class="groups__list">
     ${groups
       .map(group => {
         return `
          <li class="preview">
              <a href="#${group.groupName}" class="preview__link">${group.groupName}</a>
              <button class="btn--minus">
            
            
              <svg class="nav__icon">
                  <use href="${icons}#icon-minus"></use>
                </svg>
              </button>
          </li>      
          `;
       })
       .join('')}
          
        </ul>
    `;
  }
}

export default new AllGroupsView();
