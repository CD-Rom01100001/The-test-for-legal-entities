import {arrayQuestions, legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';

//* -------------------- CONSTANTS -------------------- */
const fieldTests = document.querySelector('#field-tests');
const btnStartTest = document.querySelector('#button-start-exam');
const fieldStartExam = document.querySelector('.field-start-exam');
const fieldIndicatorsQuest = document.querySelector('#tests-block-indicator-answers');
const fieldNumQuest = document.querySelector('#num-quest-current');
const fieldQuestionAnswer = document.querySelector('#field-question-answers');
const questionText = document.querySelector('#questionText');
const fieldFinalScore = document.querySelector('#final-result');
const nameSectionText = document.querySelector('#name-section-text');
const collectionAnswersBody = document.querySelectorAll('.question-answers__answers-body');
const collectionAnswers = document.querySelectorAll('.question-answers__answers-body-answer');
const collectionRadio = document.querySelectorAll('.question-answers__answers-body-radio');
const trainingSelectedNotSelectedAnswer = document.querySelectorAll('.exam-question-answers__answers-body-selected-not-selected');
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
let arrayAnswer = [];
let reportMin = document.querySelector('#min');
let reportSec = document.querySelector('#sec');
let timeReportVar = Object;
let indicatorCollection = Object;// индикатор
let eventKey = false;// нужно, что-бы событие клавиатуры срабатывало только один раз и не дулировало функцию "navigationQuestionsByKeyboards"
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
//* формирует индикаторы ответов */
const setAnswerIndicators = () => {
  let num = 1;

  for (let i = 0; i < randomQuestions.length; i++) {
    const indicatorBody = document.createElement('div');
    indicatorBody.setAttribute('class', 'exam__indicator-body');

    const indicatorNumber = document.createElement('div');
    indicatorNumber.setAttribute('class', 'exam__indicator-number');

    indicatorNumber.textContent = num;
    indicatorBody.append(indicatorNumber);
    fieldIndicatorsQuest.append(indicatorBody);
    num++;
  }
}
//* устонавливает стартовое значение для номера вопросса */
const startQuestNum = () => {
  fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
}
//* присваеваем текст к названию секции, вопроссу и ответам */
const fillsQAWithText = (index) => {
  questionText.textContent = randomQuestions[index].question;
  nameSectionText.textContent = randomQuestions[index].answers[0].id;
  collectionAnswers.forEach((elem, i) => {
    if (i > 2) return;
    elem.textContent = randomQuestions[index].answers[i].value;
  });
}
//* показывает номер вопроса */
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
  navigationQuestionsByKeyboards();// навигация по вопросам с помощью клавиатуры
  stylesNotStylesAnswers();// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
  console.log(randomQuestions);
}

//* стилизует индикатор выбраного вопроса */
const styleQuestionIndicator = () => {
  indicatorCollection.forEach((elem, i) => i == numQuest-1 && elem.classList.add('exam__set-answer'));
} 

//* если все ответы выбранны то появляется кнопка результат */
const currentNumAnswers = () => {
  let numAnswer = 0;// количество выбранных ответов
  indicatorCollection.forEach(elem => {
    if (elem.classList.contains('exam__set-answer')) numAnswer++;
  })
  if (numAnswer == indicatorCollection.length) btnResult.style.display = 'block';
}

//* стилизует индикатор в соответствии с выбранным текущим вопросом /
const currentIndicator = (curInQuest) => {
  indicatorCollection.forEach(elem => elem.classList.remove('exam__current-indicator'));
  indicatorCollection[curInQuest].classList.add('exam__current-indicator');
}

//* стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
const rightNotRightAnswersIndicators = () => {
  arrayAnswer.forEach((elem, i) => {
    
    if (elem.answer == true) {
      indicatorCollection[i].classList.add('exam__right-answer');
    } else if (elem.answer == false && elem.indexAnswer == 3) {
      indicatorCollection[i].classList.add('exam__no-answer');
    } else {
      indicatorCollection[i].classList.add('exam__not-right-answer');
    }
  })
}

