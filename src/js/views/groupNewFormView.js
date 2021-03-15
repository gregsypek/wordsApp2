import View from './View.js';
import icons from '../../img/icons.svg';
class GroupNewFormView extends View {
  // _parentElement = document.querySelector('.main__group-edit');
  _parentElement = document.querySelector('.main__nav');
  _messageError = '';
  _message = '';

  _generateMarkup() {
    return `
      <div class="main__input">
            <form class="create">
              <input
                type="text"
                placeholder="Please name your group..."
                class="field create__field"
              />
              <button class="btn create__btn">Create</button>
            </form>
          </div>
          
    `;
  }
}
export default new GroupNewFormView();
