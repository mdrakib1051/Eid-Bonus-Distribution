import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
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

// Regional Data Dictionary
const regionalWishes = {
    shuddho: { title: "ঈদ মোবারক", suffix: "টাকা মাত্র", advice: "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক নতুন সূচনার প্রতীক।" },
    dhaka: { title: "ঈদ মোবারক মামা!", suffix: "ট্যাকা পাইলা!", advice: "মামা, এক মাস রোজা রাখছো, এখন বিরিয়ানি আর বোরহানি দিয়া ঈদ জমাইয়া ফালাইবা!" },
    chatgaiya: { title: "ঈদ মোবারক অঁনারে!", suffix: "টিঁয়া ফাইলন!", advice: "অঁনার ইফতারি তো খুব ভালা অইয়্যে, অহন এই টিঁয়া লই মেজবানি খাঁন গে!" },
    noakhali: { title: "ঈদ মোবারক ভাইয়্যা!", suffix: "টিঁয়া পাইছেন!", advice: "হানি না খাই হান্তা ভাত খাইয়েন না, এই টিঁয়া লই কডবেল খাইয়েন!" },
    sylheti: { title: "ঈদ মোবারক ওউ ভাই!", suffix: "টেকা ফাইলানি!", advice: "খিতা খবর ভাই? রোজা তো ভালা করি রাখছো, অহন এই টেকা দিয়া সিন্নি রাইনদো!" },
    barisal: { title: "ঈদ মোবারক মোর মনু!", suffix: "ট্যাকা পাইছো!", advice: "ও মনু, রোজা তো সবটি রাখছো দেহি! এই ট্যাকা দিয়া আমতলীর হাটে গিয়া খাসি কিনো!" }
};

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("দয়া করে আপনার নাম লিখুন!");

    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const amount = [85, 90, 100, 110, 130, 150, 200, 300, 500][Math.floor(Math.random() * 9)];
    const strAmount = amount.toString().padStart(3, '0');

    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    
    reels.forEach((reel, idx) => {
        let html = '';
        for(let i=0; i<120; i++) html += `<div class="slot-num">${Math.floor(Math.random()*10)}</div>`;
        html += `<div class="slot-num">${strAmount[idx]}</div>`;
        reel.innerHTML = html;

        setTimeout(() => {
            reel.style.transition = `transform ${6 + (idx*2)}s cubic-bezier(0.1, 0, 0.1, 1)`;
            reel.style.transform = `translateY(-${120 * 160}px)`;
        }, 100);
    });

    setTimeout(() => {
        showFinalResult(name, amount);
    }, 10500);
};

function showFinalResult(name, amount) {
    const regionKey = document.getElementById('regionSelect').value;
    const regionData = regionalWishes[regionKey];

    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    // Set Card Content
    document.getElementById('card-title').innerHTML = `${regionData.title}, <span class="text-yellow-400">${name}</span>!`;
    document.getElementById('card-amount').innerText = amount;
    document.getElementById('amount-suffix').innerText = regionData.suffix;
    document.getElementById('advice-text').innerText = regionData.advice;
    
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    addDoc(winnersCol, { name, amount, region: regionKey, time: new Date() });
}

window.downloadCard = () => {
    const card = document.getElementById('gift-card');
    html2canvas(card, { 
        scale: 3, 
        backgroundColor: '#011f18',
        useCORS: true 
    }).then(canvas => {
        const a = document.createElement('a');
        a.download = `Royal_Eid_Card_${Date.now()}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
    });
};

window.shareRaffle = () => {
    const text = `Alhamdulillah! Just received my Royal Eid Hadiya 2026. Get yours here: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: 'Eid Hadiya', text: text, url: window.location.href });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
};

onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(6)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `
            <div class="lb-entry">
                <span class="font-bold text-sm text-emerald-100 italic">${d.name}</span>
                <span class="text-yellow-500 font-['Bebas_Neue'] text-3xl">৳ ${d.amount}</span>
            </div>`;
    });
});
