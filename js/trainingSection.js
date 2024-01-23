import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');
const trainingContentInner = document.querySelector('.training__content-inner');
const btnExitBlockTraining = document.querySelector('.training__button-exit');
const previewBlock = document.querySelector('.training__content');
const trainingBlock = document.querySelector('#training');
const blockIndicatorAnswers = document.querySelector('#block-indicator-answers')
const nameStage = document.querySelector('#training-name-stage-text');
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
let currentIndexPreview = 0;
let currentIndexSection = 0;
let indexQuestion = 0;// индекс вопроса
let arrayAnswer = [];// массив ответов
let testTimeReportVar = Object;
let collectionIndicators = Object;// коллекция индикаторов
let locStorArrayOpenPrew = [];// массив с индексами открытых превью
/* если в localStorage присутствует ключ 'openPreview' то все значения данного ключа переносятся в массив locStorArrayOpenPrew при загрузке сайта */
if (localStorage.getItem('openPreview')) {
  locStorArrayOpenPrew = JSON.parse(localStorage.getItem('openPreview'));
}


//* формирует превьюшки html теги на странице */
const createStagePreviewBlock = (stage, section, allQuest) => {
  const previewBlock = document.createElement('div');
  previewBlock.setAttribute('class', `preview-block`);

  const stageBlock = document.createElement('h3');
  stageBlock.setAttribute('class', 'stage-block');
  stageBlock.setAttribute('id', 'stage-block');
  stageBlock.textContent = `${stage}-й этап`;

  const stageProgress = document.createElement('p');
  stageProgress.setAttribute('class', 'stage-progress');

  const sectionBlock = document.createElement('p');
  sectionBlock.setAttribute('class', 'section-block');
  sectionBlock.setAttribute('id', 'section-block');
  sectionBlock.innerHTML = section; // innerHTML а не textContent потому-что в дальнейшем нужно добовлять перенос строки дописывая в строку <br>

  const allQuestInStage = document.createElement('p');
  allQuestInStage.setAttribute('class', 'all-quest-in-stage');
  allQuestInStage.textContent = `всего ${allQuest} вопросов`;

  previewBlock.append(stageBlock, stageProgress, sectionBlock, allQuestInStage);
  trainingContentInner.append(previewBlock);
}

