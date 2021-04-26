let form = document.querySelector(".form");
let name = form.querySelector(".form-name");
let nameUser;
let timer;
let interval;
const submitButton = document.getElementById("submit");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const restartButton = document.getElementById("restart");
const countdownContainer = document.getElementById("countdown");

previousButton.style.display = "none";
nextButton.style.display = "none";
submitButton.style.display = "none";
restartButton.style.display = "none";
countdownContainer.style.display = "none";

function buildQuizAfterCheck() {
  const myQuestions = [
    {
      question: 'Which of the following ingredients is not normally used to brew beer?',
      answers: {
        a: 'Hops',
        b: 'Yeast',
        c: 'Malt',
        d: 'Vinegar',
      },
      correctAnswer: 'd'
    },
    {
      question: 'Substances that have a definite size and shape, and vibrating particles that are close together are:',
      answers: {
        a: 'Liquids',
        b: 'Gases',
        c: 'Solids',
      },
      correctAnswer: 'c'
    },
    {
      question: 'Goulash is a beef soup associated with this nation:',
      answers: {
        a: 'Morocco',
        b: 'Greece',
        c: 'Israel',
        d: 'Hungary',
      },
      correctAnswer: 'd'
    }
  ];

  function buildQuiz() {
    const output = [];

    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answers = [];
      for (letter in currentQuestion.answers) {
        answers.push(
            `<label id="answer">
             <input id="radio" type="radio" name="question${questionNumber}" value="${letter}">
              ${letter} :
              ${currentQuestion.answers[letter]}
           </label>`
        );
      }
      output.push(
          `<div class="slide">
           <div class="question"> ${currentQuestion.question} </div>
           <div class="answers"> ${answers.join("")} </div>
         </div>`
      );
    });
    quizContainer.innerHTML = output.join("");
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  function showResults() {
    const answerContainers = quizContainer.querySelectorAll(".answers");

    let numCorrect = 0;

    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;
      if (userAnswer === currentQuestion.correctAnswer) {
        numCorrect++;
      }
    });

    resultsContainer.innerHTML = nameUser + `, your result is ${numCorrect} out of ${myQuestions.length}`;
    restartButton.style.display = "inline-block";
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentSlide = n;

    function creationCountdown() {
      countdownContainer.style.display = "block";
      let display = document.querySelector("#countdown .display")
      let timeLeft = "15";

      interval = setInterval(function() {
        if (--timeLeft >= 0) {
          display.innerHTML = timeLeft
        } else {
          document.querySelector("#countdown h1").style.display = "none";
          previousButton.style.display = "none";
          nextButton.style.display = "none";
          submitButton.style.display = "none";
          restartButton.style.display = "inline-block";
          clearInterval(interval);
          timeLeft = "15";
        }
      }, 1000)
    }

    creationCountdown();

    const buttons = document.querySelectorAll(".answers input");
    buttons.forEach(button => button.removeAttribute("disabled"));

    function blockQuizOnTimeout() {
      buttons.forEach(button => button.setAttribute("disabled", true));
      alert("Ваше время на ответ истекло:(")
    }

    timer = setTimeout(blockQuizOnTimeout, 10000);


    if (currentSlide === 0) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "inline-block";
    }

    if (currentSlide === slides.length - 1) {
      nextButton.style.display = "none";
      submitButton.style.display = "inline-block";
    } else {
      nextButton.style.display = "inline-block";
      submitButton.style.display = "none";
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  buildQuiz();

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  showSlide(0);

  const checkResult = (e) => {
    const tar = e.target;

    if (tar.tagName === "INPUT") {
      clearTimeout(timer);
      clearInterval(interval);
      const questionNumber = tar.name.slice(-1);
      const userAnswer = tar.value;
      const isCorrect = myQuestions[questionNumber].correctAnswer === userAnswer;
      if (isCorrect) {
        tar.parentNode.style.color = "lightgreen";
      } else {
        tar.parentNode.style.color = "red";
      }
      const radioButtons = e.currentTarget.querySelectorAll(".answers input");
      radioButtons.forEach(button => button.setAttribute("disabled", true))
    }
  }

  const setAnswerHandlers = () => {
    const container = quizContainer.querySelectorAll(".slide .answers");
    container.forEach(answer => {
      answer.addEventListener("click", checkResult);
    })
  }

  setAnswerHandlers();

  function reloadLocation() {
    location.reload();
  }

  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
  restartButton.addEventListener("click", reloadLocation);
}

form.addEventListener("submit", function (event) {
  let regex = /^[A-ZА-Я]+[a-zа-я]{2,10}$/;
  name.classList.remove("error");

  if (!regex.test(name.value)) {
    event.preventDefault();
    console.log("error");
    name.classList.add("error");

    let error = document.createElement("div");
    error.className = "error-block";
    error.style.color = "red";
    error.innerHTML = "Please enter your name with a first capital letter";
    name.parentElement.insertBefore(error, name);
  } else {
    nameUser = regex.exec(name.value);
    event.preventDefault();
    form.style.display = "none";
    buildQuizAfterCheck()
  }
})