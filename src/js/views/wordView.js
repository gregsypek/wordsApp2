//.js is optional
import View from './View.js';
import icons from '../../img/icons.svg';

class WordView extends View {
  _parentElement = document.querySelector('.aside');

  _messageError =
    'You have no results. Please try again or search another one. You can also create new word and add him into group.';
  _message = '';

  // addHandlerRender(handler) {
  //   ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  // }

  addHandlerClick(handler) {
    this._parentElement
      .querySelector('.aside__item')
      //to have access for WordView object we need implement here arrow function
      .addEventListener('click', e => {
        const clicked = e.target.closest('.aside__link');
        // console.log(clicked);
        if (!clicked) return;
        const markPartClicked = +clicked.dataset.link;
        // console.log(markPartClicked);

        clicked.classList.toggle('aside__link--active');
        // console.log(clicked);
        handler(markPartClicked);
      });
  }

  _generateMarkup() {
    const { word } = this._data;
    // const { activePart } = this._data.click;
    const { clickedPart } = this._data.click;
    return `
     <div class="aside__results">
          <ul class="aside__list">
            <li class="aside__item">
              <strong class="aside__link--eng">${word.word}</strong>&nbsp;
              ${word.meanings
                .map((item, i) => {
                  if (!clickedPart && clickedPart === i + 1)
                    document
                      .querySelector('.aside__link')
                      .classList.toggle('aside__link--active');
                  return `
                <div class="aside__link" data-link="${i + 1}">
                <dfn class="aside__link--data">
                  <span class="aside__link--type">${item.partOfSpeech}</span>
                  ${item.definitions
                    .map(this._generateMarkupDefinitions)
                    .join('')}
                </dfn>
                <button class="btn--plus-sm hidden btn__active--${i + 1}">
                  <svg class="nav__icon">
                    <use href="${icons}#icon-plus"></use>
                  </svg>
                </button>
              </div>
                `;
                })
                .join('')}             
         
            </li>
          </ul>
          <div class="aside__footer hidden">
            <button class="btn--page">
              <svg class="bar__icon">
                <use href="./src/img/icons.svg#icon-chevron-left"></use>
              </svg>
              <span>Page 1</span>
            </button>
            <button class="btn--page">
              <span>Page 2</span>
              <svg class="bar__icon">
                <use href="./src/img/icons.svg#icon-chevron-right"></use>
              </svg>
            </button>
            <button class="btn--print">
              <svg class="bar__icon">
                <use href="./src/img/icons.svg#icon-print"></use>
              </svg>
            </button>
          </div>
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
