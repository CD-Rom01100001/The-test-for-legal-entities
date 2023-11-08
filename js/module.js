import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';
import {fieldQuestionsMain, fieldQuestionList} from './questionSection.js';
import {fieldTests, fieldStartExam, timeReportVar, fieldFinalScore} from './examSection.js';


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
//* меняет стили закладок навигации */
const styleLinksNav = (link) => {
  btnNavLinkCollection.forEach(elem => {
    elem.classList.remove('nav-link--active');
  })
  link.classList.add('nav-link--active');
}
//* меняет содержимое на вопросы */
const questionContent = () => {
  titleSection.textContent = 'Вопросы';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 0 && index != 1) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none');
    }
  });
  fieldQuestionsMain.classList.remove('field-questions--display--none');
  fieldQuestionList.classList.remove('questions-list--display--none');
  fieldStartExam.classList.remove('field-start-exam--display--block');
  fieldTests.classList.remove('tests--display--block'); // закрывает блок с тестами
  clearInterval(timeReportVar); // останавливает время в тестах
}
//* меняет содержимое на обучение
const trainingContent = () => {
  titleSection.textContent = 'Обучение';
  descriptionSectionCollection.forEach((elem, index) => {
    if (index != 3) {
      elem.classList.add('staff-training__descriotion-text--display--none');
    } else {
      elem.classList.remove('staff-training__descriotion-text--display--none')
    }
  });
  fieldQuestionsMain.classList.add('field-questions--display--none');
  fieldQuestionList.classList.add('questions-list--display--none');
  fieldStartExam.classList.remove('field-start-exam--display--block');
  fieldTests.classList.remove('tests--display--block'); // закрывает блок с тестами
  clearInterval(timeReportVar); // останавливает время в тестах
}
//* меняет содержимое на экзамены */
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
  /* если тест запущен то кнопка "Начать экзамен" больше не появится */
  if (fieldTests.classList.contains('tests--display--block') == false) {
    fieldStartExam.classList.add('field-start-exam--display--block');
  }
}
//* при условии, что открыты тесты и не нажата кнопка "результат" */
const exitWarning = (navLink) => {
  if (fieldTests.classList.contains('tests--display--block') && fieldFinalScore.textContent == 0) {
    let warning = confirm("Если вы покините тест, то все результаты будут сброшены!\nХотите продолжить?");
    if (warning == true) {
      navLink();
    } else {
      btnNavLinkCollection.forEach((elem, index) => {
        elem.classList.remove('nav-link--active');
        if (index == 2) elem.classList.add('nav-link--active');
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
btnExamSection.addEventListener('click', examsContent);
//* --------------------------------------------------- */
