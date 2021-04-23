import View from './View.js';
import icons from '../../img/icons.svg';

class ListView extends View {
  _parentElement = document.querySelector('.aside');
  _message = '';

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--page');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  updateFooter(list) {
    const newList = list.renderResults;
    this._parentElement.querySelector(
      '.aside__print--footer'
    ).innerHTML = this._generateFooterList(list);
  }

  _generateMarkup() {
    const cards = this._data.renderResults;
    console.log(cards);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    function groupBy(objectArray, property) {
      return objectArray.reduce(function (acc, obj) {
        //take only first big letter
        let key = obj[property].slice(0, 1).toUpperCase();
        //take only unique keys
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }
    let groupedLetters = groupBy(cards, 'name');
    //CARDS ARE ALPHABETICALLY SORTED!
    const allLetters = cards.map(card => card.name.slice(0, 1).toUpperCase());
    let uniqueletters = [...new Set(allLetters)];
    console.log(uniqueletters);

    // for (const property in groupedLetters) {
    //   console.log(`${property}: ${groupedLetters[property]}`);
    // }
    console.log(groupedLetters);
    // console.log('he', Object.entries(groupedLetters));
    return `
     <div class="aside__print aside__results">
      <ul class="aside__list aside__print--list">
    ${uniqueletters
      .map(letter => {
        return `
          <p class="nav__icon aside__print--letter">${letter}</p>         
         
          ${groupedLetters[letter]
            .map(card => {
              return `
            <li class="aside__item">
              <strong class="aside__link--eng">${card.name}</strong>&nbsp;          
                <span class="aside__link--type aside__print--eng">${card.phonetics}
                </span>
                <span class="aside__link--type aside__print--eng"><strong>${card.partOfSpeech}</strong>
                </span>
                <p class="aside__link--def aside__print--def">${card.definitions[0]}</p>
            </li>  
            `;
            })
            .join('')}
      `;
      })
      .join('')}
   
         </ul>
         <div class="aside__footer aside__print--footer">
          ${this._generateFooterList()}
          
        </div>
          </div>
          
    `;
  }

  _generateFooterList(pageData = false) {
    console.log('this._data', this._data);

    const curPage = pageData ? pageData.page : this._data.page;
    const numPages = pageData ? pageData.numPages : this._data.numPages;
    //Page 1, and there are other pages
    console.log('curPage', curPage);
    console.log('numPages', numPages);
    if (curPage === 1 && numPages > 1) {
      return `
       <button class="btn--page btn--prev">
          
        </button>
        <button data-goto="${curPage + 1}" class="btn--page btn--next">
          <span>Page ${curPage + 1}</span>
            <svg class="bar__icon">
              <use href="${icons}#icon-chevron-right"></use>
            </svg>
        </button>
        <button class="btn--print btn__print--print">
            <svg class="bar__icon">
              <use href="${icons}#icon-print"></use>
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
        <button class="btn--print btn__print--print">
            <svg class="bar__icon">
              <use href="${icons}#icon-print"></use>
            </svg>
          </button>
      `;

    //Other page
    if (curPage < numPages) {
      return `

        <button data-goto="${curPage - 1}"  class="btn--page btn--next">
            <svg class="bar__icon">
              <use href="${icons}#icon-chevron-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
          <button data-goto="${curPage + 1}"  class="btn--page">
            <span>${curPage + 1}</span>
            <svg class="bar__icon">
              <use href="${icons}#icon-chevron-right"></use>
            </svg>
          </button>
            <button class="btn--print btn__print--print">
              <svg class="bar__icon">
                <use href="${icons}#icon-print"></use>
              </svg>
            </button>
      `;
    }
    //Page 1, and tere anr no other pages
    return `
        <button class="btn--page btn--prev">
        </button>
        <button class="btn--page btn--next">
        </button>
         <button class="btn--print btn__print--print">
          <svg class="bar__icon">
            <use href="${icons}#icon-print"></use>
          </svg>
        </button>
    `;
  }
}

export default new ListView();
