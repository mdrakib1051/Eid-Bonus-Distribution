import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr54ndvffLxLGLPCX4ea95MkPs6OPmoow",
    authDomain: "eid-raffle-draw.firebaseapp.com",
    projectId: "eid-raffle-draw",
    storageBucket: "eid-raffle-draw.firebasestorage.app",
    messagingSenderId: "1007792561675",
    appId: "1:1007792561675:web:f4b7cef547259f4d5db10e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const winnersCol = collection(db, "winners");

const adviceList = [
    "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক নতুন সূচনার প্রতীক।",
    "এক মাস সিয়াম সাধনা শেষে এই উপহার আপনার জন্য দোয়া ও ভালোবাসার নিদর্শন। ঈদ মোবারক!",
    "রোজা রাখা শুধু পানাহার ত্যাগ নয়, বরং তাকওয়া অর্জনের পথ। আল্লাহ কবুল করুন।",
    "ধৈর্যশীলদের জন্য মহান আল্লাহ সুসংবাদ দিয়েছেন। আপনার ধৈর্য ও সিয়াম কবুল হোক।",
    "সালাত ও সিয়ামের মাধ্যমে আত্মার পবিত্রতা আসে। আল্লাহ সবাইকে সঠিক পথে রাখুন।"
];

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("Please enter your name!");
    if (localStorage.getItem('eid_done_final')) return alert("Already Received!");

    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const amount = [85, 90, 100, 110, 130, 150, 200, 300][Math.floor(Math.random() * 8)];
    const strAmount = amount.toString().padStart(3, '0'); // Convert 85 to 085

    // Initialize Reels with dummy data
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    
    reels.forEach((reel, idx) => {
        let html = '';
        for(let i=0; i<80; i++) html += `<div class="slot-num">${Math.floor(Math.random()*10)}</div>`;
        html += `<div class="slot-num">${strAmount[idx]}</div>`;
        reel.innerHTML = html;

        // Start Spinning
        setTimeout(() => {
            reel.style.transition = `transform ${4 + idx}s cubic-bezier(0.1, 0, 0.1, 1)`;
            reel.style.transform = `translateY(-${80 * 150}px)`;
        }, 100);
    });

    setTimeout(() => {
        showFinalResult(name, amount);
    }, 7000);
};

function showFinalResult(name, amount) {
    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-name').innerText = name;
    document.getElementById('card-amount').innerText = amount; // Show only 85
    document.getElementById('advice-text').innerText = adviceList[Math.floor(Math.random() * adviceList.length)];
    
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    addDoc(winnersCol, { name, amount, time: new Date() });
    localStorage.setItem('eid_done_final', 'true');
}

window.downloadCard = () => {
    html2canvas(document.getElementById('gift-card'), { scale: 3 }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'Eid_Hadiya_2026.png';
        a.href = canvas.toDataURL();
        a.click();
    });
};

window.shareRaffle = () => {
    const text = `Received my Eid Hadiya! Check yours here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};

// Premium Leaderboard Real-time
onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(5)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `
            <div class="lb-entry">
                <span class="font-bold text-sm tracking-wide text-emerald-100">${d.name}</span>
                <span class="text-yellow-500 font-['Bebas_Neue'] text-2xl tracking-tighter">৳ ${d.amount}</span>
            </div>`;
    });
});
