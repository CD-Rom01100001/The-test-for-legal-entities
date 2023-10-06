import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';


//* -------------------- CONSTANTS -------------------- */
const fieldTests = document.querySelector('#field-tests');
const fieldNumQuest = document.querySelector('#num-quest-current');
const questionText = document.querySelector('#questionText');
const fieldFinalScore = document.querySelector('#final-result');
const collectionAnswers = document.querySelectorAll('.question-answers__answers-answer');
const collectionRadio = document.querySelectorAll('.question-answers__answers-radio');
const btnNext = document.querySelector('#btn-next');
const btnResult = document.querySelector('#btn-result');
const btnRestart = document.querySelector('#btn-restart');
//* --------------------------------------------------- */


//* -------------------- VARIABLES -------------------- */
let numQuest = 1; // номер вопросса
let indexQuest = 0; // индекс вопросса
let recordedAnswer = ''; // устонавливает true или false
let countCorrectAnswers = 0; // количество правельных ответов
let questionSection = useOfSpecialTools20; // устонавливает вопроссы из определенной секции
//* --------------------------------------------------- */


//* -------------------- FUNCTIONS -------------------- */
/* присвваеваем текст к вопроссу и ответам */
const fillsQAWithText = () => {
  questionText.textContent = questionSection[indexQuest].question;
  collectionAnswers.forEach((elem, index) => {
    elem.textContent = questionSection[indexQuest].answers[index].value;
  });
}
/* устонавливает стартовое значение для номера вопросса */
const startQuestNum = () => {
  fieldNumQuest.textContent = `${numQuest}/${questionSection.length}`;
}
/* посчитывает количество правельных ответов */
const scoreCalc = () => {
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
const showQuestionNumber = () => {
  numQuest++;
  if (numQuest <= questionSection.length) {
    fieldNumQuest.textContent = `${numQuest}/${questionSection.length}`;
  }
}
/* убирает состояние checked с каждого элемента */
const checkedOff = () => {
  collectionRadio.forEach((elem) => {
    elem.checked = false;
  });
}
/* при нажатии на кнопку далее */
const moveNextQuestion = () => {
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
const moveResult = () => {
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
const restartResults = () => {
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
//* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener('load', fillsQAWithText);
window.addEventListener('load', startQuestNum);
collectionAnswers.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    recordedAnswer = questionSection[indexQuest].answers[index].correct;
  })
});
btnNext.addEventListener('click', moveNextQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
//* --------------------------------------------------- */


export {fieldTests};