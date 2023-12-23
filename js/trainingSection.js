import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');
const trainingContentInner = document.querySelector('.training__content-inner');
const btnExitBlockTraining = document.querySelector('.training__button-exit');
const previewBlock = document.querySelector('.training__content');
const trainingBlock = document.querySelector('#training');
const nameSection = document.querySelector('#training-name-section-text');
const staffTrainingDescription = document.querySelector('.staff-training__descriotion');
const currentQuestionNumber = document.querySelector('#training-num-quest-current');
const btnPrev = document.querySelector('#training-btn-prev');
const btnNext = document.querySelector('#training-btn-next');
const btnResult = document.querySelector('#training-btn-result');
const btnRestart = document.querySelector('#training-btn-restart');
const result = document.querySelector('.training__result-text');

let allQuestions = [];// здесь формируются все 244 вопроса
let currentQuestionsArray = []; // устонавливает массив из 35 вопроссов в соответствии с нажатой превьюшкой
let recordedAnswer = ''; // устонавливает true или false
let stageOut = 1;
let count = 1;
let num = 1;
let notFirstIteration = false;
let counts = {};
let countsKeyValue = '';
let sectionArray = [];
let currentNumAnswer = 1;// номер текущего вопроса
let currentIndexSection = 0;
let indexQuestion = 0;// индекс вопроса
let arrayAnswer = [];// массив ответов
let testTimeReportVar = Object;

//* формирует превьюшки html теги на странице */
const createStagePreviewBlock = (stage, section, allQuest) => {
  const previewBlock = document.createElement('div');
  previewBlock.setAttribute('class', `preview-block`);

  const stageBlock = document.createElement('h3');
  stageBlock.setAttribute('class', 'stage-block');
  stageBlock.textContent = `${stage}-й этап`;

  const sectionBlock = document.createElement('p');
  sectionBlock.setAttribute('class', 'section-block');
  sectionBlock.innerHTML = section; // innerHTML а не textContent потому-что в дальнейшем нужно добовлять перенос строки дописывая в строку <br>

  const allQuestInStage = document.createElement('p');
  allQuestInStage.setAttribute('class', 'all-quest-in-stage');
  allQuestInStage.textContent = `всего ${allQuest} вопросов`;

  previewBlock.append(stageBlock, sectionBlock, allQuestInStage);
  trainingContentInner.append(previewBlock);
}
//* заполняет превьюшки информацией сколько в каком этапе вопросов и к каким секциям они относятся */
const previewCreation = () => {
  for (let i = 0; i < allQuestions.length; i++) {
    sectionArray.push(allQuestions[i].answers[0].id)
    if (count == 35 ||
        count == 70 ||
        count == 105 ||
        count == 140 ||
        count == 175 ||
        count == 210 ||
        count == 244) {
      if (notFirstIteration == true) {
        stageOut++;
        counts = {};
      }
      sectionArray.forEach(section => { counts[section] = (counts[section] || 0) + 1; })
      let totalNumQuestStage = 0;
      for(let i in counts) {
        countsKeyValue += `&#8226; ${i} - ${counts[i]} <br>`;
        totalNumQuestStage += counts[i];
      }
      createStagePreviewBlock(stageOut, countsKeyValue, totalNumQuestStage);
      sectionArray = [];
      countsKeyValue = '';
      notFirstIteration = true;
    }
    count++;
    num++;
  }
}
//* помещает все 244 вопроса со всех секций в указаный массив */
const throughAllQuestions = (from, into) => {
  from.forEach((section) => {
    section.forEach((quest) => {
      into.push(quest);
    });
  })
} 
throughAllQuestions(arrayQuestions, allQuestions);
previewCreation();

const collectionPrewiews = document.querySelectorAll('.preview-block');

