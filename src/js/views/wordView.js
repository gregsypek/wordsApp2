import icons from '../../img/icons.svg';

class WordView {
  #parentElement = document.querySelector('.aside');
  #data;
  #messageError = 'You have no results. Please try again or search another one. You can also create new word and add him into group.';
  #message = '';

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-spinner"></use>
      </svg>
    </div>
  `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //if no argument default value will be set to #messageError
  renderMessageError(message = this.#messageError) {
    const markup = `
     <div class="message message-noword">
            <p>${message}</p>
          </div> -->
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this.#message) {
    const markup = `
     <div class="message">
            <p>${message}</p>
          </div> -->
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  #generateMarkup() {
    return `
     <div class="aside__results">
          <ul class="aside__list">
           <a href="#soup">soup</a>
            <a href="#cut">cut</a> -->
      <li class="aside__item aside__item--active">
        <a href="${this.#data.word}" class="aside__link">
          <strong class="aside__link--eng">${this.#data.word}</strong>&nbsp;

          <dfn class="aside__link--data">
            ${this.#data.meanings
              .map(item => {
                return `
               <span class="aside__link--type">
            ${item.partOfSpeech}

            ${item.definitions.map(this.#generateMarkupDefinitions).join('')}
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

  #generateMarkupDefinitions(def, index) {
    return `
               <span class="aside__link--meanings">
                <em class="aside__link--nr">${index + 1}</em>
                <em class="aside__link--def">${def.definition}</em>
              </span>
              `;
  }
}

export default new WordView(); // we export only instance of the class. Into class WordView no one have access
