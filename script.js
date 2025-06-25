document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER ---
    const envelope = document.getElementById('envelope');
    const letterCard = document.getElementById('letter-card');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const partnerNameInput = document.getElementById('partner-name-input');
    const submitNameBtn = document.getElementById('submit-name-btn');
    const celebrateBtn = document.getElementById('celebrate-btn');
    
    // --- SÖZLEŞME ELEMENTLERİ ---
    const clauseDisplayArea = document.getElementById('clause-display-area');
    const progressBar = document.getElementById('contract-progress');
    const customClauseArea = document.getElementById('custom-clause-area');
    const showAddClauseBtn = document.getElementById('show-add-clause-btn');
    const addCustomClauseBtn = document.getElementById('add-custom-clause-btn');
    const finishContractBtn = document.getElementById('finish-contract-btn');

    // --- GENEL DEĞİŞKENLER ---
    let partnerName = '';
    let contractClauses = [
        { text: 'Her sabah "Günaydın Aşkım" mesajı atılacak.', accepted: null, type: 'predefined' },
        { text: 'Tartışsak bile, sevgimiz her zaman kazanacak.', accepted: null, type: 'predefined' },
        { text: 'Haftada en az bir kez baş başa kaliteli zaman geçirilecek.', accepted: null, type: 'predefined' },
        { text: 'En zor anlarda bile birbirimizin en büyük destekçisi olunacak.', accepted: null, type: 'predefined' },
        { text: 'Geleceğe dair hayaller birlikte kurulacak.', accepted: null, type: 'predefined' }
    ];
    let currentClauseIndex = 0;
    let allClausesAnswered = false;

    // --- EMAILJS AYARLARI ---
    const EMAILJS_SERVICE_ID = 'service_qnpd30q';
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // KENDİ TEMPLATE ID'Nİ GİR
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';  // KENDİ PUBLIC KEY'İNİ GİR

    // --- ADIM GEÇİŞ FONKSİYONU ---
    function showStep(stepNumber) {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active-step');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active-step');
    }

    // --- OLAY DİNLEYİCİLERİ ---
    envelope.addEventListener('click', () => {
        envelope.querySelector('.envelope-flap').style.transform = 'rotateX(180deg)';
        setTimeout(() => showStep(1), 800);
    });
    letterCard.addEventListener('click', () => showStep(2));
    yesButton.addEventListener('click', () => showStep(3));
    noButton.addEventListener('mouseover', dodgeButton);
    noButton.addEventListener('click', dodgeButton);
    submitNameBtn.addEventListener('click', () => {
        partnerName = partnerNameInput.value.trim();
        if (partnerName === '') {
            alert('Lütfen adını gir, bu anı ölümsüzleştirelim!');
            return;
        }
        showStep(4);
        renderCurrentClause();
    });
    showAddClauseBtn.addEventListener('click', () => customClauseArea.classList.remove('hidden'));
    addCustomClauseBtn.addEventListener('click', addCustomClause);

    // ******************************************************
    // *** BURASI DÜZELTİLDİ ***
    // ******************************************************
    finishContractBtn.addEventListener('click', () => {
        showStep(5);
        runGameSequence(); // Oyun sekansı burada başlatılıyor.
    });
    // ******************************************************

    celebrateBtn.addEventListener('click', () => {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
    });

    // --- ANA FONKSİYONLAR ---
    function dodgeButton() {
        noButton.style.position = 'absolute'; // Önce pozisyonu ayarla
        noButton.classList.add('dodging');
        
        // Animasyon bitince stili temizle ki tekrar doğru yerde dursun
        noButton.addEventListener('animationend', () => {
            noButton.classList.remove('dodging');
            noButton.style.position = 'relative'; // Eski haline getir
        }, { once: true });
    }
    
    // --- SÖZLEŞME MANTIĞI ---
    function renderCurrentClause() {
        allClausesAnswered = contractClauses.filter(c => c.type === 'predefined').every(c => c.accepted !== null);
        
        if (allClausesAnswered) {
            clauseDisplayArea.innerHTML = `<div class="clause-card"><p class="clause-text">Anayasa tamamlandı! İstersen kendi maddelerini ekleyebilir veya onaylayabilirsin.</p></div>`;
            finishContractBtn.classList.remove('hidden');
            showAddClauseBtn.classList.remove('hidden'); // Kendi maddesini ekleme opsiyonunu tekrar göster
            return;
        }

        currentClauseIndex = contractClauses.findIndex(c => c.accepted === null && c.type === 'predefined');
        const clause = contractClauses[currentClauseIndex];

        clauseDisplayArea.innerHTML = `
            <div class="clause-card">
                <p class="clause-text">"${clause.text}"</p>
                <div class="clause-buttons">
                    <button class="app-button yes" data-answer="true">Kabul Ediyorum</button>
                    <button class="app-button no" data-answer="false">Tekrar Düşünelim...</button>
                </div>
            </div>
        `;

        clauseDisplayArea.querySelectorAll('.app-button').forEach(btn => {
            btn.addEventListener('click', (e) => handleClauseResponse(e.target.dataset.answer === 'true'));
        });
        
        updateProgressBar();
    }
    
    function updateProgressBar() {
        const answeredCount = contractClauses.filter(c => c.type === 'predefined' && c.accepted !== null).length;
        const totalPredefined = contractClauses.filter(c => c.type === 'predefined').length;
        const progress = (answeredCount / totalPredefined) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function handleClauseResponse(isAccepted) {
        if(currentClauseIndex !== -1) {
            contractClauses[currentClauseIndex].accepted = isAccepted;
            renderCurrentClause();
        }
    }

    function addCustomClause() {
        const input = document.getElementById('custom-clause-input');
        const text = input.value.trim();
        if (text) {
            contractClauses.push({ text: text, accepted: true, type: 'custom' });
            input.value = '';
            customClauseArea.classList.add('hidden');
            alert('Madden başarıyla eklendi! Anayasayı onaylayarak devam edebilirsin.');
        }
    }

    // --- OYUN MANTIĞI ---
    function runGameSequence() {
        const gameZone = document.getElementById('game-zone-container');
        gameZone.innerHTML = `
            <div class="content-card game-card">
                <h2>Eğlence Başlasın!</h2>
                <p id="game-zone-message">Anayasamız hazır! Ama sonsuz mutluluğa giden yolda birkaç tatlı engel var. Hazır mısın?</p>
                <button id="start-games-btn" class="app-button">Meydan Okumayı Kabul Ediyorum!</button>
            </div>
        `;
        document.getElementById('start-games-btn').addEventListener('click', runCatchHeartsGame);
    }
    
    function runCatchHeartsGame() {
        const gameZone = document.getElementById('game-zone-container');
        gameZone.innerHTML = `
            <div class="content-card game-card">
                <h2>Oyun 1: Kalp Yakalama</h2>
                <p>10 saniyede 5 kalp yakala!</p>
                <div id="game-info"><span id="game-timer">10</span>s | Skor: <span id="game-score">0</span></div>
                <div id="catch-hearts-game"></div>
            </div>
        `;

        const gameArea = document.getElementById('catch-hearts-game');
        let score = 0;
        let timer = 10;
        const timerDisplay = document.getElementById('game-timer');
        const scoreDisplay = document.getElementById('game-score');
        let heartInterval; // Interval'i dışarıda tanımla

        function createHeart() {
            if (timer > 0) {
                const heart = document.createElement('div');
                heart.innerText = '❤️';
                heart.classList.add('falling-heart');
                heart.style.left = `${Math.random() * 90}%`;
                heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
                heart.addEventListener('click', () => {
                    score++;
                    scoreDisplay.innerText = score;
                    heart.remove();
                }, { once: true });
                gameArea.appendChild(heart);
            }
        }
        heartInterval = setInterval(createHeart, 600);

        const countdown = setInterval(() => {
            timer--;
            if (timer >= 0) {
                timerDisplay.innerText = timer;
            }
            if (timer < 0) {
                clearInterval(heartInterval);
                clearInterval(countdown);
                gameArea.innerHTML = "";
                alert(score >= 5 ? 'Harika! Başardın!' : 'Neredeyse! Ama benim için her zaman kazanan sensin.');
                runUnscrambleGame();
            }
        }, 1000);
    }
    
    function runUnscrambleGame() {
        const gameZone = document.getElementById('game-zone-container');
        const word = "SONSUZA";
        const scrambled = word.split('').sort(() => 0.5 - Math.random());
        
        gameZone.innerHTML = `
            <div class="content-card game-card">
                <h2>Son Engel: Kelime Avı</h2>
                <p>Bu kelime bizim hikayemizi anlatıyor. Doğru sırala!</p>
                <div id="scrambled-word">${scrambled.map(l => `<span class="letter-tile">${l}</span>`).join('')}</div>
                <input type="text" id="unscramble-input" class="app-input" placeholder="Cevabın...">
                <button id="check-word-btn" class="app-button">Kontrol Et</button>
            </div>
        `;
        document.getElementById('check-word-btn').addEventListener('click', () => {
            const answer = document.getElementById('unscramble-input').value.toUpperCase();
            if (answer === word) {
                alert('BİLDİN! Harikasın! İşte ödülün geliyor...');
                generateCertificate();
                showStep(6);
            } else {
                alert('Hmm, tekrar dene! Bizim için doğru kelimeyi bulabilirsin.');
            }
        });
    }

    // --- FİNAL ---
    function generateCertificate() {
        document.getElementById('partner-name-display').textContent = partnerName;
        document.getElementById('partner-signature-display').textContent = partnerName;
        
        const list = document.getElementById('contract-summary-list');
        list.innerHTML = '';
        contractClauses.forEach(clause => {
            if (clause.accepted) {
                const li = document.createElement('li');
                li.textContent = clause.text;
                if(clause.type === 'custom') li.style.fontWeight = 'bold';
                list.appendChild(li);
            }
        });

        document.getElementById('cert-date').textContent = new Date().toLocaleDateString('tr-TR');
        sendEmail();
    }
    
    function sendEmail() {
        if (!EMAILJS_TEMPLATE_ID.includes('YOUR_')) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            let summary = `Kabul Edilen Maddeler:\n${contractClauses.filter(c => c.accepted === true).map(c => `- ${c.text}`).join('\n')}\n\n`;
            summary += `Tekrar Düşünülecek Maddeler:\n${contractClauses.filter(c => c.accepted === false).map(c => `- ${c.text}`).join('\n') || 'Yok'}`;
            
            const templateParams = { partner_name: partnerName, message: summary };
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                   .then(res => console.log("E-posta gönderildi.", res.status))
                   .catch(err => console.error("E-posta hatası:", err));
        }
    }

    // İlk adımı başlat
    showStep(0);
});