//* формирует индикаторы ответов
const setAnswerIndicators = () => {
  let num = 1;

  for (let i = 0; i < currentQuestionsArray.length; i++) {
    const indicatorBody = document.createElement('div');
    indicatorBody.setAttribute('class', 'training__indicator-body');

    const indicatorNumber = document.createElement('div');
    indicatorNumber.setAttribute('class', 'training__indicator-number');

    indicatorNumber.textContent = num;
    indicatorBody.append(indicatorNumber);
    blockIndicatorAnswers.append(indicatorBody);
    num++;
  }
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

//* формирует ЗАМКИ */
const createLock = (preview) => {
  preview.classList.add('inactive-status');
  const disabledBlock = document.createElement('img');
  disabledBlock.setAttribute('class', 'disabled-block');
  disabledBlock.setAttribute('src', 'assets/images/lockblocked_122039.svg');
  disabledBlock.setAttribute('alt', 'disabled');
  preview.append(disabledBlock);
}

//* добавляет замок и блокирует все превьюшки кроме первой */
const setBlockedPreview = () => {
  collectionPrewiews.forEach((elem, i) => {
    if (i != 0) createLock(elem);
  });
}
setBlockedPreview();

const collectionLock = document.querySelectorAll('.disabled-block');

//* убирает замок и разблокирует превьюшку */
const includedPrewiew = (preview, numStage) => {
  if (preview.classList.contains('inactive-status')) {
    preview.classList.remove('inactive-status');
    collectionLock[numStage].style.display = 'none';
  }
  return;
}

//* стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
const stylesNotStylesAnswers = () => {
  slyleResetAnswer();// сбрасывает стили ответов
  if (indexQuestion <= arrayAnswer.length-1) {
    trainingAnswersCollectionBody[arrayAnswer[indexQuestion].indexAnswer].classList.add('training-question-answers__body--active');
  } else {
    let xxx = {
      answer: false,
      indexAnswer: 3,
      indexQuest: indexQuestion,
    }
    arrayAnswer.splice(indexQuestion, 1, xxx);
  }
}

//* при нажатии на превьюшку если она разблокирована */
const clickPrewiew = () => {
  collectionPrewiews.forEach((preview, index) => {
    preview.addEventListener('click', () => {
      if (!preview.classList.contains('inactive-status')) {
        currentIndexSection = index;
        const stageBlockTitle = preview.querySelector('#stage-block').innerHTML;// получает названия этапа
        const sectionBlockTitle = preview.querySelector('#section-block').innerHTML;// получает названия секций
        if(!preview.classList.contains('inactive-status')) {
          startTraining(sectionBlockTitle, stageBlockTitle);
        }
        currentIndexPreview = index;
        currentQuestionsArray = questionsFromTo(index);// устонавливает массив из 35 вопроссов в соответствии с нажатой превьюшкой
        console.log(`текущее превью ${currentIndexPreview}`);
        console.log('currentQuestionsArray:');
        console.log(currentQuestionsArray);
        blockIndicatorAnswers.innerHTML = '';// очищает блок с индикаторами, что-бы они не дублирывались
        setAnswerIndicators();// формирует индикаторы ответов
        collectionIndicators = document.querySelectorAll('.training__indicator-body');
        fillsQuestAnswers(0);// присваеваем текст к вопроссу и ответам в соответствии с нажатой превьюшкой
        showCurrentActiveQuest()// показывает(стилизует) первый вопрос(индикатор)
        navigatingQuestionsByindicator()// навигация по вопросам с помощью индикаторов
      }
    })
  })
}

/* ---------------------------- trainingSectionBlock -------------------------------- */
const collectionAllNumQuest = document.querySelectorAll('.all-quest-in-stage');
const trainingMin = document.querySelector('#training-min');
const trainingSec = document.querySelector('#training-sec');
const trainingQuestionText = document.querySelector('#training-questionText');
const fieldQuestionAnswer = document.querySelectorAll('.training-question-answers__answers-body');
const trainingAnswersCollectionBody = document.querySelectorAll('.training-question-answers__answers-body');
const trainingSelectedNotSelectedAnswer = document.querySelectorAll('.training-question-answers__answers-body-selected-not-selected');
const trainingAnswersCollection = document.querySelectorAll('.training-question-answers__answers-body-answer');
const collectionNameStage = document.querySelectorAll('.stage-block');


//* перемешивает массив */
const shuffle = (newArr) => {
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

//* стилизует индикатор выбраного вопроса
const styleQuestionIndicator = () => {
  document.querySelectorAll('.training__indicator-body').forEach((indicator, i) => {
    if (i == currentNumAnswer-1) {
      indicator.classList.add('training__set-answer');
    }
  })

} 

//* стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
const rightNotRightAnswersIndicators = () => {
  arrayAnswer.forEach((elem, i) => {
    
    if (elem.answer == true) {
      collectionIndicators[i].classList.add('training__right-answer');
    } else if (elem.answer == false && elem.indexAnswer == 3) {
      collectionIndicators[i].classList.add('training__no-answer');
    } else {
      collectionIndicators[i].classList.add('training__not-right-answer');
    }
  })
}

//* показывает(стилизует) текущий активный индикатор (рамка вокруг индикатора)
const showCurrentActiveQuest = () => {
  document.querySelectorAll('.training__indicator-body').forEach((indicator, i) => {
    indicator.classList.remove('training__current-indicator');
  })
  document.querySelectorAll('.training__indicator-body')[indexQuestion].classList.add('training__current-indicator');
}

//* навигация по вопросам с помощью индикаторов
const navigatingQuestionsByindicator = () => {
  document.querySelectorAll('.training__indicator-body').forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
      //todo: Когда выбираешь вопрос с помощью индикатора и щелкаешь на ответ, то стиль выбранного ответа не сохраняется, а присваивается ответу в другом вопросе и массив с объектами правельных, не правельных ответов формируется не корректно. Если-же используешь кнопку ДАЛЕЕ или прощелкиваешь все индикаторы друг за другом поочередно не перескакивая через один или нескалько (1,2,3,4,5...) то все работает корректно. Пока хз в чем причина, сделал так, что-бы все вопроссы перебирались заранее и формировался массив с объектами правельных, не правельных ответов и уже в сформировавшемся массиве все без проблем заменяется как и задумывалось. Очень не нравится данный костыль, но пока не пойму в чем проблема будет так :(
      for (let i = 0; currentNumAnswer < currentQuestionsArray.length; i++) {
        currentNumAnswer++;
        indexQuestion++;
        stylesNotStylesAnswers();
      }

      /* если обучение пройдено */
      if (result.textContent.length != 0) {
        trainingAnswersCollectionBody.forEach(elem => {elem.style.pointerEvents = 'none';});// делает все ответы не активными
        showSelectedNotSelectedAnswers(i);// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после завершения блока "Обучение"
      } else {
        trainingAnswersCollectionBody.forEach(elem => {elem.style.pointerEvents = 'auto';});// делает все ответы активными
      }
      

      currentNumAnswer = indicator.firstElementChild.textContent;
      indexQuestion = i;
      
      if (currentNumAnswer > 1) {
        btnPrev.classList.remove('btn-score__btn--display--none');
      } else btnPrev.classList.add('btn-score__btn--display--none');

      if (currentNumAnswer == currentQuestionsArray.length) {
        btnNext.classList.add('btn-score__btn--display--none');
        btnResult.classList.remove('btn-score__btn--display--none');
      } else {
        btnNext.classList.remove('btn-score__btn--display--none');
        btnResult.classList.add('btn-score__btn--display--none');
      } 

      /* если обучение пройдено */
      if (result.textContent.length != 0) {
        btnNext.classList.add('btn-score__btn--display--none');
        btnPrev.classList.add('btn-score__btn--display--none');
        btnResult.classList.add('btn-score__btn--display--none');
      }

      showCurrentActiveQuest();// показывает(стилизует) текущий активный индикатор (рамка вокруг индикатора)
      showNumQuest(currentNumAnswer);// присваевает номер текущего вопроса
      fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам
      stylesNotStylesAnswers();// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран      
    })
  })
}

