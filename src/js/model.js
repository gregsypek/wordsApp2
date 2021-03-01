export const state = {
  word: {},
};

export const loadWord = async function (id) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en_US/${id}`
    );

    const [data] = await res.json();

    console.log(data);

    if (data.word === 'undefined')
      throw new Error('No results or empty search');

    const word = data;
    state.word = {
      word: word.word,
      meanings: word.meanings,
      phonetics: word.phonetics[0].text,
      audio: word.phonetics[0].audio,
    };
    console.log(state.word);
  } catch (err) {
    console.error(err);
  }
};
