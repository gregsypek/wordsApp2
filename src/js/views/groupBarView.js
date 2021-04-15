import View from './View.js';
import icons from '../../img/icons.svg';
class GroupBarView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.main__nav');
  _deleteGroupBtn = document.querySelector('.main__btn--deleteGroup');
  _messageError = '';
  // _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerShowNewGroupForm(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const newGroup = e.target.closest('.main__btn--newGroup');
      if (!newGroup) return;
      handler();
    });
  }
  addHandlerShowRenameGroupForm(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const rename = e.target.closest('.main__btn--rename');
      if (!rename) return;
      handler();
    });
  }
  addHandlerDeleteGroup(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const deleteBtn = e.target.closest('.main__btn--deleteGroup');
      if (!deleteBtn) return;
      handler();
    });
  }
  _generateMarkup() {
    const name = this._data;
    return `
   
           <div class="main__bar">
              <p class="main__group">${name}</p>
              <div class="main__btns">
                <button class="main__btn main__btn--edit
                main__btn--rename">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-edit"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit main__btn--newGroup">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-plus"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit main__btn--deleteGroup">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-minus"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-bar-graph"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-print"></use>
                  </svg>
                </button>
              </div>
            </div>
         
    `;
  }
}
export default new GroupBarView();
