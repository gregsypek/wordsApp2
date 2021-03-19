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
import { isDefaultGroupCreated } from './model_copy.js';

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
  const lastCard = model.state.cards.length - 1;
  const newCard = model.state.cards[lastCard];

  console.log('I am new card', newCard);

  //3. check if there is a message
  if (model.state.messageDisplay) {
    //a. clear message
    cardsView.render(newCard);
    model.state.messageDisplay = false;
  } else {
    //b. add card next to previous
    cardsView.renderCard(newCard);
  }

  // TODO if card has the same id but different part of speech change number 1 into next one

  //3.check if there is a group created

  //a. there is no group created
  if (!model.isAnyGroupCreated()) {
    model.createObjGroup('default');
    model.addCardIntoDefaultGroup(newCard);
    //b. there is default group only
  } else if (model.isDefaultGroupCreated() && !model.isUserGroupCreated()) {
    model.addCardIntoDefaultGroup(newCard);

    //c. there is user group only
  } else if (!model.isDefaultGroupCreated() && model.isUserGroupCreated()) {
    model.addCardIntoGroup(newCard);

    //d.there is default group and user group
  } else if (model.isDefaultGroupCreated() && model.isUserGroupCreated()) {
    const defaultObjectIndex = model.state.groups.findIndex(
      obj => obj.groupName === 'default'
    );
    // //add all cards from default group into user group
    // model.state.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.addCardIntoGroup(card)
    // );

    //4. add all cards from default group into array 'defaultCards'
    // model.state.groups[defaultObjectIndex].cards.forEach(card =>
    //   model.state.defaultCards.push(card)
    // );

    // //delete default group
    // model.state.groups.splice(defaultObjectIndex, 1);
    model.addCardIntoGroup(newCard);
  } else {
    return;
  }
};
const controlPlayAudio = function (url) {
  // if (!url) return;
  const audio = new Audio(url);
  audio.play();
};
const controlDeleteCard = function (cardId) {
  console.log('delete me', cardId);
  model.deleteCard(+cardId);
};

const controlShowCreateGroupForm = function () {
  groupNavView.toggleFormCreateGroup();
};

const controlNewGroupFromBar = function () {
  // console.log(model.state);
  groupNavView.toggleFormCreateGroup();
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
};
init();