//* добавляет замок и блокирует превьюшку */
const setBlocked = (preview) => {
  preview.classList.add('inactive-status');
  const disabledBlock = document.createElement('img');
  disabledBlock.setAttribute('class', 'disabled-block');
  disabledBlock.setAttribute('src', 'assets/images/lockblocked_122039.svg');
  disabledBlock.setAttribute('alt', 'disabled');
  preview.append(disabledBlock);
}
//* убирает замок и разблокирует превьюшку */
const includedPrewiew = () => {
  collectionPrewiews.forEach((elem, index) => {
    console.log(elem);
    setBlocked(elem)
    if (index == 0) {
      elem.classList.remove('inactive-status');
      document.querySelector('.disabled-block').style.display = 'none';
    }
  })
}
//* при нажатии на превьюшку если она разблокирована */
const clickPrewiew = () => {
  collectionPrewiews.forEach((preview, index) => {
    preview.addEventListener('click', () => {
      if (!preview.classList.contains('inactive-status')) {
        currentIndexSection = index;
        /* получает названия секций */
        const sectionBlockTitle = preview.getElementsByClassName('section-block')[0].innerHTML;
        if(!preview.classList.contains('inactive-status')) {
          startTraining(sectionBlockTitle);
        }
        currentQuestionsArray = questionsFromTo(index);// устонавливает массив из 35 вопроссов в соответствии с нажатой превьюшкой
        console.log(indexQuestion);
        console.log(currentQuestionsArray);
        fillsQuestAnswers(0);// присвваеваем текст к вопроссу и ответам в соответствии с нажатой превьюшкой
      }
    })
  })
}

/* ---------------------------- trainingSectionBlock -------------------------------- */
const collectionAllNumQuest = document.querySelectorAll('.all-quest-in-stage');
const trainingMin = document.querySelector('#training-min');
const trainingSec = document.querySelector('#training-sec');
const trainingQuestionText = document.querySelector('#training-questionText');
const fieldQuestionAnswer = document.querySelector('.training-question-answers__body');
const trainingAnswersCollectionBody = document.querySelectorAll('.training-question-answers__answers-body');
const trainingAnswersCollection = document.querySelectorAll('.training-question-answers__answers-body-answer');

//* перемешивает массив */
const shuffle = (newArr) => {
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

//* присвваеваем текст к вопроссу и ответам */
const fillsQuestAnswers = (quest) => {
  trainingQuestionText.textContent = currentQuestionsArray[quest].question;
  for (let i = 0; i < 3; i++) {
    trainingAnswersCollection[i].textContent = currentQuestionsArray[quest].answers[i].value; 
  }
}

//* при нажатии на кнопку НАЗАД */
const movePrevQuestion = () => {

  trainingAnswersCollectionBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными

  if (currentNumAnswer > 1) {
    currentNumAnswer--;
    indexQuestion--;
  }
  
  if (currentNumAnswer == 1) {
    btnPrev.classList.add('btn-score__btn--display--none');
  }

  if (currentNumAnswer == currentQuestionsArray.length-1) {
    btnNext.classList.remove('btn-score__btn--display--none');
    btnResult.classList.add('btn-score__btn--display--none');
  }

  showNumQuest(currentNumAnswer);
  fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам

  //!---------------------------------------------------------------------------------
  slyleResetAnswer(); //сбрасывает стили ответов
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuestion);

  if (indexQuestion <= arrayAnswer.length-1) {
    trainingAnswersCollectionBody[arrayAnswer[indexQuestion].indexAnswer].classList.add('training-question-answers__body--active');
  } 
  else {
    let xxx = {
      answer: false,
      indexAnswer: 3,
      indexQuest: indexQuestion,
    }
    arrayAnswer.splice(indexQuestion, 1, xxx);
  }
  console.log(arrayAnswer);
  //!---------------------------------------------------------------------------------
}