//* если все индикаторы активны, то появляется кнопка РЕЗУЛЬТАТ
const allIndicatorsActive = () => {
  let quantityActiveIndicators = 0;
  collectionIndicators.forEach(indicator => {
    if (indicator.classList.contains('training__set-answer')) quantityActiveIndicators++;
    if (quantityActiveIndicators == collectionIndicators.length) btnResult.classList.remove('btn-score__btn--display--none');
  })
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

  showCurrentActiveQuest()// показывает(стилизует) текущий активный вопрос

  showNumQuest(currentNumAnswer);
  fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам

  stylesNotStylesAnswers()// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
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

  showCurrentActiveQuest()// показывает(стилизует) текущий активный индикатор (рамка вокруг индикатора)

  showNumQuest(currentNumAnswer);
  fillsQuestAnswers(indexQuestion);// присвваеваем текст к вопроссу и ответам

  stylesNotStylesAnswers()// стилизует выбранный ответ в вопросе, либо убирает стили если ответ не выбран
  recordedAnswer = ''; // очищает переменную ()
}

//* при нажатии на кнопку РЕЗУЛЬТАТ */
const moveResult = () => {
  clearInterval(testTimeReportVar);
  btnRestart.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnPrev.classList.add('btn-score__btn--display--none');
  fieldQuestionAnswer.forEach(answer => {
    answer.style.pointerEvents = 'none';
  })
  // fieldQuestionAnswer.style.pointerEvents = 'none';// делает курсор не активным во всем блоке
  // fieldQuestionAnswer.style.opacity = '0.2';
  // blockIndicatorAnswers.style.pointerEvents = 'none';// делает курсор не активным в блоке с индикаторами
  // blockIndicatorAnswers.style.opacity = '0.2';
  
  /* если меньше трех ошибок, то выведет сообщение, что все ОК */
  if (calcArrAnswerScore() >= currentQuestionsArray.length-3) {
    result.textContent = `Вы прошли! Ваша оценка: ${calcArrAnswerScore()}`;
    rightNotRightAnswersIndicators();// стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
    // collectionPrewiews[currentIndexPreview+1]
    /* что бы не вызывало ошибку после прохождения последнего этапа, поскольку код ниже срабатывает только для последующего этапа */
    if (currentIndexPreview <= 5) {
      console.log('work');
      includedPrewiew(collectionPrewiews[currentIndexPreview+1], currentIndexPreview)

      locStorArrayOpenPrew.push(currentIndexPreview+1);// помещает индекс нажатого превью в массив locStorArrayOpenPrew
      localStorage.setItem('openPreview', JSON.stringify([... new Set(locStorArrayOpenPrew)]));// помещает в localStorage массив locStorArrayOpenPrew без повторяющихся значений(индеков)
    }
  } 
  /* если больше трех ошибок, то выведет сообщение, что все NO */
  else {
    result.textContent = `Вы не прошли! Ваша оценка: ${calcArrAnswerScore()}`;
    rightNotRightAnswersIndicators();// стилизует индикаторы в конце обучения на правельные(зеленый), не правельные(красный)
    showSelectedNotSelectedAnswers(currentQuestionsArray.length-1);// стилизует и показывает где правельный ответ и какой ответ выбрал пользователь после завершения блока "Обучение"
    localStorage.setItem(`stage ${currentIndexPreview}`, calcLearningProgress());
    console.log(calcLearningProgress());
    return;
  }
  
}

