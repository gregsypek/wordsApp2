import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import wordView from './views/wordView.js';
import searchView from './views/searchView.js';
import cardsView from './views/cardsView.js';
import wordClickView from './views/wordClickView.js';
import createWordView from './views/createWordView';

import groupMessageView from './views/groupMessageView.js';
import groupNavView from './views/groupNavView.js';
import groupBarView from './views/groupBarView.js';
import allGroupsView from './views/allGroupsView.js';
import initialCreateNewGroupView from './views/initialCreateNewGroupView.js';
import listView from './views/listView.js';

import 'regenerator-runtime/runtime'; //polyfiling async await functions
import 'core-js/stable'; // allows old browser display our code
import { Object } from 'core-js';
import appInfoView from './views/appInfoView.js';
import confirmView from './views/confirmView.js';

const controlSearchWords = async function () {
  try {
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    wordView.renderSpinner();

    //2. Load search result
    // await model.loadSearchWord(id);
    await model.loadSearchWord(query);

    //3. Render result
    //   TODO IF THERE ARE ANY CARDS IN ACTIVE GROUP DO NOT DISPLAY MESSAGE BELOW
    wordView.render(model.state);

    // render message instruction but only before first card
    if (model.state.card.cards.length === 0)
      //clear any message already rendered
      cardsView.renderMessage(
        'Please select any part of speech and click small "+" button on the right to add card into group!'
      );

    //4. Add word and query into search object
    model.saveSearchedWord(model.state.word);

    wordView.addHandlerClick(controlClickPartOfSpeech);
  } catch (err) {
    wordView.renderMessageError();
  }
};

const controlClickPartOfSpeech = function (markPartClicked) {
  //reset data

  model.resetClickObject();

  model.saveClickedData(markPartClicked);

  wordClickView.render(model.state);
  //TODO move handlers into init function
  wordView.addHandlerClick(controlClickPartOfSpeech);

  wordClickView.handleClickPlusBtn(controlAddNewCard);
};

const controlClickCreateNewGroup = async function () {
  try {
    //0. hide createGroup form and initial create new Group
    groupNavView.toggleShowHiddenForm();
    initialCreateNewGroupView.clear();
    //1. get new created group name
    const group = groupNavView.getNewGroup();
    if (!group) return;

    //2. create obj with future cards inside
    model.createObjGroup(group);

    //3. clear cards by render message
    initialCreateNewGroupView.renderMessage('New group created!');
    // cardsView.renderMessage();
    setTimeout(() => initialCreateNewGroupView.clear(), MODAL_CLOSE_SEC * 1000);

    //4. render spinner load
    groupBarView.renderSpinner();

    //5. render group-bar navigation
    groupBarView.render(model.state.group.activeGroup);

    //6. change Id in URL
    window.history.pushState(null, '', `#${group}`);
    model.persistGroups();

    //7.update list cards for future change
    model.updateNewListCards(group);

    controlLoadAllCardsFromGroup(group);
  } catch (err) {}
};
const controlShowRenameGroupFromBar = function () {
  //hide other form
  groupNavView.hideCreateForm();
  //show rename form
  groupNavView.toggleShowHiddenRenameForm();
};

