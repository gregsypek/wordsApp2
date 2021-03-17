class GroupNavView {
  _parentElement = document.querySelector('.main__input');
  _formGroup = document.querySelector('.main__input');
  _showFormCreateGroup = document.querySelector('.main__btn--create-group');
  _createGroupBtn = document.querySelector('.create');

  getNewGroup() {
    const group = this._parentElement.querySelector('.create__field').value;
    // group.value = '';
    console.log(group);
    return group;
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
    this._formGroup.classList.toggle('hidden');
  }
}
export default new GroupNavView();
