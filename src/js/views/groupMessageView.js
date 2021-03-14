import View from './View.js';

class GroupMessageView extends View {
  _parentElement = document.querySelector('.message-nogroup');

  _messageError =
    'No group created. All cards will be added into default group. Please create new group to prevent that and then add your words inside';
  _message = '';
  _generateMarkup() {
    return `
    
    `;
  }
}
export default new GroupMessageView();
