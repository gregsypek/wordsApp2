class GroupNavView {
  _parentElement = document.querySelector('.main__nav');
  _formGroup = document.querySelector('.main__input');

  getNewGroup() {
    const group = this._parentElement.querySelector('.create__field').value;
    // group.value = '';
    console.log(group);
    return group;
  }

  addHandlerClick(handler) {
    this._parentElement
      .querySelector('.main__btn--create-group')
      .addEventListener('click', () => handler());
  }
  addHandlerCreate(handler) {
    this._formGroup
      .querySelector('.create')
      .addEventListener('submit', function (e) {
        e.preventDefault();
        handler();
      });
  }

  showFormGroup() {
    this._formGroup.classList.remove('hidden');
  }
}
export default new GroupNavView();
