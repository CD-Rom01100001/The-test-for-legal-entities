import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';
import {fieldQuestionsMain, fieldQuestionList} from './questionSection.js';
import {fieldTests} from './examSection.js';


//* -------------------- CONSTANTS -------------------- */
const btnNavLinkCollection = document.querySelectorAll('.nav-link');
const btnQuestionSection = document.querySelector('#navigation__questions');
const btnTrainingSection = document.querySelector('#navigation__training');
const btnExamSection = document.querySelector('#navigation__exam');
const btnArrowTop = document.querySelector('#arrow-top');
const titleSection = document.querySelector('#title-section');
const descriptionSectionCollection = document.querySelectorAll('.staff-training__descriotion-text');
//* --------------------------------------------------- */


//* -------------------- FUNCTIONS -------------------- */
/* прокрутка вверх */
const scrollTop = () => {
  if (window.scrollY > document.documentElement.clientHeight) {
    btnArrowTop.classList.add('arrow-top--show');
  } else {
    btnArrowTop.classList.remove('arrow-top--show');
  }
}
/* меняет стили закладок навигации */
const styleLinksNav = (link) => {
  btnNavLinkCollection.forEach(elem => {
    elem.classList.remove('nav-link--active');
  })
  link.classList.add('nav-link--active');
}
/* меняет содержимое на вопросы */
const questionContent = () => {
  titleSection.textContent = 'Вопросы';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index == 2) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none')
    }
  });
  fieldQuestionsMain.classList.remove('field-questions--display--none');
  fieldQuestionList.classList.remove('questions-list--display--none');
  fieldTests.classList.add('tests--display--none');
}
/* меняет содержимое на экзамены */
const examsContent = () => {
  titleSection.textContent = 'Экзамен';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 2) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none')
    }
  });
  fieldQuestionsMain.classList.add('field-questions--display--none');
  fieldQuestionList.classList.add('questions-list--display--none');
  fieldTests.classList.remove('tests--display--none');
}
//* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener("scroll", scrollTop);
btnNavLinkCollection.forEach(elem => {
  elem.addEventListener('click', () => styleLinksNav(elem));
})
btnQuestionSection.addEventListener('click', questionContent);
btnExamSection.addEventListener('click', examsContent);
//* --------------------------------------------------- */
