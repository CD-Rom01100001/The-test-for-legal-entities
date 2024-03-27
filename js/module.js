import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';
import {fieldQuestionsMain, fieldQuestionList} from './questionSection.js';
import {fieldTrainingMain, openPrewiewOnSiteLoad} from './trainingSection.js';
import { previewBlock, trainingBlock, restartResults } from './trainingSection.js';
import {fieldTests, fieldStartExam, timeReportVar, fieldFinalScore} from './examSection.js';// import * as say from './examSection.js' (say.fieldTests)



//* -------------------- CONSTANTS -------------------- */
const btnNavLinkCollection = document.querySelectorAll('.nav-link');
const btnQuestionSection = document.querySelector('#navigation__questions');
const btnTrainingSection = document.querySelector('#navigation__training');
const btnExamSection = document.querySelector('#navigation__exam');
const btnArrowTop = document.querySelector('#arrow-top');
const titleSection = document.querySelector('#title-section');
const descriptionSectionCollection = document.querySelectorAll('.staff-training__descriotion-text');
const staffTrainingDescription = document.querySelector('.staff-training__descriotion');
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
//* меняет стили закладок навигации */
const styleLinksNav = (link) => {
  btnNavLinkCollection.forEach(elem => {
    elem.classList.remove('nav-link--active');
  })
  link.classList.add('nav-link--active');
}
//* меняет содержимое на Вопросы */
const questionContent = () => {
  titleSection.textContent = 'Вопросы';
  if (staffTrainingDescription.style.display == 'none') staffTrainingDescription.style.display = 'block';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 0 && index != 1) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none');
    }
  });
  fieldQuestionsMain.classList.remove('field-questions--display--none');
  fieldQuestionList.classList.remove('questions-list--display--none');
  fieldTrainingMain.classList.add('training-main--display--none');
  fieldStartExam.classList.remove('field-start-exam--display--block');
  fieldTests.classList.remove('tests--display--block'); // закрывает блок с тестами
  clearInterval(timeReportVar); // останавливает время в тестах
}
//* меняет содержимое на Обучение
const trainingContent = () => {
  titleSection.textContent = 'Обучение';
  if (staffTrainingDescription.style.display == 'none') staffTrainingDescription.style.display = 'block';
  openPrewiewOnSiteLoad();// разблокирует превьюшки при загрузке сайта
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 3) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none');
    }
  });
  fieldQuestionsMain.classList.add('field-questions--display--none');
  fieldQuestionList.classList.add('questions-list--display--none');
  fieldTrainingMain.classList.remove('training-main--display--none');
  fieldStartExam.classList.remove('field-start-exam--display--block');
  fieldTests.classList.remove('tests--display--block'); // закрывает блок с тестами
  clearInterval(timeReportVar); // останавливает время в тестах
}
//* меняет содержимое на Экзамены */
const examsContent = () => {
  titleSection.textContent = 'Экзамен';
  if (staffTrainingDescription.style.display == 'none') staffTrainingDescription.style.display = 'block';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 2) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none')
    }
  });
  fieldQuestionsMain.classList.add('field-questions--display--none');
  fieldQuestionList.classList.add('questions-list--display--none');
  fieldTrainingMain.classList.add('training-main--display--none');
  /* если тест запущен то кнопка "Начать экзамен" больше не появится */
  if (fieldTests.classList.contains('tests--display--block') == false) {
    fieldStartExam.classList.add('field-start-exam--display--block');
  }
}
//* при условии, что открыты тесты и не нажата кнопка "результат" или что открыт блок обучение */
const exitWarning = (navLink) => {
  if (fieldTests.classList.contains('tests--display--block') && fieldFinalScore.style.displey === 'none') {
    let warning = confirm("Если вы покините тест, то все результаты будут сброшены!\nХотите продолжить?");
    if (warning == true) {
      navLink();
    } 
    else {
      btnNavLinkCollection.forEach((elem, index) => {
        elem.classList.remove('nav-link--active');
        if (index == 2) elem.classList.add('nav-link--active');
      })
      return;
    }
  } 
  if (trainingBlock.style.display == 'block') {
    let warning = confirm("Если вы покините \"Обучение\", то все результаты будут сброшены!\nХотите продолжить?");
    if (warning == true) {
      trainingBlock.style.display = 'none';
      previewBlock.style.display = 'flex';
      staffTrainingDescription.style.display = 'block';
      navLink();
      restartResults();// сбрасывает все результаты в обучении
    } 
    else {
      btnNavLinkCollection.forEach((elem, index) => {
        elem.classList.remove('nav-link--active');
        if (index == 1) elem.classList.add('nav-link--active');
      })
      return;
    }
  } 
  else {
    navLink();
  }
}

//* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener("scroll", scrollTop);
btnNavLinkCollection.forEach(elem => {
  elem.addEventListener('click', () => styleLinksNav(elem));
})
btnQuestionSection.addEventListener('click', () => exitWarning(questionContent));
btnTrainingSection.addEventListener('click', () => exitWarning(trainingContent));
btnExamSection.addEventListener('click', () => exitWarning(examsContent));
//* --------------------------------------------------- */

export {staffTrainingDescription};
