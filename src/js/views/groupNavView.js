import View from './View.js';

class GroupNavView extends View {
  _parentElement = document.querySelector('.main__input');
  // _showFormCreateGroup = document.querySelector('.main__btn--create-group');
  _createGroupFromBar = document.querySelector('.main__btn--newGroup');
  _sortBtn = document.querySelector('.main__btn--sort');
  _createGroupBtnForm = document.querySelector('.create');
  _renameGroupBtnForm = document.querySelector('.rename');
  // _deleteGroupBtn = document.querySelector('.main__btn--deleteGroup');
  getNewGroup() {
    const group = this._parentElement
      .querySelector('.create__field')
      .value.toUpperCase()
      .trim();

    this._clearInput();
    console.log('new group', group);
    return group;
  }
  getNewName() {
    const name = this._parentElement
      .querySelector('.rename__field')
      .value.toUpperCase()
      .trim();
    this._clearInput();
    console.log(name);
    //remove only double-spaces
    return name.replace(/\s\s/g, ' ');
  }

  _clearInput() {
    this._parentElement.querySelector('.create__field').value = '';
  }

  // addHandlerClick(handler) {
  //   // if (!this._showFormCreateGroup) return;

  //   this._showFormCreateGroup.addEventListener('click', () => handler());
  // }
  addHandlerPlus(handler) {
    this._createGroupFromBar.addEventListener('click', () => handler());
  }
  addHandlerCreateGroup(handler) {
    this._createGroupBtnForm.addEventListener('submit', e => {
      // e.stopPropagation();
      e.preventDefault();
      handler();
    });
  }
  addHandlerRenameGroup(handler) {
    this._renameGroupBtnForm.addEventListener('submit', e => {
      // e.stopPropagation();
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
}
export default new GroupNavView();
