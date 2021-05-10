import View from './View.js';
import icons from '../../img/icons.svg';

class GroupView extends View {
  _parentElement = document.querySelector('.main__cards');
  _message = 'New group created :)';
  _cardBox = document.querySelector('.main__card-box');

  addHandlerPlay(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const audioBtn = e.target.closest('.main__btn--play');
      if (!audioBtn) return;
      const url = audioBtn.dataset.audioUrl;
      handler(url);
    });
  }

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--page');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      const card = e.target.closest('.main__card-box');
      if (!card) return;
      const cardId = +card.dataset.id;
      handler(cardId, goToPage);
    });
  }

  addHandlerClose(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const closeBtn = e.target.closest('.main__btn--close');
      if (!closeBtn) return;
      const cardId = closeBtn.dataset.cardId;
      handler(cardId);
    });
  }
  updateMarkup(card) {
    const cardBoxes = this._parentElement.querySelectorAll('.main__card-box');

    const cardBoxesIDs = Array.from(cardBoxes).map(card => card.dataset.id);
    const index = cardBoxesIDs.findIndex(id => Number(id) === card.id);
    const cardToUpdate = cardBoxes[index];
    const newDefinitions = card.renderDefinitions;

    cardToUpdate.querySelector(
      '.card__sentance'
    ).innerHTML = newDefinitions.map(this._generateMarkupDefinitions).join('');
    //////////////
    cardToUpdate.querySelector(
      '.main__card-footer'
    ).innerHTML = this._generateFooterCard(card);
    /////////////
  }

  _generateMarkup() {
    const card = this._data;
    return `
     <div class="main__card-box" data-id="${card.id}">
          <div class="main__card">
              <div class="main__card-nav">
                <h3 class="card__word">${card.name}</h3>
                <button class="card__phonetic" tabindex="-1">${
                  card.phonetics
                }</button>
                <div class="card__btns">
                  <button class="main__btn main__btn--edit main__btn--play"
                  data-audio-url="${card.audio}">
                    <svg class="bar__icon">
                      <use href="${icons}#icon-megaphone"></use>
                    </svg>
                  </button>
                  <button class="main__btn main__btn--edit main__btn--close"  data-card-id=${
                    card.id
                  }>
                    <svg class="bar__icon">
                      <use href="${icons}#icon-cross"></use>
                    </svg>
                  </button>
                </div>
               
              </div>
              <div class="main__card-body">
                <div class="card__explanation">
                  <span class="card__explanation--nr">${
                    card.activePartOfSpeech
                  }</span>                 
                  <span class="card__explanation--role">${
                    card.partOfSpeech
                  }</span>
                </div>
                <div class="card__sentance">
                 ${this._data.renderDefinitions
                   .map(this._generateMarkupDefinitions)
                   .join('')}
                </div>
              </div>
              
            </div>
            <div class="main__card-footer">
            ${this._generateFooterCard()}
          </div>
          </div>
    `;
  }
  _generateFooterCard(pageData = false) {
    const curPage = pageData ? pageData.page : this._data.page;
    const numPages = pageData ? pageData.numPages : this._data.numPages;
    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--page btn--next">
          <span>Page ${curPage + 1}</span>
            <svg class="bar__icon">
              <use href="${icons}#icon-chevron-right"></use>
            </svg>
        </button>
      `;
    }
    //Last page
    if (curPage === numPages && numPages > 1)
      return `
        <button data-goto="${curPage - 1}" class="btn--page btn--prev">
          <svg class="bar__icon">
            <use href="${icons}#icon-chevron-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;

    //Other page
    if (curPage < numPages) {
      return `
       <button data-goto="${curPage + 1}" class="btn--page btn--next">
        <span>Page ${curPage + 1}</span>
          <svg class="bar__icon">
            <use href="${icons}#icon-chevron-right"></use>
          </svg>
        </button>
         <button data-goto="${curPage - 1}" class="btn--page btn--prev">
          <svg class="bar__icon">
            <use href="${icons}#icon-chevron-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }
    //Page 1, and there are no other pages
    return '';
  }

  _generateMarkupDefinitions(def) {
    return `
      <p class="definition">${def}</p>
      `;
  }
}

export default new GroupView();