//* стилизует и показывает где правильный ответ и какой ответ выбрал пользователь после завершения блока "Обучение" */
const showSelectedNotSelectedAnswers = (i) => {

  currentQuestionsArray[i].answers.forEach((el, index) => {
    trainingAnswersCollectionBody[index].classList.remove('training-question-answers__body--correct');
    trainingAnswersCollectionBody[index].classList.remove('training-question-answers__body--correct-select');
    trainingAnswersCollectionBody[index].classList.remove('training-question-answers__body--incorrect-select');
    trainingSelectedNotSelectedAnswer[index].textContent = ``;

    if (el.correct == true) {
      trainingAnswersCollectionBody[index].classList.add('training-question-answers__body--correct');
      trainingSelectedNotSelectedAnswer[index].textContent = `правильный ответ`;
      console.log(`правельный ответ ${el.value}`);
    } 
    if (el.correct == true && arrayAnswer[i].answer == true) {
      trainingAnswersCollectionBody[index].classList.add('training-question-answers__body--correct-select');
      trainingSelectedNotSelectedAnswer[index].textContent = `Ваш ответ`;
      console.log(`правельный ответ ${el.value}`);
    }
    if (arrayAnswer[i].answer == false && arrayAnswer[i].indexAnswer != 3) {
      trainingAnswersCollectionBody[arrayAnswer[i].indexAnswer].classList.add('training-question-answers__body--incorrect-select');
      trainingSelectedNotSelectedAnswer[arrayAnswer[i].indexAnswer].textContent = `Ваш ответ`;
      console.log(index);
    } 
    
  })
}

