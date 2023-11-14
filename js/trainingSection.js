import {arrayQuestions} from './questions.js';

const fieldTrainingMain = document.querySelector('#field-training');

let allQuestions = [];
let stage = 1;
let count = 0;
let num = 1;

const throughAllQuestions = () => {
  arrayQuestions.forEach((section) => {
    section.forEach((quest) => {
      allQuestions.push(quest);
    });
  })
}
throughAllQuestions();

for (let i = 0; i < allQuestions.length; i++) {
  if (count == 35) {
    count = 0;
    stage++;
  };
  count++;

  console.log(`вопрос: ${num}. этап: ${stage}. секция: ${allQuestions[i].answers[0].id} вопрос: ${allQuestions[i].question}`);
  num++;
}


export {fieldTrainingMain};