//* навигация по вопросам с помощью индикаторов */
const navigatingQuestionsByindicator = () => {
  indicatorCollection.forEach((indicator, indI) => indicator.addEventListener('click', () => {
    //todo: Когда выбираешь вопрос с помощью индикатора и щелкаешь на ответ, то стиль выбранного ответа не сохраняется, а присваивается ответу в другом вопросе и массив с объектами правельных, не правельных ответов формируется не корректно. Если-же используешь кнопку ДАЛЕЕ или прощелкиваешь все индикаторы друг за другом поочередно не перескакивая через один или нескалько (1,2,3,4,5...) то все работает корректно. Пока хз в чем причина, сделал так, что-бы все вопроссы перебирались заранее и формировался массив с объектами правельных, не правельных ответов и уже в сформировавшемся массиве все без проблем заменяется как и задумывалось. Очень не нравится данный костыль, но пока не пойму в чем проблема будет так :(
    for (let i = 0; numQuest < randomQuestions.length; i++) {
      numQuest++;
      indexQuest++;
      stylesNotStylesAnswers();
    }

    /* если обучение пройдено */
    if (fieldFinalScore.textContent.length != 0) {
      collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'none';});// делает все ответы не активными
      showSelectedNotSelectedAnswers(indI);// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после завершения блока "Обучение"
    } else {
      collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными
    }

    numQuest = indicator.firstElementChild.textContent;// номер текущего вопроса
    indexQuest = indI; // индекс вопросса

    if (numQuest > 1) {
      btnPrev.style.display = 'block';
    } else btnPrev.style.display = 'none';

    if (numQuest == indicatorCollection.length) {
      btnNext.style.display = 'none';
      btnResult.style.display = 'block';
    } else {
      btnNext.style.display = 'block';
      btnResult.style.display = 'none';
    } 

    currentNumAnswers();// если все ответы выбранны то появляется кнопка результат

    /* если обучение пройдено */
    if (fieldFinalScore.textContent.length != 0) {
      btnNext.style.display = 'none';
      btnPrev.style.display = 'none';
      btnResult.style.display = 'none';
    }

    fieldNumQuest.textContent = `${indI+1}/${indicatorCollection.length}`;// присваевает номер текущего вопроса
    currentIndicator(indexQuest);// стилизует индикатор
    fillsQAWithText(indexQuest);// присваиваем текст к названию секции, вопроссу и ответам
    stylesNotStylesAnswers();// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
    

    console.log('длинна массива с выбраными ответами: ' + indicatorCollection.length);
    console.log('индекс текущего вопросса: ' + indexQuest);
    console.log('номер текущего вопросса: ' + numQuest);
    console.log(arrayAnswer[indexQuest]);
  }))
}

//* навигация по вопросам с помощью клавиатуры
const navigationQuestionsByKeyboards = () => {
  if (eventKey == false) {
    document.addEventListener("keydown", (event) => {
      const keyName = event.key;
      if (numQuest < 10) {
        if (keyName == "ArrowRight") {
          moveNextQuestion();
          if (fieldFinalScore.textContent.length != 0) showSelectedNotSelectedAnswers(indexQuest);// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после завершения блока "Обучение"
        }
      } 
      if (numQuest > 1) {
        if (keyName == "ArrowLeft") {
          movePrevQuestion();
          if (fieldFinalScore.textContent.length != 0) showSelectedNotSelectedAnswers(indexQuest);// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после завершения блока "Обучение"
        }
      }
    });
  }
  eventKey = true;
}

//* стилизует и показывает где правильный ответ и какой ответ выбрал пользователь после завершения блока "Экзамен" */
const showSelectedNotSelectedAnswers = (i) => {
  randomQuestions[i].answers.forEach((el, index) => {
    collectionAnswersBody[index].classList.remove('exam-question-answers__body--correct');
    collectionAnswersBody[index].classList.remove('exam-question-answers__body--correct-select');
    collectionAnswersBody[index].classList.remove('exam-question-answers__body--incorrect-select');
    trainingSelectedNotSelectedAnswer[index].textContent = ``;

    if (el.correct == true) {
      collectionAnswersBody[index].classList.add('exam-question-answers__body--correct');
      trainingSelectedNotSelectedAnswer[index].textContent = `Правильный ответ`;
      console.log(`Правильный ответ ${el.value}`);
    } 
    if (el.correct == true && arrayAnswer[i].answer == true) {
      collectionAnswersBody[index].classList.add('exam-question-answers__body--correct-select');
      trainingSelectedNotSelectedAnswer[index].textContent = `Ваш ответ`;
      console.log(`Правильный ответ ${el.value}`);
    }
    if (arrayAnswer[i].answer == false && arrayAnswer[i].indexAnswer != 3) {
      collectionAnswersBody[arrayAnswer[i].indexAnswer].classList.add('exam-question-answers__body--incorrect-select');
      trainingSelectedNotSelectedAnswer[arrayAnswer[i].indexAnswer].textContent = `Ваш ответ`;
      console.log(index);
    } 
  })
}

//* убирает текст ("Ваш ответ", "Правильный ответ") */
const removeSelectedNotSelectedText = () => {
  trainingSelectedNotSelectedAnswer.forEach(elem => elem.textContent = '');
}

//* при нажатии на кнопку НАЗАД */
const movePrevQuestion = () => {
  if (fieldFinalScore.textContent.length != 0) {
    collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'none';});// делает все ответы не активными
  } else {
    collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными
  }

  /* убавляет и показывает номер вопросса */
  if (numQuest > 1) {
    indexQuest--;
    numQuest--;
    fieldNumQuest.textContent = `${numQuest}/${randomQuestions.length}`;
    currentIndicator(indexQuest);// стилизует индикатор в соответствии с выброным текущим вопросом
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
  currentNumAnswers();// если все ответы выбранны то появляется кнопка результат
  removeButtonsAfterTraining()

  fillsQAWithText(indexQuest); // присвваеваем текст к названию секции, вопроссу и ответам

  //!---------------------------------------------------------------------------------
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuest);

  stylesNotStylesAnswers();// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
  console.log(arrayAnswer);

  //!---------------------------------------------------------------------------------
}

