import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config - Tomar config use koro
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
    "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক নতুন সূচনার প্রতীক।",
    "এক মাস সিয়াম সাধনা শেষে এই উপহার আপনার জন্য দোয়া ও ভালোবাসার নিদর্শন। ঈদ মোবারক!",
    "রোজা রাখা শুধু পানাহার ত্যাগ নয়, বরং তাকওয়া অর্জনের পথ। আল্লাহ কবুল করুন।",
    "ধৈর্যশীলদের জন্য মহান আল্লাহ সুসংবাদ দিয়েছেন। আপনার ধৈর্য ও সিয়াম কবুল হোক।",
    "সালাত ও সিয়ামের মাধ্যমে আত্মার পবিত্রতা আসে। আল্লাহ সবাইকে সঠিক পথে রাখুন।"
];

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("দয়া করে আপনার নাম লিখুন!");
    if (localStorage.getItem('eid_26_final_vFinal')) return alert("আপনি অলরেডি হাদিয়া নিয়েছেন!");

    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const amount = [85, 90, 100, 110, 130, 150, 200, 300, 500][Math.floor(Math.random() * 9)];
    const strAmount = amount.toString().padStart(3, '0');

    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    
    reels.forEach((reel, idx) => {
        let html = '';
        // High-speed long list
        for(let i=0; i<150; i++) html += `<div class="slot-num">${Math.floor(Math.random()*10)}</div>`;
        html += `<div class="slot-num">${strAmount[idx]}</div>`;
        reel.innerHTML = html;

        setTimeout(() => {
            reel.style.transition = `transform ${6 + (idx*2)}s cubic-bezier(0.1, 0, 0.1, 1)`;
            reel.style.transform = `translateY(-${150 * 160}px)`;
        }, 100);
    });

    // Reveal after 10.5 seconds
    setTimeout(() => {
        showFinalResult(name, amount);
    }, 10500);
};

function showFinalResult(name, amount) {
    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-name').innerText = name;
    document.getElementById('card-amount').innerText = amount;
    document.getElementById('advice-text').innerText = adviceList[Math.floor(Math.random() * adviceList.length)];
    
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    addDoc(winnersCol, { name, amount, time: new Date() });
    localStorage.setItem('eid_26_final_vFinal', 'true');
}

// Optimized Photo Export - Fixed White Box Issue
window.downloadCard = () => {
    // Select the special class to capture
    const card = document.querySelector('.canvas-export');
    
    // Explicitly hide the amount text briefly if html2canvas renders gradients poorly on capture
    // (Optional, gradients usually work fine with scale: 3 on modern browsers)
    
    html2canvas(card, { 
        scale: 3, 
        backgroundColor: '#011f18', // Ensure the base background is dark
        useCORS: true, // Needed if you load any assets from external domains
        onclone: (clonedDocument) => {
            // Optional: You can explicitly find and style elements in the cloned DOM before capture
            // Cloned amount should already have background-clip applied by Tailwind/CSS
        }
    }).then(canvas => {
        const a = document.createElement('a');
        a.download = `Eid_Gift_Royal_Card_${Date.now()}.png`;
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
