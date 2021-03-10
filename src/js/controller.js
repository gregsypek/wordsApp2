import * as model from './model.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';
import cardsView from './views/cardsView.js';
// import welcomeView from './views/welcomeView.js';
import wordClickView from './views/wordClickView.js';

import 'core-js/stable'; // allows old browser display our code
import 'regenerator-runtime/runtime'; //polyfiling async await functions
import noGroupView from './views/noGroupView.js';

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

    //4. Add word and query into search object
    model.saveSearchedWord(model.state.word);

    wordView.addHandlerClick(controlClickPartOfSpeech);
  } catch (err) {
    wordView.renderMessageError();
  }
};

const controlClickPartOfSpeech = function (markPartClicked) {
  //reset data
  // console.log(model.state.click);
  model.resetClickObject();

  // console.log(model.state.click);

  model.saveClickedData(markPartClicked);
  // console.log(markPartClicked);
  wordClickView.render(model.state);

  wordView.addHandlerClick(controlClickPartOfSpeech);

  wordClickView.handleClickPlusBtn(controlClickPlusBtn);

  // model.isGroupCreated();

  if (!model.isGroupCreated()) noGroupView.renderMessage();
};
const controlClickPlusBtn = function () {
  //1.create card object
  model.createObjCard();
  //2.render new card
  const lastCard = model.state.cards.length - 1;
  cardsView.renderCard(model.state.cards[lastCard]);
};

const init = function () {
  searchView.addHandlerSearch(controlSearchWords);
  // wordView.addHandlerRender(controlSearchWords);
  wordView.addHandlerRender();
  // noGroupView.renderMessage();
  // controlCards();
};
init();
