import View from './View.js';
import icons from '../../img/icons.svg';
class GroupNavView extends View {
  _parentElement = document.querySelector('.main__nav');
  _formGroup = document.querySelector('.create');

  _messageError = 'main__nav';
  _message =
    'No group created. All cards will be added into default group. Please create new group to prevent that and then add your words inside';

  getNewGroup() {
    const group = this._parentElement.querySelector('.create__field').value;
    // group.value = '';
    console.log(group);
    return group;
  }

  // addHandlerClick(handler) {
  //   this._parentElement
  //     .querySelector('.main__btn--create-group')
  //     .addEventListener('click', () => handler());
  // }
  addHandlerCreate(handler) {
    this._parentElement
      .querySelector('.create__field')
      .addEventListener('submit', function (e) {
        console.log('JEST');

        e.preventDefault();
        handler();
      });
  }

  toggleFormCreateGroup() {
    this._formGroup.classList.remove('hidden');
  }

  _generateMarkup() {
    console.log(this._data);
    return `
    <div class="main__bar">
            <p class="main__group">Owoce</p>
            <div class="main__btns">
              <button class="main__btn main__btn--edit">
                <svg class="${icons}#icon-edit"></use>
                </svg>
              </button>
              <button class="main__btn main__btn--edit">
                <svg class="bar__icon">
                  <use href=""${icons}#icon-plus"></use>
                </svg>
              </button>
              <button class="main__btn main__btn--edit">
                <svg class="bar__icon">
                  <use href=""${icons}#icon-minus"></use>
                </svg>
              </button>
              <button class="main__btn main__btn--edit">
                <svg class="bar__icon">
                  <use href=""${icons}#icon-bar-graph"></use>
                </svg>
              </button>
              <button class="main__btn main__btn--edit">
                <svg class="bar__icon">
                  <use href=""${icons}#icon-print"></use>
                </svg>
              </button>
            </div>
          </div>
    `;
  }
}
export default new GroupNavView();
