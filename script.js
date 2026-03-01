import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tomar config boshao
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

const prizes = [
    { amt: 85, w: 30 }, { amt: 90, w: 30 }, { amt: 100, w: 25 }, 
    { amt: 110, w: 20 }, { amt: 130, w: 15 }, { amt: 150, w: 10 },
    { amt: 180, w: 5 }, { amt: 200, w: 3 }, { amt: 230, w: 2 }, { amt: 300, w: 1 }
];

function getWeightedPrize() {
    let pool = [];
    prizes.forEach(p => { for(let i=0; i<p.w; i++) pool.push(p.amt); });
    return pool[Math.floor(Math.random() * pool.length)];
}

window.startRaffle = async () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("দয়া করে নাম লিখুন!");

    if (localStorage.getItem('eid_2026_done')) {
        return alert("আপনি একবার সেলামি পেয়েছেন! ঈদ মোবারক!");
    }

    // UI Change
    document.getElementById('setup-box').classList.add('hidden');
    document.getElementById('envelope-area').classList.remove('hidden');
    
    const finalPrize = getWeightedPrize();
    
    // Animation trigger
    setTimeout(() => {
        document.getElementById('envelope').classList.add('open');
        document.getElementById('final-amount').innerText = "৳ " + finalPrize;
        
        setTimeout(() => {
            document.getElementById('winner-name').innerText = name;
            document.getElementById('winner-text').style.opacity = "1";
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            
            // Save to Firebase
            addDoc(winnersCol, { name, amount: finalPrize, createdAt: new Date() });
            localStorage.setItem('eid_2026_done', 'true');
        }, 1000);
    }, 500);
};

// Leaderboard listener
const q = query(winnersCol, orderBy("createdAt", "desc"), limit(8));
onSnapshot(q, (snapshot) => {
    const list = document.getElementById('leaderboard');
    list.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 winner-entry">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                        ${data.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium tracking-wide">${data.name}</span>
                </div>
                <span class="text-yellow-400 font-bold text-lg">৳${data.amount}</span>
            </div>
        `;
    });
});