const controlChangeView = function () {
  model.toggleActiveList();
  //8 reset list page to 1
  model.calculatePages();
  model.updateNewListCards(model.state.group.activeGroup);
  if (model.state.list.active) {
    controlListPagination(1);
    listView.render(model.state.list);
  } else controlLoadAllCardsFromGroup(model.state.group.activeGroup);
};
////////////////////////////////
const controlAddNewCard = function () {
  model.createObjCard();
  //1. reset footer page start
  model.state.card.page = 1;
  //2. load new card
  if (!model.isAnyGroupCreated()) {
    groupBarView.render('default');
    // window.history.pushState(null, '', `default`);
    controlLoadAllCardsFromGroup('default');
    model.state.group.activeGroup = 'default';
  }
  const newCard = model.loadNewCard();
  const activeGroup = newCard.groupName;

  if (model.isListViewActive(activeGroup)) {
    controlLoadAllCardsFromGroup(activeGroup);
  }
  const allPreviousCards = [...model.loadAllCardsFromGroup(activeGroup)];

  //3.prevent to add the same card
  if (allPreviousCards.length > 0) {
    if (allPreviousCards.some(card => !model.isCardUnique(card, newCard))) {
      groupMessageView.renderMessage(
        `There is already  "${newCard.name.toUpperCase()}" word in "${activeGroup.toUpperCase()}" group! Try another one`
      );
      setTimeout(() => groupMessageView.clear(), MODAL_CLOSE_SEC * 2000);
      // createWordView.toggleWindow();
      return;
    } else {
      model.addNewCardIntoList(newCard);
    }
    // groupMessageView.render();
  }

  model.state.card.cards.push(newCard);
  //b. add card next to previous one
  cardsView.renderCard(model.getCardResultsPage(newCard));

  //5.change ID in URL
  window.history.pushState(null, '', `#${activeGroup}`);

  //6. save card into group
  model.saveCardIntoCorrectGroup(newCard);

  //7. Display success message
  // initialCreateNewGroupView.renderMessage(
  //   'New word was successfully created :)'
  // );

  // //8. hide success message
  // setTimeout(() => initialCreateNewGroupView.clear(), MODAL_CLOSE_SEC * 1000);
  groupMessageView.renderMessage('New word was successfully created :)');
  setTimeout(() => groupMessageView.clear(), MODAL_CLOSE_SEC * 2000);
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

  ////////////////
  model.updateNewListCards(model.state.group.activeGroup);
  //////////////

  //2. check which group render again default or active
  if (model.state.group.activeGroup) {
    controlLoadAllCardsFromGroup(model.state.group.activeGroup);
  } else {
    controlLoadAllCardsFromGroup('default');
  }
};

const controlShowCreateGroupForm = function () {
  //show create form
  groupNavView.toggleShowHiddenForm();
};

//THIS IS A PLUS BTN
const controlShowNewGroupFormFromBar = function () {
  //   //hide other form
  groupNavView.hideRenameForm();
  groupNavView.toggleShowHiddenForm();
};

const controlLoadAllGroups = function () {
  allGroupsView.render(model.state.group.groups);
};
const controlLoadBar = function (group) {
  //check if there is any group created
  if (model.state.group.groups.length > 0) groupBarView.render(group);
};

const controlCardPagination = function (cardId, goToPage) {
  //1.find card where user click page btn
  const cardToChange = model.state.card.cards.filter(
    card => card.id === cardId
  );

  //2.update body and footer of selected card
  cardsView.updateMarkup(model.getCardResultsPage(cardToChange[0], goToPage));

  // } else return
};
const controlListPagination = function (goToPage) {
  listView.render(model.getListResultsPage(goToPage));
  listView.updateFooter(model.getListResultsPage(goToPage));
};

const welcomeBack = function () {
  initialCreateNewGroupView.clear();
  const activeGroup = model.state.group.activeGroup
    ? model.state.group.activeGroup
    : '';

  // if (!lastGroup) {
  if (!activeGroup) {
    //TODO if there is a better way to reset url do it!
    initialCreateNewGroupView.render();
    window.history.pushState(null, '', `#${''}`);
    return;
  }

  //load all cards from groups into cards array  to be able change page on each card

  model.state.card.cards = model.state.group.groups.flatMap(group =>
    model.loadAllCardsFromGroup(group.groupName)
  );

  //render all cards and group name in group bar navigation
  //OLD VERSION
  groupBarView.render(activeGroup);
  controlLoadAllCardsFromGroup(activeGroup);
  appInfoView.renderMessage('Welcome back :)');
  // allGroupsView.render(model.state.group.groups);
  setTimeout(() => appInfoView.render(''), MODAL_CLOSE_SEC * 1000);

  model.updateNewListCards(activeGroup);
};
const welcome = function () {
  initialCreateNewGroupView.render();
  if (!model.isAnyGroupCreated())
    cardsView.renderMessage(
      'No group created. All cards will be added into default group. Please create new group to prevent that and then add your words inside'
    );
  // setTimeout(() => cardsView.clear(), MODAL_CLOSE_SEC * 3000);
};

