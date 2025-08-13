// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================== //
    // 1. LANGUAGE SWITCHING (INTERNATIONALIZATION - i18n)    //
    // ====================================================== //

    const langSelector = document.getElementById('lang-select');

    // Store all translatable text in this object
    const translations = {
        en: {
            site_title: "Learn Japanese", nav_hiragana: "Hiragana", nav_katakana: "Katakana", nav_kanji: "Kanji", nav_quiz: "Quiz",
            hero_title: "Your Ultimate Journey to Japanese Mastery", hero_subtitle: "Start with the basics. Practice pronunciation. Master the characters.", hero_button: "Let's Begin",
            hiragana_title: "Hiragana Chart (ひらがな)", hiragana_desc: "Click on any character to hear its pronunciation.",
            katakana_title: "Katakana Chart (カタカナ)", katakana_desc: "Used for foreign words, names, and emphasis.",
            kanji_title: "100 Basic Kanji (漢字)", kanji_desc: "The building blocks of written Japanese.",
            kanji_day: "Meaning: Day, Sun, Japan", kanji_one: "Meaning: One", kanji_person: "Meaning: Person",
            quiz_title: "Test Your Knowledge", quiz_desc: "Ready to check your skills? Choose a quiz to start.",
            quiz_btn_hira: "Hiragana Quiz", quiz_btn_kata: "Katakana Quiz",
        },
        es: {
            site_title: "Aprende Japonés", nav_hiragana: "Hiragana", nav_katakana: "Katakana", nav_kanji: "Kanji", nav_quiz: "Prueba",
            hero_title: "Tu Viaje Definitivo a la Maestría del Japonés", hero_subtitle: "Comienza con lo básico. Practica la pronunciación. Domina los caracteres.", hero_button: "Comencemos",
            hiragana_title: "Tabla Hiragana (ひらがな)", hiragana_desc: "Haz clic en cualquier caracter para escuchar su pronunciación.",
            katakana_title: "Tabla Katakana (カタカナ)", katakana_desc: "Usado para palabras extranjeras, nombres y énfasis.",
            kanji_title: "100 Kanji Básicos (漢字)", kanji_desc: "Los componentes básicos del japonés escrito.",
            kanji_day: "Significado: Día, Sol, Japón", kanji_one: "Significado: Uno", kanji_person: "Significado: Persona",
            quiz_title: "Pon a Prueba tu Conocimiento", quiz_desc: "¿Listo para probar tus habilidades? Elige una prueba para empezar.",
            quiz_btn_hira: "Prueba de Hiragana", quiz_btn_kata: "Prueba de Katakana",
        },
        // Add other languages like fr, de, hi here following the same structure
    };

    const changeLanguage = (lang) => {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.dataset.langKey;
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        document.documentElement.lang = lang; // Update the lang attribute of the HTML tag
    };

    langSelector.addEventListener('change', (event) => {
        changeLanguage(event.target.value);
    });

    // Set initial language based on selector
    changeLanguage(langSelector.value);


    // ====================================================== //
    // 2. SOUND PRONUNCIATION                                 //
    // ====================================================== //

    // Note: You need to create a 'sounds' folder with subfolders 'hiragana' and 'katakana'
    // and place the corresponding .mp3 files (e.g., a.mp3, i.mp3, ka.mp3) inside them.
    
    document.querySelectorAll('.char-card[data-sound]').forEach(button => {
        button.addEventListener('click', () => {
            const soundPath = button.dataset.sound;
            const audio = new Audio(soundPath);
            audio.play().catch(error => console.error("Error playing sound:", error));
        });
    });


    // ====================================================== //
    // 3. QUIZ LOGIC                                          //
    // ====================================================== //
    
    const quizContainer = document.getElementById('quiz-container');
    const quizOptions = document.querySelector('.quiz-options');
    
    // Minimal quiz data (can be expanded)
    const quizData = {
        hiragana: [
            { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
            { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
            { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
        ],
        katakana: [
            { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
            { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
            { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
        ]
    };

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz(type) {
        currentQuestions = shuffleArray([...quizData[type]]);
        currentQuestionIndex = 0;
        score = 0;
        quizOptions.style.display = 'none'; // Hide the choice buttons
        
        // Create quiz area if it doesn't exist
        let quizArea = document.getElementById('quiz-area');
        if (!quizArea) {
            quizArea = document.createElement('div');
            quizArea.id = 'quiz-area';
            quizContainer.appendChild(quizArea);
        }

        showQuestion();
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            endQuiz();
            return;
        }

        const question = currentQuestions[currentQuestionIndex];
        const answers = generateAnswers(question.romaji);

        const quizArea = document.getElementById('quiz-area');
        quizArea.innerHTML = `
            <p>Score: ${score} / ${currentQuestions.length}</p>
            <h3 id="quiz-question">${question.char}</h3>
            <div id="quiz-answers">
                ${answers.map(ans => `<button class="quiz-answer-btn" data-answer="${ans}">${ans}</button>`).join('')}
            </div>
        `;

        document.querySelectorAll('.quiz-answer-btn').forEach(btn => {
            btn.addEventListener('click', selectAnswer);
        });
    }

    function selectAnswer(event) {
        const selectedBtn = event.target;
        const selectedAnswer = selectedBtn.dataset.answer;
        const correctAnswer = currentQuestions[currentQuestionIndex].romaji;

        // Disable all buttons after one is clicked
        document.querySelectorAll('.quiz-answer-btn').forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            score++;
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('incorrect');
            // Highlight the correct answer
            document.querySelector(`.quiz-answer-btn[data-answer="${correctAnswer}"]`).classList.add('correct');
        }

        currentQuestionIndex++;
        setTimeout(showQuestion, 1500); // Wait 1.5s before next question
    }

    function generateAnswers(correctAnswer) {
        const allRomaji = currentQuestions.map(q => q.romaji);
        const wrongAnswers = new Set();
        while (wrongAnswers.size < 3) {
            const randomRomaji = allRomaji[Math.floor(Math.random() * allRomaji.length)];
            if (randomRomaji !== correctAnswer) {
                wrongAnswers.add(randomRomaji);
            }
        }
        return shuffleArray([correctAnswer, ...wrongAnswers]);
    }
    
    function endQuiz() {
        const quizArea = document.getElementById('quiz-area');
        quizArea.innerHTML = `
            <h2>Quiz Complete!</h2>
            <p>Your final score is ${score} out of ${currentQuestions.length}.</p>
            <button id="restart-quiz-btn" class="quiz-button">Try Again</button>
        `;
        document.getElementById('restart-quiz-btn').addEventListener('click', () => {
            quizArea.innerHTML = '';
            quizOptions.style.display = 'flex';
        });
    }

    // Utility to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Add event listeners to the main quiz choice buttons
    document.querySelectorAll('.quiz-button[data-quiz-type]').forEach(btn => {
        btn.addEventListener('click', () => startQuiz(btn.dataset.quizType));
    });
});
