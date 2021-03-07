import * as model from './model.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';
import groupView from './views/groupView.js';

import 'core-js/stable'; // allows old browser display our code
import 'regenerator-runtime/runtime'; //polyfiling async await functions
import wordClickView from './views/wordClickView.js';

const controlSearchWords = async function () {
  try {
    //1. Get search query

    const query = searchView.getQuery();

    if (!query) return;

    // const id = window.location.hash.slice(1);
    // console.log(id);
    // if (!id) return;

    wordView.renderSpinner();

    //2. Load search result

    // await model.loadSearchWord(id);
    await model.loadSearchWord(query);

    //3. Render result

    wordView.render(model.state);

    //4. Add word into results array

    await model.saveSearchedWord(model.state.word);

    // wordView.render(model.state.word);
    // await wordClickView.addHandlerClick(controlClickPartOfSpeech);
    // wordView.addHandlerClick();

    console.log('renderuj');
    wordView.render(model.state);

    // wordView.getWord();
    wordView.addHandlerClick(controlClickPartOfSpeech);
  } catch (err) {
    wordView.renderMessageError();
  }
};

const controlClickPartOfSpeech = function (markPartClicked) {
  model.getClickedPartOfSpeech(markPartClicked);
  console.log(markPartClicked);
  wordClickView.render(model.state);
  // wordView.render(model.getClickedPartOfSpeech(markPartClicked));
};

// const controlCards = async function () {
//   try {
//     // wordView.renderSpinner();
//     // await model.loadSearchWord('apple');

//     const word = model.state.search.results.slice(-1);
//     console.log(word);
//     // groupView.renderSpinner();

//     groupView.render(model.state.word);
//   } catch (err) {
//     console.log(err);
//   }
// };

const init = function () {
  searchView.addHandlerSearch(controlSearchWords);
  // wordView.addHandlerRender(controlSearchWords);
  wordView.addHandlerRender();

  // controlCards();
};
init();
