import View from './View.js';

class GroupView extends View {
  _parentElement = document.querySelector('.main__cards');

  _generateMarku() {
    return `
       <div class="main__card">
        <div class="main__card-nav">
          <h3 class="card__word">Apple</h3>
          <img
            src="https://etutor-images-common.s3.eu-central-1.amazonaws.com/en/transcriptions/apple.png"
            alt=""
            class="card__phonetic"
            tabindex="-1"
          />
          <div class="card__btns">
            <button class="main__btn main__btn--edit">
              <svg class="bar__icon">
                <use href="./src/img/icons.svg#icon-megaphone"></use>
              </svg>
            </button>
            <button class="main__btn main__btn--edit">
              <svg class="bar__icon">
                <use href="./src/img/icons.svg#icon-cross"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="main__card-body">
          <div class="card__explanation">
            <span class="card__explanation--nr">1</span>
            <span class="card__explanation--word">jabłko</span>
            <span class="card__explanation--role">rzeczownik</span>
          </div>
          <div class="card__sentance">
            <p>I'll just have an apple. (Po prostu zjem jabłko.)</p>
          </div>
        </div>
        <div class="main__card-footer">
          <button class="btn more__btn">More</button>
        </div>
      </div>
    `;
  }
}

export default new GroupView();
