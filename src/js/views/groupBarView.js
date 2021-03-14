import View from './View.js';
import icons from '../../img/icons.svg';
class GroupBarView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.main__nav');
  _messageError = '';
  _message =
    'No group created. All cards will be added into default group. Please create new group to prevent that and then add your words inside';

  _generateMarkup() {
    const name = this._data;
    return `
   
           <div class="main__bar">
              <p class="main__group">${name}</p>
              <div class="main__btns">
                <button class="main__btn main__btn--edit">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-edit"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit">
                  <svg class="bar__icon">
                    <use href="${icons}#icon-plus"></use>
                  </svg>
                </button>
                <button class="main__btn main__btn--edit">
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