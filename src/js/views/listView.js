import View from './View.js';
import icons from '../../img/icons.svg';

class ListView extends View {
  _parentElement = document.querySelector('.aside');
  _message = '';

  addHandlerPage(handler) {
    // this._parentElement.addEventListener('click', function (e) {
    //   const btn = e.target.closest('.btn--page');
    //   if (!btn) return;
    //   const goToPage = +btn.dataset.goto;
    //   const card = e.target.closest('.main__card-box');
    //   if (!card) return;
    //   const cardId = +card.dataset.id;
    //   // console.log(cardId);
    //   // console.log(goToPage);
    //   handler(cardId, goToPage);
    // });
  }

  updateMarkup(card) {
    // const cardBoxes = this._parentElement.querySelectorAll('.main__card-box');
    // const cardBoxesIDs = Array.from(cardBoxes).map(card => card.dataset.id);
    // const index = cardBoxesIDs.findIndex(id => Number(id) === card.id);
    // const cardToUpdate = cardBoxes[index];
    // const newDefinitions = card.renderDefinitions;
    // // console.log(oldDefinitions);
    // // console.log('newDefinitions', newDefinitions);
    // cardToUpdate.querySelector(
    //   '.card__sentance'
    // ).innerHTML = newDefinitions.map(this._generateMarkupDefinitions).join('');
    // //////////////
    // cardToUpdate.querySelector(
    //   '.main__card-footer'
    // ).innerHTML = this._generateFooterCard(card);
    // /////////////
  }

  _generateMarkup() {
    const cards = this._data;
    console.log(cards);
    // const curPage = this._data.page;
    // const numPages = this._data.numPages;
    return `
     <div class="aside__print aside__results">
      <ul class="aside__list">
    ${cards
      .map(card => {
        return `
       
          <p class="nav__icon aside__print--letter">${card.name
            .slice(0, 1)
            .toUpperCase()}</p>         
          <li class="aside__item">
            <strong class="aside__link--eng">${
              card.name
            }</strong>&nbsp;          
              <span class="aside__link--type aside__print--eng">${
                card.phonetics
              }
              </span>
              <p class="aside__link--def aside__print--def">${
                card.definitions[0]
              }</p>
          </li>  
      
      `;
      })
      .join('')}
   
         </ul>
          </div>
    `;
  }

  _generateFooterCard(pageData = false) {
    // console.log('this._data');

    const curPage = pageData ? pageData.page : this._data.page;
    const numPages = pageData ? pageData.numPages : this._data.numPages;
    //Page 1, and there are other pages
    // console.log('curPage', curPage);
    // console.log('numPages', numPages);
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--page btn--next">
          <span>Page ${curPage + 1}</span>
            <svg class="bar__icon">
              <use href="${icons}#icon-chevron-right"></use>
            </svg>
        </button>
        <button class="btn--print">
            <svg class="bar__icon">
              <use href="./src/img/icons.svg#icon-print"></use>
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
        <button class="btn--print">
            <svg class="bar__icon">
              <use href="./src/img/icons.svg#icon-print"></use>
            </svg>
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
        <button class="btn--print">
            <svg class="bar__icon">
              <use href="./src/img/icons.svg#icon-print"></use>
            </svg>
          </button>
      `;
    }
    //Page 1, and tere anr no other pages
    return '';
  }
}

export default new ListView();