//* при нажатии на кнопку ДАЛЕЕ */
const moveNextQuestion = () => {

  trainingAnswersCollectionBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными

  if (currentNumAnswer < currentQuestionsArray.length) {
    currentNumAnswer++;
    indexQuestion++;
  }
  
  if (currentNumAnswer == 2) {
    btnPrev.classList.remove('btn-score__btn--display--none');
  }

  if (currentNumAnswer == currentQuestionsArray.length) {
    btnNext.classList.add('btn-score__btn--display--none');
    btnResult.classList.remove('btn-score__btn--display--none');
  }

  showNumQuest(currentNumAnswer);
  fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам

  //!---------------------------------------------------------------------------------
  slyleResetAnswer();// сбрасывает стили ответов
  console.log(arrayAnswer[indexQuestion]);
  console.log('длинна массива с выбраными ответами: ' + arrayAnswer.length);
  console.log('индекс текущего вопросса: ' + indexQuestion);

  if (indexQuestion <= arrayAnswer.length-1) {
    trainingAnswersCollectionBody[arrayAnswer[indexQuestion].indexAnswer].classList.add('training-question-answers__body--active');
  } 
  else {
    let xxx = {
      answer: false,
      indexAnswer: 3,
      indexQuest: indexQuestion,
    }
    arrayAnswer.splice(indexQuestion, 1, xxx);
  }

  console.log(arrayAnswer);
  //!---------------------------------------------------------------------------------
  recordedAnswer = ''; // очищает переменную ()
}

//* при нажатии на кнопку РЕЗУЛЬТАТ */
const moveResult = () => {
  clearInterval(testTimeReportVar);
  btnRestart.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnPrev.classList.add('btn-score__btn--display--none');
  fieldQuestionAnswer.style.pointerEvents = 'none';// делает курсор не активным во всем блоке
  fieldQuestionAnswer.style.opacity = '0.2';
  /* если меньше трех ошибок, то выведет сообщение, что все ОК */
  if (calcArrAnserScore() >= currentQuestionsArray.length-3) {
    result.textContent = `Вы прошли! Ваша оценка: ${calcArrAnserScore()}`;
  } 
  /* если больше трех ошибок, то выведет сообщение, что все NO */
  else {
    result.textContent = `Вы не прошли! Ваша оценка: ${calcArrAnserScore()}`;
  }
}

//* при нажатии на кнопку ЗАНОВО */
const moveAgain = () => {
  indexQuestion = 0;// индекс вопроса
  fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам
  currentNumAnswer = 1;// номер текущего вопроса
  trainingTime()// показывает время
  fieldQuestionAnswer.style.pointerEvents = 'auto';// деоает курсор активным во всем блоке
  fieldQuestionAnswer.style.opacity = 1;
  btnPrev.classList.add('btn-score__btn--display--none');
  btnNext.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnRestart.classList.add('btn-score__btn--display--none');
  arrayAnswer = [];// массив ответов
  slyleResetAnswer(); // сбрасывает стили ответов
}

//* стилизует выбранный ответ */
const styleSelectedAnswer = (e) => {
  trainingAnswersCollectionBody.forEach(elem => {
    elem.classList.remove('training-question-answers__body--active');
  })
  e.classList.add('training-question-answers__body--active');
}

//* сбрасывает стили ответов */
const slyleResetAnswer = () => {
  trainingAnswersCollectionBody.forEach(elem => {
    elem.classList.remove('training-question-answers__body--active');
  })
}

//* при каждом вызове прибавляет 1 если true и аккамулирует итоговую оценку  */
const calcArrAnserScore = () => {
  let score = 0;
  arrayAnswer.forEach((elem) => {
    if (elem.answer == true) score += 1;
  })
  return score;
}

//* в зависимости от того на какую превьюшку нажато, получает определенные вопросы и ПЕРЕМЕШИВАЕТ их */
const questionsFromTo = (index) => {
  let arr = [];
  
  switch (index) {
    case 0:
      for (let i = 0; i < 35; i++) {arr.push(allQuestions[i])};
      break;
    case 1:
      for (let i = 35; i < 70; i++) {arr.push(allQuestions[i])};
      break;
    case 2:
      for (let i = 70; i < 105; i++) {arr.push(allQuestions[i])};
      break;
    case 3:
      for (let i = 105; i < 140; i++) {arr.push(allQuestions[i])};
      break;
    case 4:
      for (let i = 140; i < 175; i++) {arr.push(allQuestions[i])};
      break;
    case 5:
      for (let i = 175; i < 210; i++) {arr.push(allQuestions[i])};
      break;
    case 6:
      for (let i = 210; i < 244; i++) {arr.push(allQuestions[i])};
      break;
  }
  
  return shuffle(arr);
}

//* вытаскивает число из текста "всего 35 вопросов" */
const allNumQuest = (index) => {
  return +collectionAllNumQuest[index].textContent.split(' ')[1];
};

