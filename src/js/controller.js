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
    groupNavView.toggleShowHiddenForm();
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. clear cards by render message
    cardsView.renderMessage();

    model.state.card.messageDisplay = true;

    //4. save group as active
    model.saveGroupAsActive(group);

    // // 5 change flag newGroup
    // model.state.newGroup = true;
    //6. render spinner load
    groupBarView.renderSpinner();

    //7. render group-bar navigation
    groupBarView.render(model.state.group.activeGroup);

    //8. delete warning message nogroup (trick render empty string and clean parent element before)
    if (model.state.group.activeGroup) {
      groupMessageView.render('');
    }
  } catch (err) {
    console.log(err);
  }
};
const controlClickRenameGroup = function () {
  groupNavView.toggleShowHiddenRenameForm();
};
////////////////////////////////
const controlAddNewCard = async function () {
  //1.create card object
  model.createObjCard();
  //1. reset footer page start
  model.state.card.page = 1;
  //2. load new card
  const newCard = model.loadNewCard();

  //3. load all previous cards if exists
  const activeGroup = newCard.groupName;

  const allPreviousCards = [...model.loadAllCardsFromGroup(activeGroup)];

  //4 check if new card is unique
  if (allPreviousCards.length > 0) {
    if (allPreviousCards.some(card => !model.isCardUnique(card, newCard))) {
      groupMessageView.renderMessage(
        "You can't add the same card into this group. Try another one"
      );
      return;
    }
    groupMessageView.render();
  }

  // cardsView.addHandlerNewFooter();
  //5.render new card
  model.state.card.activeCard = newCard;
  //a. check if there is a message
  if (model.state.card.messageDisplay) {
    //a. clear message
    // cardsView.render(newCard);
    cardsView.render(model.getCardResultsPage(newCard));
    model.state.card.messageDisplay = false;

    // cardsView.addHandlerNewFooter();
  } else {
    //b. add card next to previous one
    cardsView.renderCard(model.getCardResultsPage(newCard));
    // cardsView.addHandlerNewFooter();
  }

  //6 render initial pagination buttons

  // controlLoadFooterCard(newCard);
  //7. save card into state object
  model.saveCardIntoCorrectGroup(newCard);
};

const controlLoadAllCardsFromGroup = function (group) {
  //1.get all cards
  const cards = model.loadAllCardsFromGroup(group);
  // console.log('cards to load', cards);
  //2.clear cards container
  cardsView.clear();
  //3.render cards
  // console.log('cards to load', cards);
  //HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  if (model.state.group.activeGroup) {
    controlLoadAllCardsFromGroup(model.state.group.activeGroup);
    console.log(model.state.group.activeGroup);
  } else {
    controlLoadAllCardsFromGroup('default');
  }
};

const controlShowCreateGroupForm = function () {
  groupNavView.toggleShowHiddenForm();
};

const controlNewGroupFromBar = function () {
  // console.log(model.state);
  groupNavView.toggleShowHiddenForm();
};

const controlLoadAllGroups = function () {
  allGroupsView.render(model.state.group.groups);
};

const controlPreviewGroup = async function () {
  try {
    //1. save the name of the selected group
    const group = window.location.hash.slice(1);

    if (!group) return;
    //2. close modal window
    allGroupsView.addHandlerPreview();
    //3.change activeGroup to be able deleting cards
    model.state.group.activeGroup = group;
    //4. render all cards from selected group
    controlLoadAllCardsFromGroup(group);
    //5. render bar navigation
    groupBarView.render(group);
  } catch (err) {
    console.log(err);
  }
};

const controlCardPagination = function (cardId, goToPage) {
  // console.log(model.state.card.cards);
  // if (model.state.card.cards.length > 0) {
  // console.log(model.state.card.cards);
  const cardToChange = model.state.card.cards.filter(
    card => card.id === cardId
  );
  // console.log('cardToChange', cardToChange);
  // console.log('goToPage', goToPage);
  // cardsView.render(model.getCardResultsPage(cardToChange[0], goToPage));
  // console.log(model.getCardResultsPage(cardToChange[0], goToPage));
  cardsView.updateMarkup(model.getCardResultsPage(cardToChange[0], goToPage));

  // } else return;
};

const welcomeBack = function () {
  const activeGroup = model.state.group.activeGroup;
  if (!activeGroup) return;

  //load all cards from groups into cards array  to be able change page on each card
  if (!model.state.group.groups) return;
  model.state.card.cards = model.state.group.groups.flatMap(group =>
    model.loadAllCardsFromGroup(group.groupName)
  );

  //render all cards and group name in group bar navigation
  groupBarView.render(activeGroup);
  controlLoadAllCardsFromGroup(activeGroup);
  groupMessageView.renderMessage('Welcome back :)');
};

const init = function () {
  welcomeBack();
  searchView.addHandlerSearch(controlSearchWords);
  wordView.addHandlerRender();

  groupNavView.addHandlerClick(controlShowCreateGroupForm);
  groupNavView.addHandlerCreateGroup(controlClickCreateNewGroup);
  groupBarView.addHandlerRenameGroup(controlClickRenameGroup);
  cardsView.addHandlerPlay(controlPlayAudio);
  cardsView.addHandlerClose(controlDeleteCard);
  cardsView.addHandlerPage(controlCardPagination);
  groupBarView.addHandlerNewGroup(controlNewGroupFromBar);
  allGroupsView.addHandleClick(controlLoadAllGroups);
  allGroupsView.addHandlerRender(controlPreviewGroup);
};
init();
