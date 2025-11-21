// Data for letters
const letters = {
    1: {
        title: "Ayrılık Sözleri... 💔",
        body: `<p>Hicran'ım,</p>
        <p>"Ayrılalım" dedin, "Bitti" dedin... O an dünya başıma yıkıldı sandım. Dudaklarından dökülen her kelime kalbime bir ok gibi saplandı.</p>
        <p>Ama biliyor musun? O an bile gözlerinin içine baktığımda, o kelimelerin arkasındaki seni gördüm. Korkularını, endişelerini, belki de çaresizliğini...</p>
        <p><strong>Sen ne dersen de, kalbim seninle atmaktan vazgeçmedi.</strong></p>
        <p>Bu sadece bir başlangıç. Seni bırakmaya hiç niyetim yok. Bu yolculukta sana bunu kanıtlayacağım.</p>`
    },
    2: {
        title: "Bitti Desen De... 🔒",
        body: `<p>Canım,</p>
        <p>Bitti demekle bitmiyor işte. Kalp bir kere sevdi mi, akıl ne derse desin dinlemiyor. Sen gitmek istesen de, anılarımız, yaşanmışlıklarımız, o güzel gülüşün beni bırakmıyor.</p>
        <p>Her gece başımı yastığa koyduğumda, "bitti" kelimesi yankılanıyor ama hemen ardından senin kokun geliyor burnuma. Ve ben yine, yeniden seni seviyorum.</p>
        <p><strong>Mesafeler, kelimeler, engeller... Hiçbiri bizi bitiremez.</strong></p>
        <p>Benim sevgim, senin vazgeçişlerinden çok daha güçlü.</p>`
    },
    3: {
        title: "Bırakmayacağım ❤️",
        body: `<p>Biricik Sevgilim,</p>
        <p>Sana söz veriyorum, ne kadar zor olursa olsun, ne kadar imkansız görünürse görünsün, ben buradayım. Trabzon'dan Iğdır'a uzanan bu yol, benim sana olan inancımın yolu.</p>
        <p>Elimi tutmasan da, yüzüme bakmasan da, ben senin gölgen gibi, koruyucu meleğin gibi hep yanında olacağım.</p>
        <p><strong>Çünkü sen benim vazgeçilmezimsin.</strong></p>
        <p>Bu inat değil, bu takıntı değil. Bu, saf ve gerçek bir sevgi. Ve gerçek sevgi asla pes etmez.</p>`
    },
    4: {
        title: "Sonsuzluk Yemini ♾️",
        body: `<p>Hayatımın Anlamı,</p>
        <p>İşte buradayız. Tüm zorluklara, tüm "bitti"lere rağmen. Kalbim hala senin için çarpıyor ve biliyorum ki senin kalbinin derinliklerinde de ben varım.</p>
        <p>Bizim hikayemiz bitmedi, daha yeni başlıyor. Sen ve ben, tüm dünyaya inat, tüm mesafelere inat, sonsuza dek...</p>
        <p><strong>Seni seviyorum Hicran. Dün, bugün ve yarın. Asla bırakmayacağım.</strong></p>
        <p>Şimdi, gel bu sonsuzluğa birlikte uçalım...</p>`
    }
};

// Game State
let currentLevel = 1;
const maxLevel = 4;

// Navigation
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Gift Box Logic
const giftBox = document.getElementById('gift-box');
if (giftBox) {
    giftBox.addEventListener('click', () => {
        if (!giftBox.classList.contains('open')) {
            giftBox.classList.add('open');
            createConfetti();
            setTimeout(() => {
                navigateTo('story-screen');
            }, 2000);
        }
    });
}

// Letter Logic
function tryOpenLetter(id) {
    if (id > currentLevel) {
        // Locked animation
        const el = document.getElementById(`env-${id}`);
        el.style.animation = 'shake 0.5s';
        setTimeout(() => el.style.animation = '', 500);
        return;
    }
    
    openLetter(id);
}

