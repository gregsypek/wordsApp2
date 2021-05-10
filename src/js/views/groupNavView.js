import View from './View.js';

class GroupNavView extends View {
  _parentElement = document.querySelector('.main__input');
  _createGroupFromBar = document.querySelector('.main__btn--newGroup');
  _sortBtn = document.querySelector('.main__btn--sort');
  _createGroupBtnForm = document.querySelector('.create');
  _renameGroupBtnForm = document.querySelector('.rename');
  _confirmForm = document.querySelector('.confirm');
  getNewGroup() {
    const group = this._parentElement
      .querySelector('.create__field')
      .value.toUpperCase()
      .trim();

    this._clearInput('.create__field');
    return group;
  }
  getNewName() {
    const name = this._parentElement
      .querySelector('.rename__field')
      .value.toUpperCase()
      .trim();
    this._clearInput('.rename__field');
    //remove only double-spaces
    return name.replace(/\s\s/g, ' ');
  }

  _clearInput(field) {
    this._parentElement.querySelector(field).value = '';
  }

  addHandlerPlus(handler) {
    this._createGroupFromBar.addEventListener('click', () => handler());
  }
  addHandlerCreateGroup(handler) {
    this._createGroupBtnForm.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
  addHandlerRenameGroup(handler) {
    this._renameGroupBtnForm.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  toggleShowHiddenForm() {
    this._createGroupBtnForm.classList.toggle('hidden');
  }
  hideCreateForm() {
    this._createGroupBtnForm.classList.add('hidden');
  }
  hideRenameForm() {
    this._renameGroupBtnForm.classList.add('hidden');
  }
  toggleShowHiddenRenameForm() {
    this._renameGroupBtnForm.classList.toggle('hidden');
    //move up form rename to be in place create form place
    this._renameGroupBtnForm.style.transform = 'translateY(-5.6rem)';
  }
  toggleShowHiddenConfirmForm() {
    this._confirmForm.classList.toggle('hidden');
  }
}
export default new GroupNavView();
