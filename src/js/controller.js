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
  // console.log(markPartClicked);
  wordClickView.render(model.state);

  wordView.addHandlerClick(controlClickPartOfSpeech);

  wordClickView.handleClickPlusBtn(controlClickPlusBtn);

  // model.isGroupCreated();

  if (!model.isAnyGroupCreated()) groupMessageView.renderMessageError();
};

const controlClickCreateNewGroup = async function () {
  try {
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. save group as active
    await model.saveGroupAsActive(group);

    //4. render spinner load
    groupBarView.renderSpinner();

    //5. render group-bar navigation
    groupBarView.render(model.state.activeGroup);

    //6. delete warning message nogroup (trick render empty string and clean parent element before)
    if (model.state.activeGroup) {
      groupMessageView.render(model.state.activeGroup);
    }
    // console.log(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlClickPlusBtn = function () {
  //1.create card object
  model.createObjCard();
  //2.render new card
  const lastCard = model.state.cards.length - 1;
  const newCard = model.state.cards[lastCard];
  console.log(newCard);
  cardsView.renderCard(newCard);

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
    //add all cards from default gruop into user group
    model.state.groups[defaultObjectIndex].cards.forEach(card =>
      model.addCardIntoGroup(card)
    );
    //delete default group
    model.state.groups.splice(defaultObjectIndex, 1);
    model.addCardIntoGroup(newCard);
  } else {
    return;
  }
};

const controlShowCreateGroupForm = function () {
  groupNavView.showFormGroup();
};

const init = function () {
  searchView.addHandlerSearch(controlSearchWords);
  // wordView.addHandlerRender(controlSearchWords);
  wordView.addHandlerRender();

  groupNavView.addHandlerClick(controlShowCreateGroupForm);
  groupNavView.addHandlerCreate(controlClickCreateNewGroup);
};
init();
