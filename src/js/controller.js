// Get word definitions
// Usage : The basic syntax of a URL request to the API is shown below:

// https://api.dictionaryapi.dev/api/v2/entries/<language_code>/<word>

// As an example, to get definition of English word hello, you can send request to

// https://api.dictionaryapi.dev/api/v2/entries/en_US/hello

const resultList = document.querySelector('.aside__list');
const resultListFrame = document.querySelector('.aside__results');
const startMessage = document.querySelector('.aside__info');

const showWord = async function () {
  try {
    //1. Loading words
    const res = await fetch(
      'https://api.dictionaryapi.dev/api/v2/entries/en_US/cut'
    );

    const [data] = await res.json();

    console.log(data);

    if (data.word === 'undefined')
      throw new Error('No results or empty search');

    let word = data;
    word = {
      word: word.word,
      meanings: word.meanings,
      phonetics: word.phonetics[0].text,
      audio: word.phonetics[0].audio,
    };
    console.log(word);
    //2. Rendering words

    const markup = `
      <li class="aside__item aside__item--active">
        <a href="#" class="aside__link">
          <strong class="aside__link--eng">${word.word}</strong>&nbsp;

          <dfn class="aside__link--data">
            ${word.meanings
              .map(item => {
                return `
               <span class="aside__link--type">
            ${item.partOfSpeech}

            ${item.definitions
              .map((def, index) => {
                let i = 0;
                return `
               <span class="aside__link--meanings">
                <em class="aside__link--nr">${index + 1}</em>
                <em class="aside__link--def">${def.definition}</em>
              </span>
              `;
              })
              .join('')}
              </span>
              `;
              })
              .join('')}
           
          </dfn>        
        </a>
        <button class="btn--plus-sm hidden">
          <svg class="nav__icon">
            <use href="./src/img/icons.svg#icon-plus"></use>
          </svg>
        </button>
      </li>
    `;

    //3. Hide start Message
    startMessage.remove();

    // TODO ONLY WHEN USER SUBMIT A WORD INTO INPUT SEARCH
    //4.Show resultList frame and wait for result
    resultListFrame.classList.remove('hidden');
    // resultList.classList.remove('hidden');

    //5. Show results in empty list frame
    resultList.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    alert(err);
  }
};

showWord();
