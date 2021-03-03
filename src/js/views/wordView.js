//.js is optional
import View from './View.js';

import icons from '../../img/icons.svg';

class WordView extends View {
  _parentElement = document.querySelector('.aside');
  // _plusButton = document.querySelector('.btn--plus-sm');
  // _searchedWords = document.querySelectorAll('.aside__item');
  _messageError =
    'You have no results. Please try again or search another one. You can also create new word and add him into group.';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup() {
    return `
     <div class="aside__results">
          <ul class="aside__list">
           <a href="#soup">soup</a>
            <a href="#cut">cut</a> -->
      <li class="aside__item ">
        <a href="${this._data.word}" class="aside__link">
          <strong class="aside__link--eng">${this._data.word}</strong>&nbsp;

          <dfn class="aside__link--data">
            ${this._data.meanings
              .map(item => {
                return `
               <span class="aside__link--type">
            ${item.partOfSpeech}

            ${item.definitions.map(this._generateMarkupDefinitions).join('')}
              </span>
              `;
              })
              .join('')}
           
          </dfn>        
        </a>
         <button class="btn--plus-sm hidden">
                <svg class="nav__icon">
                  <use href="${icons}#icon-plus"></use>
                </svg>
              </button>
      </li>
      </ul>
      </div>
    `;
  }

  _generateMarkupDefinitions(def, index) {
    return `
               <span class="aside__link--meanings">
                <em class="aside__link--nr">${index + 1}</em>
                <em class="aside__link--def">${def.definition}</em>
              </span>
              `;
  }
}

export default new WordView(); // we export only instance of the class. Into class WordView no one have access
