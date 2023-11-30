import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');
const trainingContentInner = document.querySelector('.training__content-inner');

let allQuestions = [];
let stageOut = 1;
let count = 1;
let num = 1;
let notFirstIteration = false;
let counts = {};
let countsKeyValue = '';
let sectionArray = [];

/* помещает все 244 вопроса со всех секций в массив allQuestions */
const throughAllQuestions = () => {
  arrayQuestions.forEach((section) => {
    section.forEach((quest) => {
      allQuestions.push(quest);
    });
  })
}

/* формирует превьюшки html теги на странице */
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

/* заполняет превьюшки информацией сколько в каком этапе вопросов и к каким секциям они относятся */
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

throughAllQuestions();
previewCreation();

const collectionPrewiews = document.querySelectorAll('.preview-block');

/* добавляет замок и блокирует превьюшку */
const setBlocked = (preview) => {
  preview.classList.add('inactive-status');
  const disabledBlock = document.createElement('img');
  disabledBlock.setAttribute('class', 'disabled-block');
  disabledBlock.setAttribute('src', '../assets/images/lockblocked_122039.svg');
  disabledBlock.setAttribute('alt', 'disabled');
  preview.append(disabledBlock);
}



collectionPrewiews.forEach((elem, index) => {
  setBlocked(elem)

  if (index == 0) {
    elem.classList.remove('inactive-status');
    document.querySelector('.disabled-block').style.display = 'none';
  }
  
})

export {fieldTrainingMain};