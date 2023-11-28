import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');
const trainingContent = document.querySelector('.training__content');

let allQuestions = [];
let stageOut = 1;
let count = 1;
let num = 1;
let notFirstIteration = false;
let counts = {};
let countsKeyValue = '';
let arr = []

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

  const stageBlock = document.createElement('p');
  stageBlock.setAttribute('class', 'stage-block');
  stageBlock.textContent = `${stage}-й этап`;

  const sectionBlock = document.createElement('p');
  sectionBlock.setAttribute('class', 'section-block');
  sectionBlock.textContent = section;

  const allQuestInStage = document.createElement('p');
  allQuestInStage.setAttribute('class', 'all-quest-in-stage');
  allQuestInStage.textContent = `всего ${allQuest} вопросов`;

  previewBlock.append(stageBlock, sectionBlock, allQuestInStage);
  trainingContent.append(previewBlock);
}

/* заполняет превьюшки информацией сколько в каком этапе вопросов и к каким секциям они относятся */
const previewCreation = () => {
  for (let i = 0; i < allQuestions.length; i++) {
    arr.push(allQuestions[i].answers[0].id)
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
      arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; })
      let totalNumQuestStage = 0;
      for(let i in counts) {
        countsKeyValue += `${i} - ${counts[i]}`
        totalNumQuestStage += counts[i];
      }
      createStagePreviewBlock(stageOut, countsKeyValue, totalNumQuestStage);
      arr = [];
      countsKeyValue = '';
      notFirstIteration = true;
      console.log(counts);
    }
    count++;
    num++;
  }
}

window.addEventListener('load', () => {throughAllQuestions(); previewCreation();})
export {fieldTrainingMain};