const controlAddWord = function (newWord) {
  if (!model.isAnyGroupCreated()) {
    groupBarView.render('default');

    // window.history.pushState(null, '', `default`);
    controlLoadAllCardsFromGroup('default');
    model.state.group.activeGroup = 'default';
  }

  //1. Upload the new word data
  const newCard = model.uploadWord(newWord);
  const activeGroup = newCard.groupName;

  if (model.isListViewActive(activeGroup)) {
    controlLoadAllCardsFromGroup(activeGroup);
  }

  const allPreviousCards = [...model.loadAllCardsFromGroup(activeGroup)];

  //3.prevent to add the same card
  if (allPreviousCards.length > 0) {
    if (allPreviousCards.some(card => !model.isCardUnique(card, newCard))) {
      groupMessageView.renderMessage(
        `There is already  "${newCard.name.toUpperCase()}" word in "${activeGroup.toUpperCase()}" group! Try another one`
      );
      setTimeout(() => groupMessageView.clear(), MODAL_CLOSE_SEC * 2000);
      // createWordView.toggleWindow();
      return;
    } else {
      model.addNewCardIntoList(newCard);
    }
    // groupMessageView.render();
  }

  //4. Render new created word
  model.state.card.cards.push(newCard);

  //b. add card next to previous one
  cardsView.renderCard(model.getCardResultsPage(newCard));

  //5.change ID in URL
  window.history.pushState(null, '', `#${activeGroup}`);

  //6. save card into group
  model.saveCardIntoCorrectGroup(newCard);

  //7. Display success message
  initialCreateNewGroupView.renderMessage(
    'New word was successfully created :)'
  );

  //8. hide success message
  setTimeout(() => initialCreateNewGroupView.clear(), MODAL_CLOSE_SEC * 1000);

  //9. Close form window
  createWordView.toggleWindow();
};

const controlRenameGroup = function () {
  //get old name of the group
  const oldName = window.location.hash.slice(1);

  //get new name from the rename form
  const newName = groupNavView.getNewName();

  //replace old name with new name
  model.saveGroupAsActive(newName);

  const index = model.findGroupsIndex(oldName);
  const groups = model.state.group.groups;
  const oldGroup = groups[index];
  if (!oldGroup) {
    groupBarView.render(newName);
    window.history.pushState(null, '', `#${newName}`);
    return;
  }
  oldGroup.groupName = newName;

  oldGroup.cards.map(card => (card.groupName = newName));
  // model.state.group.groups.splice(index, 0, oldGroup);

  window.history.pushState(null, '', `#${newName}`);

  groupBarView.render(newName);

  model.persistGroups();
  initialCreateNewGroupView.renderMessage(
    'Success! You have just renamed your group'
  );
  // cardsView.renderMessage();
  setTimeout(() => initialCreateNewGroupView.clear(), MODAL_CLOSE_SEC * 1000);
};
const controlDeleteGroup = function () {
  //find active group
  groupNavView.toggleShowHiddenConfirmForm();
};
const controlLoadSelectedGroup = function (goToGroup) {
  //1. save the name of the selected group
  const group = goToGroup;

  if (!group) return;
  //2. close modal window
  allGroupsView.addHandlerPreview();
  //3.change activeGroup to be able deleting cards
  // model.state.group.activeGroup = group;
  model.saveGroupAsActive(group);

  //change listActive flag(I want to always render cards not list of definitions!)
  model.state.list.active = false;

  //4. render all cards from selected group
  controlLoadAllCardsFromGroup(group);
  //5. render bar navigation
  groupBarView.render(group);
  model.persistGroups();
  //6 render  sorted alphabetically print list

  const cards = model.saveAndGetNewListCards(goToGroup);

  // 7 render message if there is no cards
  if (cards.length === 0) {
    // listView.clear();
    cardsView.renderMessageError(
      `There is no cards in this group! Try to add some...)`
    );
    setTimeout(() => cardsView.clear(), MODAL_CLOSE_SEC * 2000);
    return;
  }

  // ``;
  // ////////////////////
  model.calculatePages();
};

