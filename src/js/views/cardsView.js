import View from './View.js';
import icons from '../../img/icons.svg';

class GroupView extends View {
  _parentElement = document.querySelector('.main__cards-box');
  _message = 'New group created :)';

  addHandlerPlay(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const audioBtn = e.target.closest('.main__btn--play');
      if (!audioBtn) return;
      const url = audioBtn.dataset.audioUrl;
      handler(url);
    });
  }
  clear() {
    this._parentElement.innerHTML = '';
  }

  addHandlerClose(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const closeBtn = e.target.closest('.main__btn--close');
      if (!closeBtn) return;
      const cardId = closeBtn.dataset.cardId;
      console.log(cardId);
      handler(cardId);
    });
  }

  _generateMarkup() {
    const card = this._data;
    const definitions = this._data.renderDefinitions;
    console.log(card);

    // let index = this._data.click.clickedPart;
    // TODO CARD DISPLAY ONLY ONE FIRST EXPLANATION. ADD MORE IN A LIST OF CHOOSE LATER

    return `
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
                  <p>${definitions
                    .map(this._generateMarkupDefinitions)
                    .join('')}</p>
                </div>
              </div>
              <div class="main__card-footer">

              ${this._generateFooterCard()}
               
            </div>
          </div>


       

           
    `;
  }
  _generateFooterCard() {
    const curPage = this._data.page;
    const numPages = this._data.numPages;
    //Page 1, and there are other pages
    console.log('curPage', curPage);
    console.log('numPages', numPages);
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
    //Page 1, and tere anr no other pages
    return '';
  }

  _generateMarkupDefinitions(def) {
    return `
      <p>${def}</p>
      `;
  }
}

export default new GroupView();
