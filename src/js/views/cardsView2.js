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
      // console.log(cardId);
      handler(cardId);
    });
  }

  _generateMarkup() {
    const card = this._data;
    console.log(card);
    let index = 1;
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
                  <p>${card.definitions
                    .map(this._generateMarkupDefinitions)
                    .join('')}</p>
                </div>
              </div>
              <div class="main__card-footer">
               <button class="btn--page">
              <svg class="bar__icon">
                <use href="${icons}#icon-chevron-left"></use>
              </svg>
            <span>1</span>
            </button>
              
                 <button class="btn--page">
               <span>2</span>
              <svg class="bar__icon">
                <use href="${icons}#icon-chevron-right"></use>
              </svg>
            </button>
              </div>


        </div>

            </div>
    `;
  }

  _generateMarkupDefinitions(def) {
    return `
      <p>${def}</p>
      `;
  }
}

export default new GroupView();
