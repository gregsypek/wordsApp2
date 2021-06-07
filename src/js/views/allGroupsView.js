//.js is optional
import View from './View.js';

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

  addHandlerLoadSelectedGroup(handler) {
    this._parentElement.addEventListener('click', e => {
      const selectedGroup = e.target.closest('.preview__link');
      if (!selectedGroup) return;
      const goToGroup = selectedGroup.dataset.group;
      handler(goToGroup);
    });
  }

  addHandlerPreview() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
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

  _generateMarkup() {
    const groups = this._data;
    return `
     <h1 class="groups__heading">All groups</h1>
     <ul class="groups__list">
     ${groups
       .map(group => {
         return `
          <li class="preview" >
              <a href="#${group.groupName}" class="preview__link" data-group="${group.groupName}">${group.groupName}</a>
              <button class="btn--minus">
              <p class="preview__nr">${group.cards.length}</p>
             
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
