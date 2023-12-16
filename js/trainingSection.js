import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');
const trainingContentInner = document.querySelector('.training__content-inner');
const btnExitBlockTraining = document.querySelector('.training__button-exit');
const previewBlock = document.querySelector('.training__content');
const trainingBlock = document.querySelector('#training');
const nameSection = document.querySelector('#training-name-section-text');
const staffTrainingDescription = document.querySelector('.staff-training__descriotion');
const currentQuestionNumber = document.querySelector('#training-num-quest-current');

let allQuestions = [];// здесь формируются все 244 вопроса
let stageOut = 1;
let count = 1;
let num = 1;
let notFirstIteration = false;
let counts = {};
let countsKeyValue = '';
let sectionArray = [];
let currentNumSection = 1;
let currentIndexSection = 0;
let timeReportVar = Object;

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
    setBlocked(elem)
    if (index == 0 || index == 6) {
      elem.classList.remove('inactive-status');
      document.querySelector('.disabled-block').style.display = 'none';
    }
  })
}
//* при нажатии на превьюшку если она разблокирована */
const clickPrewiew = () => {
  collectionPrewiews.forEach((preview, index) => {
    preview.addEventListener('click', () => {
      currentIndexSection = index;
      /* получает названия секций */
      const sectionBlockTitle = preview.getElementsByClassName('section-block')[0].innerHTML;
      if(!preview.classList.contains('inactive-status')) {
        startTraining(sectionBlockTitle);
      }
    })
  })
}

/* ---------------------------- trainingSectionBlock -------------------------------- */
const collectionAllNumQuest = document.querySelectorAll('.all-quest-in-stage');
const trainingMin = document.querySelector('#training-min');
const trainingSec = document.querySelector('#training-sec');

const allNumQuest = (index) => {
  return +collectionAllNumQuest[index].textContent.split(' ')[1];
};

//* показывает номер вопроса */
const showNumQuest = () => {
  currentQuestionNumber.textContent = `${currentNumSection}/${allNumQuest(currentIndexSection)}`;
}

//* показывает время */
const trainingTime = () => {
  let min = 0;
  let sec = 0;

  timeReportVar = setInterval(() => {
    sec++;
    if (sec > 59) sec = 0;
    if (sec < 10) {trainingSec.textContent = `0${sec}`}
    else trainingSec.textContent = sec;
    
    
    if (min < 10) trainingMin.textContent = `0${min}`;
  }, 1000);
  setTimeout(() => {
    clearInterval(timeReportVar);
  }, 70000);
}

//* закрывает блок с "превьюшками" и открывает блок "Обучение" */
const startTraining = (numSection) => {
  previewBlock.style.display = 'none';
  staffTrainingDescription.style.display = 'none';
  trainingBlock.style.display = 'block';
  /* название секции */
  nameSection.innerHTML = numSection;
  /* номер текущего вопроса и общее количество вопросов в блоке */
  showNumQuest();
  /* показывает время */
  trainingTime();
}
//* закрывает блок "Обученме" и oткрывает блок с превиюшками */
const exitOfBlockTraining = () => {
  let warning = confirm("Если вы покините тест, то все результаты будут сброшены!\nХотите продолжить?");
  if (warning == true) {
    previewBlock.style.display = 'flex';
    staffTrainingDescription.style.display = 'block';
    trainingBlock.style.display = 'none';
  } 
  return;
}

includedPrewiew();// убирает замок и разблокирует превьюшку
clickPrewiew();// при нажатии на превьюшку если она разблокирована
btnExitBlockTraining.addEventListener('click', exitOfBlockTraining)// закрывает блок "Обученме" и oткрывает блок с превьюшками

export {fieldTrainingMain, collectionPrewiews, previewBlock, trainingBlock};