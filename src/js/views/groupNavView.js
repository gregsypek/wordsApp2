import View from './View.js';

class GroupNavView extends View {
  _parentElement = document.querySelector('.main__input');
  _showFormCreateGroup = document.querySelector('.main__btn--create-group');
  _createGroupBtn = document.querySelector('.create');
  _renameGroupBtn = document.querySelector('.rename');

  getNewGroup() {
    const group = this._parentElement.querySelector('.create__field').value;
    this._clearInput();
    console.log(group);
    return group;
  }

  _clearInput() {
    this._parentElement.querySelector('.create__field').value = '';
  }
  addHandlerClick(handler) {
    this._showFormCreateGroup.addEventListener('click', () => handler());
  }
  addHandlerCreateGroup(handler) {
    this._createGroupBtn.addEventListener('submit', e => {
      // e.stopPropagation();
      e.preventDefault();
      handler();
    });
  }
  addHandlerRenameGroup(handler) {
    this._renameGroupBtn.addEventListener('submit', e => {
      // e.stopPropagation();
      e.preventDefault();
      handler();
    });
  }

  toggleShowHiddenForm() {
    this._createGroupBtn.classList.toggle('hidden');
  }
  toggleShowHiddenRenameForm() {
    this._renameGroupBtn.classList.toggle('hidden');
  }
}
export default new GroupNavView();
