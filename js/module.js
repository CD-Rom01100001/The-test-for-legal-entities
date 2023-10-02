import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';
import {questioning} from './questionStudy.js';

const fieldNumQuest = document.querySelector('#num-quest-current');
const fieldFinalScore = document.querySelector('#final-result');
const colletionAnswers = document.querySelectorAll('.question-answers__answers-answer');
const colletionRadio = document.querySelectorAll('.question-answers__answers-radio');
const btnNext = document.querySelector('#btn-next');
const btnResult = document.querySelector('#btn-result');
const btnRestart = document.querySelector('#btn-restart');

const btnLegalTraining80 = document.querySelector('#legal-training-80');
const btnTactical10 = document.querySelector('#tactical-specialty-training-10');
const btnFirstAid50 = document.querySelector('#first-aid-50');
const btnSpecialTools20 = document.querySelector('#use-of-special-tools-20');
const btnFirearms84 = document.querySelector('#firearms-training-84');

let numQuest = 1; // номер вопросса
let indexQuest = 0; // индекс вопросса
let recordedAnswer = ''; // устонавливает true или false
let countCorrectAnswers = 0; // количество правельных ответов
let questionSection = tacticalSpecialtyTraining10; // устонавливает вопроссы из определенной секции

/* присвваеваем текст к вопроссу и ответам */
function fillsQAWithText() {
  questionText.textContent = questionSection[indexQuest].question;
  colletionAnswers.forEach((elem, index) => {
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
  colletionRadio.forEach((elem) => {
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
colletionAnswers.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    recordedAnswer = questionSection[indexQuest].answers[index].correct;
  })
});
btnNext.addEventListener('click', moveNextQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
btnTactical10.addEventListener('click', questioning);

console.log(questionSection[0].question);