const controlSortCards = function () {
  // get all cards from active group
  if (model.state.list.active) return;
  const activeGroup = model.state.group.activeGroup;
  const cards = model.loadAllCardsFromGroup(model.state.group.activeGroup);
  model.sortCards(cards);

  //display spinner
  cardsView.renderSpinner();

  //replace cards in state object
  const index = model.findGroupsIndex(activeGroup);
  model.state.group.groups[index].cards = cards;

  //clear spinner
  cardsView.clear();

  //render sorted cards
  cards.map(card => cardsView.renderCard(card));
};

const controlPrintCards = function (printDiv) {
  // window.location = 'printCards.html';
  model.printDiv(printDiv);
  // window.print();
  location.reload();

  //
};
const controlPrintList = function (printDiv) {
  // calculate all pages to print everything ;
  model.state.list.listResultsPerPage = model.state.list.results.length;

  model.calculatePages();

  listView.render(model.getListResultsPage());
  model.printDiv(printDiv);
  location.reload();
};
const controlConfirm = function () {
  groupNavView.toggleShowHiddenConfirmForm();
  groupNavView.hideRenameForm();
  groupNavView.hideCreateForm();
  const index = model.findGroupsIndex(model.state.group.activeGroup);

  // delete it
  model.state.group.groups.splice(index, 1);

  //change active group
  if (model.state.group.groups.length > 0) {
    model.state.group.activeGroup =
      model.state.group.groups[model.state.group.groups.length - 1].groupName;
  } else {
    model.state.group.activeGroup = '';
    groupBarView.clear();
    initialCreateNewGroupView.render();
    window.history.pushState(null, '', `#${''}`);
    cardsView.clear();
  }
  //load all groups in modal view
  controlLoadAllGroups();

  //load all cards from last group
  controlLoadAllCardsFromGroup(model.state.group.activeGroup);

  //change navigation with proper name group
  groupBarView.addHandlerRender(controlLoadBar(model.state.group.activeGroup));

  //reset url
  window.history.pushState(null, '', `#${model.state.group.activeGroup}`);

  //reset listView
  model.state.list.active = false;
  model.persistGroups();
  initialCreateNewGroupView.renderMessage(
    'Success! You have just deleted your group'
  );
  // cardsView.renderMessage();
  setTimeout(() => initialCreateNewGroupView.clear(), MODAL_CLOSE_SEC * 1000);
};

const controlResign = function () {
  groupNavView.toggleShowHiddenConfirmForm();
};

const init = function () {
  welcome();
  welcomeBack();
  searchView.addHandlerSearch(controlSearchWords);
  initialCreateNewGroupView.addHandlerClick(controlShowCreateGroupForm);
  groupNavView.addHandlerCreateGroup(controlClickCreateNewGroup);
  groupNavView.addHandlerRenameGroup(controlRenameGroup);
  cardsView.addHandlerPlay(controlPlayAudio);
  cardsView.addHandlerClose(controlDeleteCard);
  cardsView.addHandlerPage(controlCardPagination);
  groupBarView.addHandlerShowNewGroupForm(controlShowNewGroupFormFromBar);
  groupBarView.addHandlerShowRenameGroupForm(controlShowRenameGroupFromBar);
  groupBarView.addHandlerChangeView(controlChangeView);
  allGroupsView.addHandleClick(controlLoadAllGroups);
  allGroupsView.addHandlerLoadSelectedGroup(controlLoadSelectedGroup);
  createWordView.addHandlerUpload(controlAddWord);
  groupBarView.addHandlerDeleteGroup(controlDeleteGroup);
  groupBarView.addHandlerSortCards(controlSortCards);
  groupBarView.addHandlerPrintCards(controlPrintCards);
  listView.addHandlerPage(controlListPagination);
  listView.addHandlerPrintList(controlPrintList);
  confirmView.addHandlerYes(controlConfirm);
  confirmView.addHandlerNo(controlResign);
};
init();
//TODO PREVENT FROM CREATING GROUP WITH THE SAME NAME
