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

    // --- OYUN FONKSİYONLARI ---
    let gameScore = 0;
    let gameActive = false;
    let gameInterval;
    let heartCount = 0;

    function startHeartsGame() {
        gameScore = 0;
        gameActive = true;
        heartCount = 0;
        document.getElementById('game-score').textContent = `Skor: ${gameScore}`;
        document.getElementById('start-hearts-game').style.display = 'none';
        document.getElementById('game-message').textContent = 'Kalpleri yakala! 💕';
        
        gameInterval = setInterval(createFallingHeart, 1000);
        
        setTimeout(() => {
            if (gameActive) {
                endGame();
            }
        }, 15000); // 15 saniye oyun süresi
    }

    function createFallingHeart() {
        if (!gameActive) return;
        
        const gameCanvas = document.getElementById('game-canvas');
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.textContent = ['💖', '💝', '💕', '💗', '💘'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * (gameCanvas.offsetWidth - 50) + 'px';
        heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        heart.addEventListener('click', () => {
            if (gameActive) {
                gameScore++;
                heartCount++;
                document.getElementById('game-score').textContent = `Skor: ${gameScore}`;
                heart.remove();
                
                // Parçacık efekti
                createHeartParticles(heart.offsetLeft, heart.offsetTop);
                
                if (gameScore >= 10) {
                    endGame(true);
                }
            }
        });
        
        gameCanvas.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 5000);
    }

    function createHeartParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.position = 'absolute';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.fontSize = '1em';
            particle.style.pointerEvents = 'none';
            particle.style.animation = `particleFloat 1s ease-out forwards`;
            particle.style.animationDelay = (i * 0.1) + 's';
            
            document.getElementById('game-canvas').appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    function endGame(won = false) {
        gameActive = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.falling-heart').forEach(heart => heart.remove());
        
        if (won) {
            document.getElementById('game-message').innerHTML = '🎉 Tebrikler! Aşkımız kazandı! 🎉';
            setTimeout(() => showStep(6), 2000);
        } else {
            document.getElementById('game-message').innerHTML = `Oyun bitti! ${gameScore} kalp yakaladın ❤️`;
            document.getElementById('start-hearts-game').style.display = 'inline-block';
            document.getElementById('start-hearts-game').textContent = 'Tekrar Oyna';
        }
    }

    // --- KONFETTI VE KUTLAMA FONKSİYONLARI ---
    function createConfetti() {
        if (typeof confetti !== 'undefined') {
            // Canvas confetti kütüphanesi varsa onu kullan
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e91e63', '#ff6b9d', '#ffc1cc', '#ffb3ba']
            });
            
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#e91e63', '#ff6b9d', '#ffc1cc']
                });
            }, 200);
            
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#e91e63', '#ff6b9d', '#ffc1cc']
                });
            }, 400);
        } else {
            // Manuel konfetti
            createManualConfetti();
        }
    }

    function createManualConfetti() {
        for (let i = 0; i < 50; i++) {
            const confettiPiece = document.createElement('div');
            confettiPiece.className = 'confetti-particle';
            confettiPiece.style.left = Math.random() * 100 + 'vw';
            confettiPiece.style.backgroundColor = ['#e91e63', '#ff6b9d', '#ffc1cc', '#ffb3ba'][Math.floor(Math.random() * 4)];
            confettiPiece.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            confettiPiece.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confettiPiece);
            
            setTimeout(() => {
                confettiPiece.remove();
            }, 5000);
        }
    }

    // Sertifika indirme fonksiyonu
    function downloadCertificate() {
        const certificate = document.getElementById('certificate');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // HTML2Canvas alternatifi - basit text tabanlı görsel
        canvas.width = 800;
        canvas.height = 600;
        
        // Arka plan
        ctx.fillStyle = '#fffdf9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Başlık
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('AŞK YEMİNİ SERTİFİKASI', canvas.width/2, 100);
        
        // İsimler
        ctx.font = 'bold 24px cursive';
        ctx.fillText(`Sinan Soytürk & ${partnerName}`, canvas.width/2, 200);
        
        // Tarih
        ctx.font = '16px serif';
        ctx.fillStyle = '#666';
        ctx.fillText(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, canvas.width/2, 500);
        
        // İndir
        const link = document.createElement('a');
        link.download = 'ask-yemini-sertifikamiz.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // Event listeners
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            createConfetti();
            celebrateBtn.textContent = '🎉 Seni Sonsuza Dek Seviyorum! 🎉';
            celebrateBtn.style.animation = 'celebrateGlow 1s infinite alternate';
        });
    }

    const downloadBtn = document.getElementById('download-certificate');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCertificate);
    }

    // CSS animasyonları dinamik ekleme
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes particleFloat {
            0% { 
                transform: translate(0, 0) scale(1); 
                opacity: 1; 
            }
            100% { 
                transform: translate(${Math.random() * 100 - 50}px, -50px) scale(0.5); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(additionalStyles);

    // İlk adımı başlat
    showStep(0);
});