import * as model from './model.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';
import cardsView from './views/cardsView.js';
// import welcomeView from './views/welcomeView.js';
import wordClickView from './views/wordClickView.js';

import 'core-js/stable'; // allows old browser display our code
import 'regenerator-runtime/runtime'; //polyfiling async await functions
import groupMessageView from './views/groupMessageView.js';
import groupNavView from './views/groupNavView.js';
import groupBarView from './views/groupBarView.js';
import allGroupsView from './views/allGroupsView.js';

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

    // groupNavView.addHandlerCreate(controlClickCreateNewGroup);
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

  wordClickView.render(model.state);

  wordView.addHandlerClick(controlClickPartOfSpeech);

  wordClickView.handleClickPlusBtn(controlAddNewCard);

  // model.isGroupCreated();

  if (!model.isAnyGroupCreated()) groupMessageView.renderMessageError();
};

const controlClickCreateNewGroup = async function () {
  try {
    //0. hide createGroup form
    groupNavView.toggleFormCreateGroup();
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. clear cards by render message
    cardsView.renderMessage();

    model.state.messageDisplay = true;

    //4. save group as active
    await model.saveGroupAsActive(group);

    // 5 change flag newGroup
    model.state.newGroup = true;
    //6. render spinner load
    groupBarView.renderSpinner();

    //7. render group-bar navigation
    groupBarView.render(model.state.activeGroup);

    //8. delete warning message nogroup (trick render empty string and clean parent element before)
    if (model.state.activeGroup) {
      groupMessageView.render('');
    }
  } catch (err) {
    console.log(err);
  }
};

const controlAddNewCard = function () {
  //1.create card object
  model.createObjCard();

  //2.render new card

  const newCard = model.loadNewCard();

  //3. check if there is a message
  if (model.state.messageDisplay) {
    //a. clear message
    cardsView.render(newCard);
    model.state.messageDisplay = false;
  } else {
    //b. add card next to previous one
    cardsView.renderCard(newCard);
  }
  //4. save card into state object
  model.saveCardIntoCorrectGroup(newCard);

  // TODO if card has the same id but different part of speech change number 1 into next one
};
const controlLoadAllCardsFromGroup = function (group) {
  //1.get all cards
  const cards = model.loadAllCardsFromGroup(group);
  //2.clear cards container
  cardsView.clear();
  //3.render cards

  cards.map(card => cardsView.renderCard(card));
};

const controlPlayAudio = function (url) {
  // if (!url) return;
  const audio = new Audio(url);
  audio.play();
};
const controlDeleteCard = function (cardId) {
  //1. delete card from state object
  model.deleteCard(+cardId);

  //2. check which group render again default or active
  if (model.state.activeGroup) {
    controlLoadAllCardsFromGroup(model.state.activeGroup);
  } else {
    controlLoadAllCardsFromGroup('default');
  }
};

const controlShowCreateGroupForm = function () {
  groupNavView.toggleFormCreateGroup();
};

const controlNewGroupFromBar = function () {
  // console.log(model.state);
  groupNavView.toggleFormCreateGroup();
};
const controlLoadAllGroups = function () {
  allGroupsView.render(model.state.groups);
};

const controlPreviewGroup = async function () {
  try {
    //1. save the name of the selected group
    const group = window.location.hash.slice(1);

    if (!group) return;
    //2. close modal window
    allGroupsView.addHandlerPreview();
    //3.change activeGroup to be able deleting cards
    model.state.activeGroup = group;
    //4. render all cards from selected group
    controlLoadAllCardsFromGroup(group);
    //5. render bar navigation
    groupBarView.render(group);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  searchView.addHandlerSearch(controlSearchWords);
  // wordView.addHandlerRender(controlSearchWords);
  wordView.addHandlerRender();

  groupNavView.addHandlerClick(controlShowCreateGroupForm);
  groupNavView.addHandlerCreate(controlClickCreateNewGroup);
  cardsView.addHandlerPlay(controlPlayAudio);
  cardsView.addHandlerClose(controlDeleteCard);
  groupBarView.addHandlerNewGroup(controlNewGroupFromBar);
  allGroupsView.addHandleClick(controlLoadAllGroups);
  allGroupsView.addHandlerRender(controlPreviewGroup);
};
init();
