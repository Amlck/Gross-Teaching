const CLIENT_ID = '422375558899-8atih4a4mbcje5qk82cjsbncm5bahgud.apps.googleusercontent.com'; // Replace with your OAuth Client ID
const API_KEY = 'AIzaSyBnB7vpC6OosZ2GoVHOVToziZQA7n41_OI'; // Replace with your API key
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let questions = [];
let currentQuestionIndex = 0;

document.getElementById('start-button').addEventListener('click', startExam);

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    document.getElementById('authorize_button').onclick = handleAuthClick;
    document.getElementById('signout_button').onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signout_button').style.display = 'block';
    document.getElementById('start-button').style.display = 'block';
  } else {
    document.getElementById('authorize_button').style.display = 'block';
    document.getElementById('signout_button').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function startExam() {
  document.getElementById('start-button').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';
  currentQuestionIndex = 0;
  loadQuestions();
}

function loadQuestions() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
  const range = 'Sheet1!A2:G';

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range
  }).then(response => {
    const rows = response.result.values;
    questions = rows.map(row => ({
      text: row[0],
      image: row[1],
      correctAnswer: row[2],
      choices: [row[3], row[4], row[5], row[6]]
    }));
    loadQuestion();
  }, error => {
    console.error('Error fetching data: ', error);
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

document.addEventListener('DOMContentLoaded', handleClientLoad);