/* перебирает массив 'openPreview' находящийся в localStorage и при загрузки сайта разблокирует превьюшки с теми индексами которые есть в данном массиве  */
const openPrewiewOnSiteLoad = () => {
  if (localStorage.getItem("openPreview")) {
    let numLS = JSON.parse(localStorage.getItem('openPreview'));
    console.log(numLS);
    numLS.forEach(index => {
      includedPrewiew(collectionPrewiews[index], index-1)
    })
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
  blockIndicatorAnswers.style.pointerEvents = 'auto';// делает курсор активным в блоке с индикаторами
  blockIndicatorAnswers.style.opacity = 1;
  btnPrev.classList.add('btn-score__btn--display--none');
  btnNext.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnRestart.classList.add('btn-score__btn--display--none');
  arrayAnswer = [];// массив ответов
  slyleResetAnswer();// сбрасывает стили ответов
  collectionIndicators.forEach(indicator => indicator.classList.remove('training__set-answer'));// сбрасывает стили индикаторов
  showCurrentActiveQuest()// показывает(стилизует) первый вопрос(индикатор)
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
const calcArrAnswerScore = () => {
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

//* подсчитывает прогресс обучения */
const calcLearningProgress = () => {
  const totalNumQuestions = arrayAnswer.length;
  let finaScore = 0;
  arrayAnswer.forEach(quest => {
    if (quest.answer == true) finaScore++;
  })
  return `${Math.round(finaScore / totalNumQuestions * 100)}%`;
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
const startTraining = (numSection, nStage) => {
  previewBlock.style.display = 'none';
  staffTrainingDescription.style.display = 'none';
  trainingBlock.style.display = 'block';
  nameStage.textContent = nStage;// название этапа
  nameSection.innerHTML = numSection;// название секции
  showNumQuest(currentNumAnswer);// номер текущего вопроса и общее количество вопросов в блоке
  trainingTime();// показывает время
}

//* закрывает блок "Обучение" и oткрывает блок с превиюшками */
const exitOfBlockTraining = () => {
  if (btnRestart.classList.contains('btn-score__btn--display--none')) {
    let warning = confirm("Если вы покините \"Обучение\", то все результаты будут сброшены!\nХотите продолжить?");
    if (warning == true) {
      previewBlock.style.display = 'flex';
      staffTrainingDescription.style.display = 'block';
      trainingBlock.style.display = 'none';
      restartResults();
    } 
    return;
  }
  previewBlock.style.display = 'flex';
  staffTrainingDescription.style.display = 'block';
  trainingBlock.style.display = 'none';
  restartResults();
}

//* при нажатии на другие ВКЛАДКИ или на кнопку ВЫХОД  */
const restartResults = () => {
  clearInterval(testTimeReportVar);
  currentNumAnswer = 1;
  indexQuestion = 0;
  fieldQuestionAnswer.style.pointerEvents = 'auto';// делает курсор активным во всем блоке
  fieldQuestionAnswer.style.opacity = 1;
  blockIndicatorAnswers.style.pointerEvents = 'auto';// делает курсор активным в блоке с индикаторами
  blockIndicatorAnswers.style.opacity = 1;
  btnPrev.classList.add('btn-score__btn--display--none');
  btnNext.classList.remove('btn-score__btn--display--none');
  btnResult.classList.add('btn-score__btn--display--none');
  btnRestart.classList.add('btn-score__btn--display--none');
  arrayAnswer = [];// массив ответов
  slyleResetAnswer(); // сбрасывает стили ответов
}

window.addEventListener('load', openPrewiewOnSiteLoad);// разблокирует превьюшки при загрузке сайта
btnNext.addEventListener('click', moveNextQuestion);
btnPrev.addEventListener('click', movePrevQuestion);
btnResult.addEventListener('click', moveResult);
btnRestart.addEventListener('click', moveAgain);
clickPrewiew();// при нажатии на превьюшку если она разблокирована
btnExitBlockTraining.addEventListener('click', exitOfBlockTraining)// закрывает блок "Обученме" и oткрывает блок с превьюшками
trainingAnswersCollectionBody.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    styleQuestionIndicator();// стилизует индикатор выбраного вопроса
    allIndicatorsActive();// если все индикаторы активны, то появляется кнопка РЕЗУЛЬТАТ

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

    console.log('arrayAnswer:');
    console.log(arrayAnswer);
    console.log(recordedAnswer);

  })
});// три кнопки ответа

export {fieldTrainingMain, collectionPrewiews, previewBlock, trainingBlock, restartResults};