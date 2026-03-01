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

const adviceList = [
    "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক আপনার জীবনে নতুন সূচনার প্রতীক।",
    "এক মাস সিয়াম সাধনা শেষে এই উপহার আপনার জন্য দোয়া ও ভালোবাসার নিদর্শন। ঈদ মোবারক!",
    "রোজা রাখা শুধু পানাহার ত্যাগ নয়, বরং তাকওয়া অর্জনের পথ। আল্লাহ আপনার রোজা কবুল করুন।",
    "যাদের জীবনে ধৈর্য আছে, আল্লাহ তাদের জন্য সর্বোত্তম পুরস্কার রেখেছেন। এই ঈদ আপনার জীবনে শান্তি আনুক।",
    "আপনার প্রতিটি ভালো কাজ আল্লাহর দরবারে কবুল হোক। এই ছোট হাদিয়া আপনার খুশির মুহূর্তকে বাড়িয়ে দিক।",
    "সালাত ও সিয়ামের মাধ্যমে আত্মার পবিত্রতা আসে। আল্লাহ আমাদের সবাইকে সঠিক পথে পরিচালিত করুন।",
    "রমজানের এই সংযম সারাজীবন আপনার পাথেয় হোক। ঈদ মোবারক এবং শুভকামনা আপনার জন্য।",
    "ইসলামের শিক্ষায় সবার সাথে খুশি ভাগ করে নেওয়াই বড় আনন্দ। আপনার ঈদ হোক আনন্দময় ও বরকতময়।",
    "রমজান শেষে ঈদের খুশিতে ভরে উঠুক আপনার মন। আল্লাহ আপনার ওপর তাঁর রহমত বর্ষণ করুন।",
    "ধৈর্যশীলদের জন্য মহান আল্লাহ সুসংবাদ দিয়েছেন। আপনার ধৈর্য ও সিয়াম কবুল হোক।",
    "রোজা আমাদের অন্যের দুঃখ বুঝতে শেখায়। এই ঈদ হোক সবার প্রতি মায়া ও মমতার প্রতিফলন।",
    "আল্লাহর ওপর ভরসা রাখুন, তিনি আপনার জন্য সর্বোত্তম ফয়সালাকারী। ঈদ মোবারক!",
    "ক্ষমা ও দয়া ইসলামের মূল শিক্ষা। এই ঈদের দিনে সব ক্ষোভ ভুলে ভালোবাসার বন্ধন গড়ে তুলুন।",
    "সিয়াম সাধনা আমাদের আত্মসংযমী করে। এই ঈদের শিক্ষা আমাদের আগামী জীবনকে সুন্দর করুক।",
    "আল্লাহর নৈকট্য লাভের মাস রমজান। দোয়া করি আপনার সব নেক উদ্দেশ্য পূরণ হোক।"
];

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("দয়া করে নাম দিন!");
    if (localStorage.getItem('eid_26_done')) return alert("আপনি অলরেডি হাদিয়া গ্রহণ করেছেন!");

    document.getElementById('action-container').classList.add('scale-110'); // Small pop
    document.getElementById('input-view').classList.add('hidden');
    document.getElementById('slot-view').classList.remove('hidden');

    const reel = document.getElementById('slot-reel');
    const prizes = [85, 90, 100, 110, 130, 150, 200, 250, 300, 500];
    const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    let reelHTML = '';
    for(let i=0; i<60; i++) {
        reelHTML += `<div class="num text-yellow-500/80">৳${Math.floor(Math.random() * 800) + 100}</div>`;
    }
    reelHTML += `<div class="num text-white font-bold scale-110">৳${finalPrize}</div>`;
    reel.innerHTML = reelHTML;

    setTimeout(() => {
        reel.style.transform = `translateY(-${60 * 160}px)`; // 160px is the num height
    }, 100);

    setTimeout(() => {
        showFinalCard(name, finalPrize);
    }, 7200); // 7.2s for royal feeling
};

function showFinalCard(name, amount) {
    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-name').innerText = name;
    document.getElementById('card-amount').innerText = "৳ " + amount;
    document.getElementById('advice-text').innerText = adviceList[Math.floor(Math.random() * adviceList.length)];
    
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    addDoc(winnersCol, { name, amount, time: new Date() });
    localStorage.setItem('eid_26_done', 'true');
}

window.downloadCard = () => {
    html2canvas(document.getElementById('gift-card'), { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Royal_Eid_Hadiya.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
};

window.shareRaffle = () => {
    const text = `Alhamdulillah! I received a special Eid Hadiya. Check yours here: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: 'Eid Hadiya', text: text, url: window.location.href });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
};

onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(3)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `<span>• ${d.name}: ৳${d.amount}</span>`;
    });
});
