import View from './View.js';

class NoGroupView extends View {
  _parentElement = document.querySelector('.message-nogroup');

  _messageError = '';
  _message =
    'No group created. All cards will be added into default group. Please create new group to prevent that and then add your words inside';
}
export default new NoGroupView();
