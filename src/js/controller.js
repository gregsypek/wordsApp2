import * as model from './model.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';

import 'core-js/stable'; // allows old browser display our code
import 'regenerator-runtime/runtime'; //polyfiling async await functions

const controlSearchWords = async function () {
  try {
    //1. Get search query

    const query = searchView.getQuery();
    console.log(typeof query);
    if (!query) return;

    // const id = window.location.hash.slice(1);
    // console.log(id);
    // if (!id) return;

    wordView.renderSpinner();

    //2. Load search result

    // await model.loadSearchWord(id);
    await model.loadSearchWord(query);

    //3. Render result

    wordView.render(model.state.word);
  } catch (err) {
    wordView.renderMessageError();
  }
};

const init = function () {
  wordView.addHandlerRender(controlSearchWords);
  searchView.addHandlerSearch(controlSearchWords);
};
init();
