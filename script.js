import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDr54ndvffLxLGLPCX4ea95MkPs6OPmoow",
    authDomain: "eid-raffle-draw.firebaseapp.com",
    projectId: "eid-raffle-draw",
    storageBucket: "eid-raffle-draw.firebasestorage.app",
    messagingSenderId: "1007792561675",
    appId: "1:1007792561675:web:f4b7cef547259f4d5db10e",
    measurementId: "G-Z882WMQH12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const winnersCol = collection(db, "winners");

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("অনুগ্রহ করে আপনার নামটি লিখুন!");
    if (localStorage.getItem('eid_26_final')) return alert("আপনি অলরেডি হাদিয়া নিয়েছেন!");

    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const reel = document.getElementById('slot-reel');
    const prizes = [85, 90, 100, 110, 130, 150, 200, 250, 300, 500];
    const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    // Create many random numbers for spinning effect
    let reelHTML = '';
    for(let i=0; i<50; i++) {
        reelHTML += `<div class="num">৳${Math.floor(Math.random() * 900) + 100}</div>`;
    }
    reelHTML += `<div class="num" id="final-stop">৳${finalPrize}</div>`;
    reel.innerHTML = reelHTML;

    // Apply Blur and Start Animation
    reel.classList.add('spinning');
    
    // Move the reel
    setTimeout(() => {
        const stopPosition = (50 * 120); // Each .num is 120px high
        reel.style.transform = `translateY(-${stopPosition}px)`;
    }, 100);

    // After 7 seconds, stop blur and show result
    setTimeout(() => {
        reel.classList.remove('spinning');
        setTimeout(() => {
            showGiftCard(name, finalPrize);
        }, 800);
    }, 6500); 
};

function showGiftCard(name, amount) {
    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-name').innerText = name;
    document.getElementById('card-amount').innerText = "৳ " + amount;
    
    confetti({ 
        particleCount: 250, 
        spread: 100, 
        origin: { y: 0.5 }, 
        colors: ['#FFD700', '#FFFFFF', '#059669'],
        ticks: 300
    });

    addDoc(winnersCol, { name, amount, time: new Date() });
    localStorage.setItem('eid_26_final', 'true');
}

window.downloadCard = () => {
    const card = document.getElementById('gift-card');
    html2canvas(card, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Royal_Hadiya_${name}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
};

window.shareRaffle = () => {
    const text = `আলহামদুলিল্লাহ! ঈদ সেলামি ২০২৬ থেকে আমি বিশেষ হাদিয়া পেয়েছি। ড্র করতে ভিজিট করুন: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};

onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(5)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `
            <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 opacity-80">
                <span class="font-bold italic text-sm text-emerald-100">${d.name}</span>
                <span class="text-yellow-500 font-['Bebas_Neue'] text-xl tracking-wider">৳ ${d.amount}</span>
            </div>`;
    });
});