function openLetter(id) {
    const letter = letters[id];
    document.getElementById('letter-title').textContent = letter.title;
    document.getElementById('letter-body').innerHTML = letter.body;
    
    // Update button based on level
    const navBtn = document.querySelector('#reading-screen .nav-btn');
    if (id < maxLevel) {
        navBtn.innerHTML = `Sıradaki Görev <i class="fas fa-puzzle-piece"></i>`;
        navBtn.onclick = () => startChallenge(id);
    } else {
        navBtn.innerHTML = `Yolculuğa Çık <i class="fas fa-plane"></i>`;
        navBtn.onclick = () => startFlightJourney();
    }
    
    navigateTo('reading-screen');
}

// Game Logic
function startChallenge(level) {
    navigateTo('game-screen');
    const gameArea = document.getElementById('game-content-area');
    const title = document.getElementById('game-title');
    const instr = document.getElementById('game-instruction');
    const feedback = document.getElementById('game-feedback');
    
    gameArea.innerHTML = '';
    feedback.classList.add('hidden');
    feedback.textContent = '';
    
    if (level === 1) {
        // Game 1: Date Code
        title.textContent = "Hatıra Şifresi";
        instr.textContent = "Her şeyin başladığı o özel tarih? (GünAyYıl - Örn: 01012025)";
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'game-input';
        input.placeholder = 'Tarihi giriniz...';
        
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.textContent = 'Kilidi Aç';
        btn.onclick = () => {
            if (input.value === '17062025' || input.value === '17.06.2025') {
                completeLevel(2);
            } else {
                feedback.textContent = 'Yanlış tarih... İpucu: Haziran';
                feedback.classList.remove('hidden');
                input.style.borderColor = 'red';
            }
        };
        
        gameArea.appendChild(input);
        gameArea.appendChild(btn);
        
    } else if (level === 2) {
        // Game 2: Catch the Heart
        title.textContent = "Kalbi Yakala";
        instr.textContent = "Kaçan kalbi 5 kez yakala!";
        
        let score = 0;
        const target = document.createElement('div');
        target.className = 'moving-target';
        target.textContent = '❤️';
        target.style.position = 'absolute';
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.textContent = `Skor: 0/5`;
        scoreDisplay.style.marginBottom = '20px';
        scoreDisplay.style.color = 'white';
        
        gameArea.appendChild(scoreDisplay);
        gameArea.appendChild(target);
        
        // Initial position
        moveTarget(target, gameArea);
        
        target.onclick = () => {
            score++;
            scoreDisplay.textContent = `Skor: ${score}/5`;
            if (score >= 5) {
                completeLevel(3);
            } else {
                moveTarget(target, gameArea);
            }
        };
        
    } else if (level === 3) {
        // Game 3: Memory Match
        title.textContent = "Aşk Hafızası";
        instr.textContent = "Kartları eşleştir!";
        
        const emojis = ['🌹', '💍', '💑', '🏰'];
        const cards = [...emojis, ...emojis];
        // Shuffle
        cards.sort(() => Math.random() - 0.5);
        
        const grid = document.createElement('div');
        grid.className = 'memory-grid';
        
        let flipped = [];
        let matched = 0;
        
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.textContent = '?';
            
            card.onclick = () => {
                if (flipped.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    card.textContent = emoji;
                    flipped.push(card);
                    
                    if (flipped.length === 2) {
                        setTimeout(() => {
                            if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
                                matched++;
                                flipped = [];
                                if (matched === emojis.length) {
                                    completeLevel(4);
                                }
                            } else {
                                flipped[0].classList.remove('flipped');
                                flipped[0].textContent = '?';
                                flipped[1].classList.remove('flipped');
                                flipped[1].textContent = '?';
                                flipped = [];
                            }
                        }, 800);
                    }
                }
            };
            grid.appendChild(card);
        });
        
        gameArea.appendChild(grid);
    }
}

function moveTarget(el, container) {
    const x = Math.random() * 200 - 100; // Simple range
    const y = Math.random() * 100 - 50;
    el.style.transform = `translate(${x}px, ${y}px)`;
}

function completeLevel(nextLevel) {
    const feedback = document.getElementById('game-feedback');
    feedback.textContent = 'Başardın! Kilit açılıyor...';
    feedback.classList.remove('hidden');
    feedback.style.color = '#4cd137';
    
    setTimeout(() => {
        currentLevel = nextLevel;
        
        // Update UI
        document.getElementById(`env-${nextLevel}`).classList.remove('locked');
        document.getElementById(`env-${nextLevel}`).classList.add('unlocked');
        document.getElementById(`env-${nextLevel}`).querySelector('.envelope-icon i').className = 'fas fa-envelope-open-text';
        document.getElementById(`env-${nextLevel}`).querySelector('.heart-seal').textContent = '❤️';
        
        if (document.getElementById(`line-${nextLevel-1}`)) {
            document.getElementById(`line-${nextLevel-1}`).classList.add('unlocked');
        }
        
        navigateTo('letters-screen');
        createConfetti();
    }, 1500);
}