//* при нажатии на кнопку ДАЛЕЕ */
const moveNextQuestion = () => {
  if (fieldFinalScore.textContent.length != 0) {
    collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'none';});// делает все ответы не активными
  } else {
    collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными
  }

  /* прибавляет и показывает номер вопросса */
  if (numQuest < randomQuestions.length) {
    indexQuest++;
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
  currentNumAnswers();// если все ответы выбранны то появляется кнопка результат
  removeButtonsAfterTraining()
  
  fillsQAWithText(indexQuest); // присвваеваем текст к названию секции, вопроссу и ответам
  scoreCalc(); // посчитывает количество правельных ответов
  currentIndicator(indexQuest);// стилизует индикатор в соответствии с выброным текущим вопросом
  stylesNotStylesAnswers();// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
  //!---------------------------------------------------------------------------------
  console.log(arrayAnswer[indexQuest]);
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuest);
  console.log('номер текущего вопросса: ' + numQuest);
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
const slyleResetAnswer = (text) => {
  collectionAnswersBody.forEach(elem => {
    elem.classList.remove('question-answers__answers-body--active');
    if (text == 'exit') {
      elem.classList.remove('exam-question-answers__body--correct');
      elem.classList.remove('exam-question-answers__body--correct-select');
      elem.classList.remove('exam-question-answers__body--incorrect-select');
    }
  })
}

//* если обучение пройдено, убирает кнопки */
const removeButtonsAfterTraining = () => {
  if (fieldFinalScore.textContent.length != 0) {
    btnNext.style.display = 'none';
    btnPrev.style.display = 'none';
    btnResult.style.display = 'none';
  }
}

//* стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
const stylesNotStylesAnswers = () => {
  slyleResetAnswer();// сбрасывает стили ответов
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
  btnNext.style.display = 'none';
  clearInterval(timeReportVar);
  fieldQuestionAnswer.style.pointerEvents = 'none';
  /* делает все ответы не активными */
  collectionAnswersBody.forEach(elem => {elem.style.pointerEvents = 'none';});

  /* если экзамен пройден */
  if (calcArrAnserScore() >= 9) {
    fieldFinalScore.textContent = `Вы прошли! Ваша оценка: ${calcArrAnserScore()}`;
    rightNotRightAnswersIndicators();// стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
    showSelectedNotSelectedAnswers(randomQuestions.length-1)// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после
  } 
  /* если экзамен не пройден */
  else {
    fieldFinalScore.textContent = `Вы не прошли! Ваша оценка: ${calcArrAnserScore()}`;
    rightNotRightAnswersIndicators();// стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
    showSelectedNotSelectedAnswers(randomQuestions.length-1)// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после
    return;
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
  fieldIndicatorsQuest.textContent = '';
  setAnswerIndicators();// формирует индикаторы ответов
  indicatorCollection = document.querySelectorAll('.exam__indicator-body');// помещаем индикатор в глобальную переменную
  currentIndicator(indexQuest);// стилизует индикатор в соответствии с выброным текущим вопросом
  navigatingQuestionsByindicator();// навигация по вопросам с помощью индикаторов
  showQuestionNumber(); // показывает номер вопросса
  checkedOff(); // убирает состояние checked с каждого элемента
  fillsQAWithText(indexQuest); // присвваеваем текст к вопроссу и ответам
  slyleResetAnswer('exit'); // сбрасывает стили ответов
  removeSelectedNotSelectedText();// убирает текст ("Ваш ответ", "Правильный ответ")
  testTimeReport(); // запускает время тестат заново
}
/* --------------------------------------------------- */


//*---------------------- EVENTS ---------------------- */
window.addEventListener('load', generation10QuestionsFromAllSections);
window.addEventListener('load', ()=>fillsQAWithText(indexQuest));
window.addEventListener('load', startQuestNum);
btnStartTest.addEventListener('click', startExam);
btnPrev.addEventListener('click', movePrevQuestion);
btnNext.addEventListener('click', moveNextQuestion);

collectionAnswersBody.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    styleQuestionIndicator();// стилизует индикатор выбраного вопроса
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

    currentNumAnswers();// если все ответы выбранны то появляется кнопка результат

    // console.log(collectionAnswersBody[arrayAnswer[indexQuest]]);
    // console.log(randomQuestions);
    // console.log(randomQuestions[indexQuest].answers[arrayAnswer[indexQuest]]);
    console.log(arrayAnswer);
    // console.log(arrayAnswer[indexQuest]);
    console.log(calcArrAnserScore());

    console.log('arrayAnswer:');
    console.log(arrayAnswer);
    
  })
});// три кнопки ответа

btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', restartResults);
//* --------------------------------------------------- */

export {fieldTests, fieldStartExam, timeReportVar, restartResults, fieldFinalScore};