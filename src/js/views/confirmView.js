import View from './View.js';

class ConfirmView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.confirm');

  _messageError = '';
  // _message = '';

  addHandlerYes(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const yesBtn = e.target.closest('.yes__btn');
      if (!yesBtn) return;
      handler();
    });
  }
  addHandlerNo(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const noBtn = e.target.closest('.no__btn');
      if (!noBtn) return;
      handler();
    });
  }

  _generateMarkup() {}
}
export default new ConfirmView();
