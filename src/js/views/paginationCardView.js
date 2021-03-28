import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationCardView extends View {
  _parentElement = document.querySelector('.main__card-footer');

  _generateMarkup() {
    // Page 1, and there are other pages
    //Page 1, and there are not other pages
    //Last page
    //Other page
  }
}
export default new PaginationCardView();
