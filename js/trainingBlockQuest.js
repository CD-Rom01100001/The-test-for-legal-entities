import {arrayQuestions} from './questions.js';
import {collectionPrewiews} from './trainingSection.js';

const previewBlock = document.querySelector('.training__content');
const trainingBlock = document.querySelector('#training');
const nameSection = document.querySelector('#training-name-section-text');
const staffTrainingDescription = document.querySelector('.staff-training__descriotion');
const currentQuestionNumber = document.querySelector('#training-num-quest-current');


let allQuestions = [];// здесь формируются все 244 вопроса

//* помещает все 244 вопроса со всех секций в указаный массив */
const throughAllQuestions = (from, into) => {
  from.forEach((section) => {
    section.forEach((quest) => {
      into.push(quest);
    });
  })
} 
throughAllQuestions(arrayQuestions, allQuestions);

//* показывает номер вопроса */
const showNumQuest = () => {
  currentQuestionNumber.textContent = ``
}
//* закрывает блок с "превьюшками" и открывает блок "Обучение" */
const startTraining = (numSection) => {
  previewBlock.style.display = 'none';
  staffTrainingDescription.style.display = 'none';
  trainingBlock.style.display = 'block';
  nameSection.innerHTML = numSection;
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

export {startTraining, exitOfBlockTraining, previewBlock, trainingBlock, throughAllQuestions};
