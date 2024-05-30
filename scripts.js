const sheetId = '1paAbB0DfEziVPp5X5s5TOfyvHjhHszGk9TOd81BuL5o';
const apiKey = 'AIzaSyBVc-qKWRPRO4HDAN6C8sR0aONw6BwTZm0';
let questions = [];
let currentQuestionIndex = 0;

document.getElementById('start-button').addEventListener('click', startExam);

function startExam() {
  document.getElementById('start-button').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';
  currentQuestionIndex = 0;
  loadQuestions();
}

function loadQuestions() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values;
      questions = rows.slice(1).map(row => ({
        text: row[0],
        image: row[1],
        correctAnswer: row[2],
        choices: [row[3], row[4], row[5], row[6]]
      }));
      loadQuestion();
    });
}

function loadQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question-text').innerText = question.text;
  document.getElementById('question-image').src = question.image;
  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = '';
  question.choices.forEach(choice => {
    const button = document.createElement('button');
    button.innerText = choice;
    button.classList.add('answer-button');
    button.onclick = () => submitAnswer(choice);
    choicesContainer.appendChild(button);
  });
}

function submitAnswer(answer) {
  const question = questions[currentQuestionIndex];
  const resultText = answer === question.correctAnswer ? 'Correct!' : `Incorrect. The correct answer is ${question.correctAnswer}.`;
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('result-text').innerText = resultText;
  document.getElementById('result-section').style.display = 'block';
}

function loadNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    loadQuestion();
  } else {
    document.getElementById('result-text').innerText = 'You have completed the exam!';
    document.getElementById('next-button').style.display = 'none';
  }
}
