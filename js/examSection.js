import {arrayQuestions, legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';


//* -------------------- CONSTANTS -------------------- */
const fieldTests = document.querySelector('#field-tests');
const fieldNumQuest = document.querySelector('#num-quest-current');
const questionText = document.querySelector('#questionText');
const fieldFinalScore = document.querySelector('#final-result');
const nameSectionText = document.querySelector('#name-section-text');
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
let randomQuestions = []; // устонавливает вопроссы из определенной секции
//* --------------------------------------------------- */
 

//* -------------------- FUNCTIONS -------------------- */
/* рандомно вытаскивает два вопросса */
const randomQuest = (num, num2) => {
  let newArr = Array(num).fill().map((e, i) => i)
  for (let i = newArr.length - 1; i > 0; i--) {
     let j = Math.floor(Math.random() * (i + 1));
     [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
   }
  return newArr.splice(0, num2)
}
/* перемешивает массив */
const shuffle = (newArr) => {
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
/* формирует десять вопросов (по два из каждого раздела) и перемешивает их в случайном порядке */
const generation10QuestionsFromAllSections = () => {
  let questionSection = [];

  for (let i = 0; i < arrayQuestions.length; i++) {
    let arrLength = arrayQuestions[i].length;
    let quest = [];
    if (arrLength <= 20) {
      quest = randomQuest(arrLength, 1)
      for (let j = 0; j < 1; j++) {
        questionSection.push(arrayQuestions[i][quest[j]]);
      }
    }
    if (arrLength > 20 && arrLength <= 50) {
      quest = randomQuest(arrLength, 2)
      for (let j = 0; j < 2; j++) {
        questionSection.push(arrayQuestions[i][quest[j]]);
      }
    }
    if (arrLength > 50) {
      quest = randomQuest(arrLength, 3)
      for (let j = 0; j < 3; j++) {
        questionSection.push(arrayQuestions[i][quest[j]]);
      }
    }
    console.log(quest);
    console.log(quest[0]);
    console.log(quest[1]);
  }

  randomQuestions = shuffle(questionSection);
}
/* присвваеваем текст к названию секции, вопроссу и ответам */
const fillsQAWithText = () => {
  questionText.textContent = randomQuestions[indexQuest].question;
  nameSectionText.textContent = randomQuestions[indexQuest].answers[0].id;
  collectionAnswers.forEach((elem, index) => {
    elem.textContent = randomQuestions[indexQuest].answers[index].value;
  });
}
/* устонавливает стартовое значение для номера вопросса */
const startQuestNum = () => {
  fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
}
/* посчитывает количество правельных ответов */
const scoreCalc = () => {
  if(recordedAnswer == true) {
    countCorrectAnswers++;
  }
  else if (numQuest == randomQuestions.length+1) {
    return;
  }
  // console.log(recordedAnswer)
  // console.log(countCorrectAnswers)
}
/* показывает номер вопросса */
const showQuestionNumber = () => {
  numQuest++;
  if (numQuest <= randomQuestions.length) {
    fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
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
  if (numQuest == randomQuestions.length) {
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
  randomQuestions = []; // сбрасывает ранее заполненный массив с вопросами
  generation10QuestionsFromAllSections(); // формирует десять вопросов (по два из каждого раздела) и перемешивает их в случайном порядке
  btnNext.style.display = 'block';
  btnResult.style.display = 'none';
  btnRestart.style.display = 'none';
  fieldFinalScore.textContent = '';
  numQuest = 0; // номер вопросса
  indexQuest = 0; // индекс вопросса
  countCorrectAnswers = 0; // количество правельных ответов
  showQuestionNumber(); // показывает номер вопросса
  checkedOff(); // убирает состояние checked с каждого элемента
  fillsQAWithText(); // присвваеваем текст к вопроссу и ответам
}
//* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener('load', generation10QuestionsFromAllSections);
window.addEventListener('load', fillsQAWithText);
window.addEventListener('load', startQuestNum);
collectionAnswers.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    recordedAnswer = randomQuestions[indexQuest].answers[index].correct;
  })
});
btnNext.addEventListener('click', moveNextQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
//* --------------------------------------------------- */

export {fieldTests};