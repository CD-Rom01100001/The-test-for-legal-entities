import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';
import {questioning, fieldQuestions} from './questionStudy.js';

const fieldNumQuest = document.querySelector('#num-quest-current');
const fieldFinalScore = document.querySelector('#final-result');
const collectionAnswers = document.querySelectorAll('.question-answers__answers-answer');
const collectionRadio = document.querySelectorAll('.question-answers__answers-radio');
const btnNext = document.querySelector('#btn-next');
const btnResult = document.querySelector('#btn-result');
const btnRestart = document.querySelector('#btn-restart');

const collectionSectionLinks = document.querySelectorAll('.questions-list__section-link');

let numQuest = 1; // номер вопросса
let indexQuest = 0; // индекс вопросса
let recordedAnswer = ''; // устонавливает true или false
let countCorrectAnswers = 0; // количество правельных ответов
let questionSection = tacticalSpecialtyTraining10; // устонавливает вопроссы из определенной секции

/* присвваеваем текст к вопроссу и ответам */
function fillsQAWithText() {
  questionText.textContent = questionSection[indexQuest].question;
  collectionAnswers.forEach((elem, index) => {
    elem.textContent = questionSection[indexQuest].answers[index].value;
  });
}
/* устонавливает стартовое значение для номера вопросса */
function startQuestNum() {
  fieldNumQuest.textContent = `${numQuest}/${questionSection.length}`;
}
/* посчитывает количество правельных ответов */
function scoreCalc() {
  if(recordedAnswer == true) {
    countCorrectAnswers++;
  }
  else if (numQuest == questionSection.length+1) {
    return;
  }
  console.log(recordedAnswer)
  console.log(countCorrectAnswers)
}
/* показывает номер вопросса */
function showQuestionNumber() {
  numQuest++;
  if (numQuest <= questionSection.length) {
    fieldNumQuest.textContent = `${numQuest}/${questionSection.length}`;
  }
}
/* убирает состояние checked с каждого элемента */
function checkedOff() {
  collectionRadio.forEach((elem) => {
    elem.checked = false;
  });
}
/* при нажатии на кнопку далее */
function moveNextQuestion() {
  indexQuest++;
  showQuestionNumber();
  checkedOff();
  fillsQAWithText();
  scoreCalc();
  recordedAnswer = ''; // очищает переменную ()
  if (numQuest == questionSection.length) {
    btnNext.style.display = 'none';
    btnResult.style.display = 'block';
    return;
  }
  
}
/* при нажатии на кнопку результат */
function moveResult() {
  indexQuest++;
  scoreCalc();
  btnRestart.style.display = 'block';
  btnResult.style.display = 'none';
  if (countCorrectAnswers >= 9) {
    fieldFinalScore.textContent = `Вы прошли! Ваша оценка: ${countCorrectAnswers}`;
  } 
  else {
    fieldFinalScore.textContent = `Вы не прошли! Ваша оценка: ${countCorrectAnswers}`;
  }
}
/* сбрасывает все результаты */
function restartResults() {
  btnNext.style.display = 'block';
  btnResult.style.display = 'none';
  btnRestart.style.display = 'none';
  fieldFinalScore.textContent = '';
  numQuest = 0; // номер вопросса
  indexQuest = 0; // индекс вопросса
  countCorrectAnswers = 0; // количество правельных ответов
  showQuestionNumber();
  checkedOff();
  fillsQAWithText();
}

window.addEventListener('load', startQuestNum);
window.addEventListener('load', fillsQAWithText);
collectionAnswers.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    recordedAnswer = questionSection[indexQuest].answers[index].correct;
  })
});
btnNext.addEventListener('click', moveNextQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
collectionSectionLinks.forEach(elem => {
  if (elem.id == 'legal-training-80') { 
    elem.addEventListener('click', () => {
      fieldQuestions.innerHTML = '';
      questioning(legalTraining80);
      document.querySelector('.field-questions__body-section-title').textContent = `Вопроссы ${elem.textContent}`;
    })
  }else if (elem.id == 'tactical-specialty-training-10') {
    elem.addEventListener('click', () => {
      console.log(elem);fieldQuestions.innerHTML = '';
      questioning(tacticalSpecialtyTraining10);
      document.querySelector('.field-questions__body-section-title').textContent = `Вопроссы ${elem.textContent}`;
    })
  }else if (elem.id == 'first-aid-50') {
    elem.addEventListener('click', () => {
      fieldQuestions.innerHTML = '';
      questioning(firstAid50);
      document.querySelector('.field-questions__body-section-title').textContent = `Вопроссы ${elem.textContent}`;
    })
  }else if (elem.id == 'use-of-special-tools-20') {
    elem.addEventListener('click', () => {
      fieldQuestions.innerHTML = '';
      questioning(useOfSpecialTools20);
      document.querySelector('.field-questions__body-section-title').textContent = `Вопроссы ${elem.textContent}`;
    })
  }else if (elem.id == 'firearms-training-84') {
    elem.addEventListener('click', () => {
      fieldQuestions.innerHTML = '';
      questioning(firearmsTraining84);
      document.querySelector('.field-questions__body-section-title').textContent = `Вопроссы ${elem.textContent}`;
    })
  }
})
