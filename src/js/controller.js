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

    await model.loadWord(id);

    //2. Rendering words

    wordView.render(model.state.word);

    //3. Hide start Message

    wordView.removeMessage();

    // TODO ONLY WHEN USER SUBMIT A WORD INTO INPUT SEARCH
    //4.Show resultList frame and wait for result

    wordView.showList();
    // resultList.classList.remove('hidden');
    //5.Hide spinner
    wordView.hideSpinner();
  } catch (err) {
    alert(err);
  }
};

['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlWords));
// window.addEventListener('hashchange', controlWords);
