import {collectionPrewiews} from './trainingSection.js';

const previewBlock = document.querySelector('.training__content');
const trainingBlock = document.querySelector('#training');
const nameSection = document.querySelector('#training-name-section-text');

const startTraining = (numSection) => {
  previewBlock.style.display = 'none';
  trainingBlock.style.display = 'block';
  nameSection.innerHTML = numSection;
}

export {startTraining};
/*  
Первая помощь - 35
• Использование специальных средств - 20
• Огневая подготовка - 15
• Огневая подготовка - 35
Огневая подготовка - 34
 */