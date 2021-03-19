class GroupNavView {
  _parentElement = document.querySelector('.main__input');
  _showFormCreateGroup = document.querySelector('.main__btn--create-group');
  _createGroupBtn = document.querySelector('.create');

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
  addHandlerCreate(handler) {
    this._createGroupBtn.addEventListener('submit', e => {
      e.stopPropagation();
      e.preventDefault();
      handler();
    });
  }

  toggleFormCreateGroup() {
    this._parentElement.classList.toggle('hidden');
  }
}
export default new GroupNavView();
