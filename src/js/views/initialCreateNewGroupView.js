import View from './View.js';
import icons from '../../img/icons.svg';
class InitialCreateNewGroupView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.main__create-group');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const form = e.target.closest('.main__btn--create-group');
      if (!form) return;
      handler();
    });
  }

  _generateMarkup() {
    return `  
         
              <p>Create new group</p>
              <button class="main__btn main__btn--create-group">
                <svg class="nav__icon">
                  <use href="${icons}#icon-plus"></use>
                </svg>
              </button>
              
        
         
    `;
  }
  // clear() {
  //   this._parentElement.innerHTML = '';
  // }
}
export default new InitialCreateNewGroupView();
