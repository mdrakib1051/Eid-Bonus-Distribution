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

window.startSalamiRoll = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("অনুগ্রহ করে আপনার নামটি লিখুন!");
    if (localStorage.getItem('eid_26_hadiya')) return alert("আপনি একবার হাদিয়া গ্রহণ করেছেন! ঈদ মোবারক!");

    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const slotInner = document.getElementById('slot-inner');
    const prizes = [85, 90, 100, 110, 130, 150, 200, 250, 300];
    const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    // Slot rolling for 7 seconds (Premium feel)
    let startTime = Date.now();
    let duration = 7000; 

    let timer = setInterval(() => {
        let elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
            clearInterval(timer);
            showGiftCard(name, finalPrize);
        } else {
            slotInner.innerText = "৳ " + Math.floor(Math.random() * 500);
        }
    }, 70);
};

function showGiftCard(name, amount) {
    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-name').innerText = name;
    document.getElementById('card-amount').innerText = "৳ " + amount;
    
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#fbbf24', '#ffffff', '#10b981'] });

    // Firebase Save
    addDoc(winnersCol, { name, amount, time: new Date() });
    localStorage.setItem('eid_26_hadiya', 'true');
}

// Card Download Feature
window.downloadCard = () => {
    const card = document.getElementById('gift-card');
    html2canvas(card, { backgroundColor: '#022c22' }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Eid_Gift_Card_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
};

// Social Share Feature
window.shareRaffle = () => {
    const shareText = `আলহামদুলিল্লাহ! আমি ঈদ সেলামি ২০২৬ থেকে একটি চমৎকার হাদিয়া পেয়েছি। আপনিও দোয়া ও হাদিয়া গ্রহণ করতে পারেন এই লিঙ্কে: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: 'Eid Hadiya 2026', text: shareText, url: window.location.href });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
};

// Real-time Leaderboard
onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(6)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `
            <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 winner-row">
                <span class="font-bold opacity-80 italic tracking-wide">${d.name}</span>
                <span class="text-yellow-500 font-black">৳ ${d.amount}</span>
            </div>`;
    });
});
