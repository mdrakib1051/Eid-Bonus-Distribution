import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ Firebase-er settings theke config ta eikhane boshao
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const winnersCol = collection(db, "winners");

const prizes = [
    { amt: 85, w: 25 }, { amt: 90, w: 25 }, { amt: 100, w: 15 }, 
    { amt: 110, w: 10 }, { amt: 130, w: 10 }, { amt: 150, w: 5 },
    { amt: 180, w: 3 }, { amt: 200, w: 3 }, { amt: 230, w: 2 }, 
    { amt: 250, w: 1 }, { amt: 300, w: 1 }
];

function getWeightedPrize() {
    let totalW = prizes.reduce((acc, p) => acc + p.w, 0);
    let random = Math.random() * totalW;
    for (let p of prizes) {
        if (random < p.w) return p.amt;
        random -= p.w;
    }
}

window.startDraw = async () => {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("দয়া করে আপনার নামটি আগে লিখুন!");
        return;
    }

    if (localStorage.getItem('hasDrawn')) {
        alert("আপনি তো একবার সেলামি পেয়েছেন! ঈদ মোবারক!");
        return;
    }

    document.getElementById('setup-box').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
    
    let counter = 0;
    let finalAmount = getWeightedPrize();
    
    let interval = setInterval(() => {
        document.getElementById('amount-display').innerText = "৳ " + Math.floor(Math.random() * 300);
        counter++;
        if (counter > 30) {
            clearInterval(interval);
            document.getElementById('amount-display').innerText = "৳ " + finalAmount;
            document.getElementById('displayName').innerText = name;
            
            confetti({ 
                particleCount: 200, 
                spread: 100, 
                origin: { y: 0.6 }, 
                colors: ['#fbbf24', '#ffffff', '#10b981'] 
            });

            addDoc(winnersCol, {
                name: name,
                amount: finalAmount,
                createdAt: new Date()
            });
            
            localStorage.setItem('hasDrawn', 'true');
        }
    }, 50);
};

const q = query(winnersCol, orderBy("createdAt", "desc"), limit(10));
onSnapshot(q, (snapshot) => {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        leaderboard.innerHTML += `
            <div class="glass-card px-6 py-5 rounded-2xl flex justify-between items-center winner-row">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-yellow-400 text-emerald-900 flex items-center justify-center font-bold text-lg">
                        ${data.name.charAt(0)}
                    </div>
                    <span class="font-semibold text-lg text-emerald-50 italic tracking-wide">${data.name}</span>
                </div>
                <span class="font-bold text-yellow-400 text-2xl">৳ ${data.amount}</span>
            </div>
        `;
    });
});
