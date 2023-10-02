import {legalTraining80, tacticalSpecialtyTraining10, firstAid50, useOfSpecialTools20, firearmsTraining84} from './questions.js';

const fieldQuestions = document.querySelector('#field-questions');

const questioning = () => {
  let count = 0;

  tacticalSpecialtyTraining10.forEach((elem) => {
    count++;

    const questAnswWrap = document.createElement('div');
    questAnswWrap.setAttribute('class', 'quest-answ-wrap');

    const questions = document.createElement('p');
    questions.setAttribute('class', 'field-questions__question');
    questions.textContent = `${count}. ${elem.question}`;

    questAnswWrap.append(questions)

    elem.answers.forEach((elem) => {
      const answers = document.createElement('p');
      answers.setAttribute('class', 'field-questions__answer');
      answers.textContent = elem.value;
      questAnswWrap.append(answers)
    })

    fieldQuestions.append(questAnswWrap);    
  })
}



export {questioning}