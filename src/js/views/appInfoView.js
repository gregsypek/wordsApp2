import View from './View.js';

class AppInfoView extends View {
  _parentElement = document.querySelector('.aside__info');

  _messageError =
    'Application built to help you learn new words by grouping them and print on special preformated lists.';
  _message = '';
  _generateMarkup() {
    return `
    
    `;
  }
}
export default new AppInfoView();