//* показывает номер вопроса */
const showNumQuest = (numAnswer) => {
  currentQuestionNumber.textContent = `${numAnswer}/${allNumQuest(currentIndexSection)}`;
}

//* показывает время */
const trainingTime = () => {
  let min = 0;
  let sec = 0;
  trainingSec.textContent = `00`;
  trainingMin.textContent = `00`;

  testTimeReportVar = setInterval(() => {
    sec++;
    if (sec > 59) {
      min++;
      sec = 0;
    };
    if (sec < 10) {trainingSec.textContent = `0${sec}`}
    else trainingSec.textContent = sec;
    if (min < 10) trainingMin.textContent = `0${min}`;
    else trainingMin.textContent = min;

    
  }, 1000);
  /* при достижении 60 мин появляется предупреждение и обучение закрывается */
  setTimeout(() => {
    clearInterval(testTimeReportVar);
    alert('Прохождение обучения заняло слишком много времени, процесс будет прерван');
    min = 0;
    sec = 0;
    previewBlock.style.display = 'flex';
    staffTrainingDescription.style.display = 'block';
    trainingBlock.style.display = 'none';
  }, 3601000);
}

//* закрывает блок с "превьюшками" и открывает блок "Обучение" */
const startTraining = (numSection) => {
  previewBlock.style.display = 'none';
  staffTrainingDescription.style.display = 'none';
  trainingBlock.style.display = 'block';
  nameSection.innerHTML = numSection;// название секции
  showNumQuest(currentNumAnswer);// номер текущего вопроса и общее количество вопросов в блоке
  trainingTime();// показывает время
}

//* закрывает блок "Обучение" и oткрывает блок с превиюшками */
const exitOfBlockTraining = () => {
  let warning = confirm("Если вы покините тест, то все результаты будут сброшены!\nХотите продолжить?");
  if (warning == true) {
    previewBlock.style.display = 'flex';
    staffTrainingDescription.style.display = 'block';
    trainingBlock.style.display = 'none';
    restartResults();
  } 
  return;
}

//* при нажатии на другие ВКЛАДКИ или на кнопку ВЫХОД  */
const restartResults = () => {
  clearInterval(testTimeReportVar);
  currentNumAnswer = 1;
  indexQuestion = 0;
  fieldQuestionAnswer.style.pointerEvents = 'auto';// делает курсор активным во всем блоке
  fieldQuestionAnswer.style.opacity = 1;
  btnPrev.classList.add('btn-score__btn--display--none');
  btnNext.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnRestart.classList.add('btn-score__btn--display--none');
  arrayAnswer = [];// массив ответов
  slyleResetAnswer(); // сбрасывает стили ответов
}

btnNext.addEventListener('click', moveNextQuestion);
btnPrev.addEventListener('click', movePrevQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', moveAgain);
includedPrewiew();// убирает замок и разблокирует превьюшку
clickPrewiew();// при нажатии на превьюшку если она разблокирована
btnExitBlockTraining.addEventListener('click', exitOfBlockTraining)// закрывает блок "Обученме" и oткрывает блок с превьюшками
trainingAnswersCollectionBody.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    styleSelectedAnswer(elem);// стилизует выбранный ответ
    recordedAnswer = currentQuestionsArray[indexQuestion].answers[index].correct;// устонавливает true или false
    
    /* что бы нельзя было нажимать на уже выбранный ответ */
    if (elem.classList.contains('training-question-answers__body--active')) {
      trainingAnswersCollectionBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными
      elem.style.pointerEvents = 'none';// делает текущий элемент не активным
    } 
  
    /* при выборе другого ответа, предыдущий удаляется и присваивается текущий. Происходит с учетом текущего вопроса */
    let iii = {
      answer: recordedAnswer,
      indexAnswer: index,
      indexQuest: indexQuestion,
    }

    if (arrayAnswer != undefined) {
      arrayAnswer.splice(indexQuestion, 1, iii);
    }

    console.log(arrayAnswer);
    console.log(recordedAnswer);
    
  })
});// три кнопки ответа

export {fieldTrainingMain, collectionPrewiews, previewBlock, trainingBlock, restartResults};