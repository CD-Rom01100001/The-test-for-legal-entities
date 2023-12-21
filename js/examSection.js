import {arrayQuestions, legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';


//* -------------------- CONSTANTS -------------------- */
const fieldTests = document.querySelector('#field-tests');
const btnStartTest = document.querySelector('#button-start-exam');
const fieldStartExam = document.querySelector('.field-start-exam');
const fieldNumQuest = document.querySelector('#num-quest-current');
const fieldQuestionAnswer = document.querySelector('#field-question-answers');
const questionText = document.querySelector('#questionText');
const fieldFinalScore = document.querySelector('#final-result');
const nameSectionText = document.querySelector('#name-section-text');
const collectionAnswersBody = document.querySelectorAll('.question-answers__answers-body');
const collectionAnswers = document.querySelectorAll('.question-answers__answers-body-answer');
const collectionRadio = document.querySelectorAll('.question-answers__answers-body-radio');
const btnPrev = document.querySelector('#btn-prev');
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
let reportMin = document.querySelector('#min');
let reportSec = document.querySelector('#sec');
let timeReportVar = Object;
let arrayAnswer = [];
//* --------------------------------------------------- */
 
//* -------------------- FUNCTIONS -------------------- */

//* -------------- Формирование вопросов --------------- */
//* рандомно вытаскивает два вопросса */
const randomQuest = (num, num2) => {
  let newArr = Array(num).fill().map((e, i) => i)
  for (let i = newArr.length - 1; i > 0; i--) {
     let j = Math.floor(Math.random() * (i + 1));
     [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
   }
  return newArr.splice(0, num2)
}
//* перемешивает массив */
const shuffle = (newArr) => {
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
//* формирует десять вопросов (по два из каждого раздела) и перемешивает их в случайном порядке */
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

  }

  randomQuestions = shuffle(questionSection);
}
//* ---------------------------------------------------- */

//* -------- Формирование контента на странице --------- */
//* устонавливает стартовое значение для номера вопросса */
const startQuestNum = () => {
  fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
}
//* присвваеваем текст к названию секции, вопроссу и ответам */
const fillsQAWithText = () => {
  questionText.textContent = randomQuestions[indexQuest].question;
  nameSectionText.textContent = randomQuestions[indexQuest].answers[0].id;
  collectionAnswers.forEach((elem, index) => {
    if (index > 2) return;
    elem.textContent = randomQuestions[indexQuest].answers[index].value;
  });
}
//* показывает номер вопросса */
const showQuestionNumber = () => {
  numQuest++;
  if (numQuest <= randomQuestions.length) {
    fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
  }
}
//* отчет времени на прохождение теста */
const testTimeReport = () => {
  let min = 14;
  let sec = 59;
  reportMin.textContent = `15`;
  reportSec.textContent = `00`;

  timeReportVar = setInterval(() => {
    reportMin.textContent = `${min}`;
    reportSec.textContent = `${sec}`;
    if (min < 10) reportMin.textContent = `0${min}`;
    if (sec < 10) reportSec.textContent = `0${sec}`;
    sec--;
    if (sec < 0) {
      min--;
      sec = 59;
    }
  }, 1000);
  setTimeout(() => {
    clearInterval(timeReportVar);
    moveResult(); // показывает результат
  }, 900000);
}
//* ---------------------------------------------------- */

const calcArrAnserScore = () => {
  let score = 0;
  arrayAnswer.forEach((elem) => {
    if (elem.answer == true) score += 1;
  })
  return score;
}
//* при нажатии на кнопку "Начать зкзамен" открывается поле с тестом */
const startExam = () => {
  fieldTests.classList.add('tests--display--block');
  fieldStartExam.classList.remove('field-start-exam--display--block');
  restartResults();
  console.log(randomQuestions);
}
//* при нажатии на кнопку НАЗАД */
const movePrevQuestion = () => {
  /* делает все ответы активными */
  collectionAnswersBody.forEach(elem => {
    elem.style.pointerEvents = 'auto';
  });

  indexQuest--; // уменьшает индекс вопроса

  /* убавляет и показывает номер вопросса */
  if (numQuest > 1) {
    numQuest--;
    fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
  } 
  /* убирает кнопку "назад" */
  if (numQuest == 1) {
    btnPrev.style.display = 'none';
  }
  /* показывает кнопку "далее" и убирает кнопку "результат" */
  if (numQuest < randomQuestions.length) {
    btnNext.style.display = 'block';
    btnResult.style.display = 'none';
  }

  fillsQAWithText(); // присвваеваем текст к названию секции, вопроссу и ответам

  //!---------------------------------------------------------------------------------
  slyleResetAnswer(); //сбрасывает стили ответов
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuest);

  if (indexQuest <= arrayAnswer.length-1) {
    collectionAnswersBody[arrayAnswer[indexQuest].indexAnswer].classList.add('question-answers__answers-body--active');
  } 
  else {
    let xxx = {
      answer: false,
      indexAnswer: 3,
      indexQuestion: indexQuest,
    }
    arrayAnswer.splice(indexQuest, 1, xxx);
  }
  console.log(arrayAnswer);

  //!---------------------------------------------------------------------------------
}
//* при нажатии на кнопку ДАЛЕЕ */
const moveNextQuestion = () => {
  /* делает все ответы активными */
  collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});
  /* прибавляет и показывает номер вопросса */
  if (numQuest < randomQuestions.length) {
    numQuest++;
    fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
  }
  /* показывает кнопку "назад" */
  if (numQuest > 1) {
    btnPrev.style.display = 'block';
  }
  /* показывает кнопку "результат" и убирает кнопку "далее" */
  if (numQuest == randomQuestions.length) {
    btnNext.style.display = 'none';
    btnResult.style.display = 'block';
  }
  
  /* прибавляет индекс вопроса */
  indexQuest++;
  fillsQAWithText(); // присвваеваем текст к названию секции, вопроссу и ответам
  scoreCalc(); // посчитывает количество правельных ответов

  //!---------------------------------------------------------------------------------
  slyleResetAnswer(); //сбрасывает стили ответов

  console.log(arrayAnswer[indexQuest]);
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuest);

  if (indexQuest <= arrayAnswer.length-1) {
    collectionAnswersBody[arrayAnswer[indexQuest].indexAnswer].classList.add('question-answers__answers-body--active');
  } 
  else {
    let xxx = {
      answer: false,
      indexAnswer: 3,
      indexQuestion: indexQuest,
    }
    arrayAnswer.splice(indexQuest, 1, xxx);
  }

  console.log(arrayAnswer);
  //!---------------------------------------------------------------------------------
  recordedAnswer = ''; // очищает переменную ()
}
//* посчитывает количество правельных ответов */
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
//* стилизует выбранный ответ */
const styleSelectedAnswer = (e) => {
  collectionAnswersBody.forEach(elem => {
    elem.classList.remove('question-answers__answers-body--active');
  })
  e.classList.add('question-answers__answers-body--active');
}
//* сбрасывает стили ответов */
const slyleResetAnswer = () => {
  collectionAnswersBody.forEach(elem => {
    elem.classList.remove('question-answers__answers-body--active');
  })
}
//* убирает состояние checked с каждого элемента */
const checkedOff = () => {
  collectionRadio.forEach((elem) => {
    elem.checked = false;
  });
}
//* при нажатии на кнопку результат */
const moveResult = () => {
  scoreCalc();
  btnRestart.style.display = 'block';
  btnResult.style.display = 'none';
  btnPrev.style.display = 'none';
  clearInterval(timeReportVar);
  fieldQuestionAnswer.style.pointerEvents = 'none';
  fieldQuestionAnswer.style.opacity = '0.2';
  /* делает все ответы не активными */
  collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'none';});
  if (/* countCorrectAnswers */calcArrAnserScore() >= 9) {
    fieldFinalScore.textContent = `Вы прошли! Ваша оценка: ${calcArrAnserScore()/* countCorrectAnswers */}`;
  } 
  else {
    fieldFinalScore.textContent = `Вы не прошли! Ваша оценка: ${calcArrAnserScore()/* countCorrectAnswers */}`;
  }
}
//* сбрасывает все результаты */
const restartResults = () => {
  randomQuestions = []; // сбрасывает ранее заполненный массив с вопросами
  generation10QuestionsFromAllSections(); // формирует десять вопросов (по два из каждого раздела) и перемешивает их в случайном порядке
  btnNext.style.display = 'block';
  btnResult.style.display = 'none';
  btnRestart.style.display = 'none';
  fieldFinalScore.textContent = '';
  fieldQuestionAnswer.style.pointerEvents = 'auto';
  fieldQuestionAnswer.style.opacity = '1';
  /* делает все ответы активными */
  collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});
  arrayAnswer = [];
  numQuest = 0; // номер вопросса
  indexQuest = 0; // индекс вопросса
  countCorrectAnswers = 0; // количество правельных ответов
  showQuestionNumber(); // показывает номер вопросса
  checkedOff(); // убирает состояние checked с каждого элемента
  fillsQAWithText(); // присвваеваем текст к вопроссу и ответам
  slyleResetAnswer(); // сбрасывает стили ответов
  testTimeReport(); // запускает время тестат заново
}
/* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener('load', generation10QuestionsFromAllSections);
window.addEventListener('load', fillsQAWithText);
window.addEventListener('load', startQuestNum);
btnStartTest.addEventListener('click', startExam);
btnPrev.addEventListener('click', movePrevQuestion);
btnNext.addEventListener('click', moveNextQuestion);

collectionAnswersBody.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    styleSelectedAnswer(elem);
    recordedAnswer = randomQuestions[indexQuest].answers[index].correct;
    
    /* что бы нельзя было нажимать на уже выбранный ответ */
    if (elem.classList.contains('question-answers__answers-body--active')) {
      /* делает все ответы активными */
      collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});
      /* делает текущий элемент не активным */
      elem.style.pointerEvents = 'none';
    } 
  
    /* при выборе другого ответа, предыдущий удаляется и присваивается текущий. Происходит с учетом текущего вопроса */
    let iii = {
      answer: recordedAnswer,
      indexAnswer: index,
      indexQuestion: indexQuest,
    }
    if (arrayAnswer != undefined) {
      arrayAnswer.splice(indexQuest, 1, iii);
    }
    
    
    // console.log(collectionAnswersBody[arrayAnswer[indexQuest]]);
    // console.log(randomQuestions);
    // console.log(randomQuestions[indexQuest].answers[arrayAnswer[indexQuest]]);
    console.log(arrayAnswer);
    // console.log(arrayAnswer[indexQuest]);
    console.log(calcArrAnserScore());
    
  })
});// три кнопки ответа

btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
//* --------------------------------------------------- */

export {fieldTests, fieldStartExam, timeReportVar, restartResults, fieldFinalScore};