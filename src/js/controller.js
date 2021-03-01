import * as model from './model.js';
import wordView from './views/wordView.js';

import 'core-js/stable'; // allows old browser display our code
import 'regenerator-runtime/runtime'; //polyfiling async await functions

const controlWords = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    wordView.renderSpinner();

    //1. Loading word
    //function only change state object
    await model.loadWord(id);

    //2. Rendering words

    wordView.render(model.state.word);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  wordView.addHandlerRender(controlWords);
};
init();
