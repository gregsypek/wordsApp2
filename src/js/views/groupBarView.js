import View from './View.js';
import icons from '../../img/icons.svg';
class GroupBarView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.main__nav');
  _printCardsElement = document.getElementById('printCards');
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
  addHandlerSortCards(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const sortBtn = e.target.closest('.main__btn--sort');
      if (!sortBtn) return;
      handler();
    });
  }
  // printCards(el) {
  //   console.log('_printCardsElement', this._printCardsElement);
  //   // const restorePage = document.body.innerHTML;
  //   // const printContent = el.innerHTML;
  //   // document.body.innerHTML = printContent;
  //   // window.print();
  //   // const restorePage = document.body.innerHTML;
  //   const printContent = el.innerHTML;
  //   document.body.innerHTML = printContent;
  //   window.print();

  //   // document.body.innerHTML = restorePage;
  //   location.reload();
  // }
  addHandlerPrintCards(handler) {
    this._parentElement.addEventListener('click', e => {
      const printBtn = e.target.closest('.main__btn--print');
      if (!printBtn) return;
      // this.printCards(this._printCardsElement);

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
                <button class="main__btn main__btn--edit main__btn--sort">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-bar-graph"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit main__btn--print">
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