// Flight Animation Logic
function startFlightJourney() {
    navigateTo('flight-screen');
    
    const plane = document.getElementById('plane-icon');
    const distanceCounter = document.getElementById('distance-counter');
    const path = document.getElementById('flight-path');
    const progressPath = document.getElementById('flight-progress');
    
    // Coordinates matching CSS positions (Trabzon -> Igdir)
    const startPos = { x: 73, y: 22 };
    const endPos = { x: 93, y: 35 };
    const controlPos = { x: 83, y: 10 }; // Curve upwards
    
    // Set SVG Path
    const pathString = `M ${startPos.x} ${startPos.y} Q ${controlPos.x} ${controlPos.y} ${endPos.x} ${endPos.y}`;
    path.setAttribute('d', pathString);
    progressPath.setAttribute('d', pathString);
    
    // Get path length for drawing animation
    const length = path.getTotalLength();
    progressPath.style.strokeDasharray = length;
    progressPath.style.strokeDashoffset = length;
    
    let start = null;
    const duration = 5000; // 5 seconds
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);
        
        // Quadratic Bezier Curve Calculation
        const t = percent;
        const x = (1-t)*(1-t)*startPos.x + 2*(1-t)*t*controlPos.x + t*t*endPos.x;
        const y = (1-t)*(1-t)*startPos.y + 2*(1-t)*t*controlPos.y + t*t*endPos.y;
        
        // Calculate rotation (Derivative)
        const dx = 2*(1-t)*(controlPos.x - startPos.x) + 2*t*(endPos.x - controlPos.x);
        const dy = 2*(1-t)*(controlPos.y - startPos.y) + 2*t*(endPos.y - controlPos.y);
        const rot = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Apply position
        plane.style.left = x + '%';
        plane.style.top = y + '%';
        plane.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        
        // Update distance text
        const currentDist = Math.floor(percent * 495);
        distanceCounter.textContent = currentDist;
        
        // Update SVG path drawing
        progressPath.style.strokeDashoffset = length - (length * percent);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            setTimeout(() => {
                navigateTo('arrival-screen');
                // Reset stages
                document.getElementById('proposal-stage').style.display = 'block';
                document.getElementById('ring-stage').style.display = 'none';
                document.getElementById('certificate-stage').style.display = 'none';
                createHearts();
            }, 500);
        }
    }
    
    requestAnimationFrame(animate);
}

// Proposal Logic
function acceptProposal() {
    const proposalStage = document.getElementById('proposal-stage');
    const ringStage = document.getElementById('ring-stage');
    const certStage = document.getElementById('certificate-stage');
    
    // 1. Hide Proposal, Show Ring
    proposalStage.style.display = 'none';
    ringStage.style.display = 'flex';
    
    // 2. Wait for animation, then Show Certificate
    setTimeout(() => {
        ringStage.style.display = 'none';
        certStage.style.display = 'block';
        
        // Set Date
        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        const dateEl = document.getElementById('cert-date');
        if(dateEl) dateEl.textContent = dateStr;
        
        // Celebration
        createConfetti();
        setInterval(createConfetti, 3000); // Continuous confetti
        
    }, 4000); // 4 seconds for ring animation
}

// Effects
function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#ffd700', '#ffffff'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '1000';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add keyframes for confetti
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(styleSheet);

function createHearts() {
    const container = document.getElementById('floating-elements');
    if (!container) return;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-20px';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.opacity = Math.random();
        heart.style.animation = `floatUp ${Math.random() * 5 + 5}s linear forwards`;
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 10000);
    }, 500);
}

// Add keyframes for hearts
styleSheet.innerText += `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;

// Music Toggle
const musicBtn = document.getElementById('music-toggle');
const audio = document.getElementById('bg-music');
let isPlaying = false;

if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audio.play().catch(e => console.log("Audio play failed", e));
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
});
