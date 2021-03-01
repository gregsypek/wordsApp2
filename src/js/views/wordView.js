import icons from '../../img/icons.svg';

class WordView {
  #parentElement = document.querySelector('.aside__list');
  #data;
  #messageElement = document.querySelector('.aside__info');

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    // resultListFrame.classList.remove('hidden');
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }
  removeMessage() {
    this.#messageElement.remove();
  }
  showList() {
    this.#parentElement.classList.remove('hidden');
  }
  hideSpinner() {
    document.querySelector('.spinner').style.display = 'none';
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-spinner"></use>
      </svg>
    </div>
  `;
    this.#parentElement.innerHTML = '';
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  #generateMarkup() {
    return `
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
