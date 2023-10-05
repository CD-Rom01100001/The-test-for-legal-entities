const fieldQuestions = document.querySelector('#field-questions');

const questioning = (section) => {
  fieldQuestions.style.display = 'block';
  let count = 0;

  const titleSection = document.createElement('h3');
  titleSection.setAttribute('class', 'field-questions__body-section-title');

  fieldQuestions.append(titleSection); 

  section.forEach((elem) => {
    count++;

    const questAnswWrap = document.createElement('div');
    questAnswWrap.setAttribute('class', 'field-questions__body-quest-answ-wrap');

    const questions = document.createElement('p');
    questions.setAttribute('class', 'field-questions__body-question');
    questions.textContent = `${count}. ${elem.question}`;

    questAnswWrap.append(questions)

    elem.answers.forEach((elem) => {
      const answers = document.createElement('p');
      answers.setAttribute('class', 'field-questions__body-answer');
      answers.textContent = elem.value;
      if (elem.correct == true) {
        answers.classList.add('field-questions__body-answer--answer--correct');
      }
      questAnswWrap.append(answers);
    })

    fieldQuestions.append(questAnswWrap);
  })
}

export {questioning, fieldQuestions}