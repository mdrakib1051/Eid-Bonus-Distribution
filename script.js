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

// জেলা ভিত্তিক ৫টি করে আলাদা উইশ ডাটাবেস
const regionalData = {
    dhaka: {
        title: "ঈদ মোবারক মামা!",
        suffix: "ট্যাকা পাইলা!",
        messages: [
            "মামা, এক মাস রোজা রাখছো, এখন বিরিয়ানি আর বোরহানি দিয়া ঈদ জমাইয়া ফালাইবা!",
            "টাকাটা নিয়া সোজা ধানমণ্ডি লেক অথবা হাতিরঝিল চইলা যাও, ঈদ তো আজকেই!",
            "ঢাকাইয়া পোলা বলে কথা! এই ঈদি দিয়া কাচ্চি না খাইলে তো ইজ্জত থাকবে না মামা!",
            "জ্যাম ঠেলে আসছো যখন, এই ঈদিটা তোমারই প্রাপ্য! জম্পেশ একটা ঈদ কাটাও!",
            "মামা, নতুন পাঞ্জাবি পইরা তোমারে একদম হিরো লাগতাছে! এই নাও সালামি!"
        ]
    },
    chatgaiya: {
        title: "ঈদ মোবারক অঁনারে!",
        suffix: "টিঁয়া ফাইলন!",
        messages: [
            "অঁনার ইফতারি তো খুব ভালা অইয়্যে, অহন এই টিঁয়া লই মেজবানি খাঁন গে!",
            "চাঁদগাইয়া পোয়া মানেই রয়্যাল ভাব! এই টিঁয়া লই পতেঙ্গা ঘুইরতো যান গে!",
            "অঁনারে এক্কান কথা কই, এই ঈদি দিয়া জেয়াফত উডাই ফেলুন!",
            "ও বদ্দা, ঈদি পাইলা যখন অহন তো আইসক্রিম খাওন ফরিবো!",
            "বেয়াক্কুনরে ঈদ মোবারক! এই টিঁয়া অঁনার খুশির লাই দিই ফাল্লাম!"
        ]
    },
    noakhali: {
        title: "ঈদ মোবারক ভাইয়্যা!",
        suffix: "টিঁয়া পাইছেন!",
        messages: [
            "হানি না খাই হান্তা ভাত খাইয়েন না, এই টিঁয়া লই কডবেল খাইয়েন!",
            "নোয়াখালীর হুত মানেই আগুন! এই টিঁয়া দিয়া জম্পেশ ঈদ করেন ভাইয়্যা!",
            "আঙ্গোর নোয়াখালীর মানুষ সবসময় স্পেশাল! এই সালামিটা শুধু আপনার লাই!",
            "এক মাস রোজা রাখছেন, এখন ডাব আর মিষ্টি খায়া ঈদ উডাই ফেলেন!",
            "ভাইয়্যা, এই টিঁয়া হারাইয়েন না আবার! পকেটে সাবধানে রাইখেন!"
        ]
    },
    sylheti: {
        title: "ঈদ মোবারক ওউ ভাই!",
        suffix: "টেকা ফাইলানি!",
        messages: [
            "খিতা খবর ভাই? রোজা তো ভালা করি রাখছো, অহন এই টেকা দিয়া সিন্নি রাইনদো!",
            "লন্ডন থাকি টেকা আইছে নি না আইছে, আমরা তো দিয়া দিছি! ঈদ মোবারক!",
            "সিলেটি ফুয়া মানেই স্মার্ট! এই টেকা দিয়া চা বাগানে ঘুইরা আইও!",
            "ও ভাই, সাত রঙের চা না খাইলে কিন্তু ঈদ অপূর্ণ থাইবো! জলদি যাও!",
            "আফনার ঈদ ভালা কাটুক! এই কুটি টেকা দিয়া বড় করি মেহমানদারি করউক্কা!"
        ]
    },
    barisal: {
        title: "ঈদ মোবারক মোর মনু!",
        suffix: "ট্যাকা পাইছো!",
        messages: [
            "ও মনু, রোজা তো সবটি রাখছো দেহি! এই ট্যাকা দিয়া আমতলীর হাটে গিয়া খাসি কিনো!",
            "বরিশাইল্লা পোলা মানেই হিরো! এই ট্যাকা দিয়া লঞ্চে উইঠ্যা ঘুইরা আইসো!",
            "মোর মনু কত সুন্দর হাসে! এই ট্যাকা দিয়া মিষ্টি কিইন্যা খাও!",
            "আরে আমাগো বরিশাইল্লা মেহমান! এই সালামিটা না নিলে হয়?",
            "মনু, ঈদ তো জইম্মা গ্যাছে! এই ট্যাকা দিয়া বন্ধুদের খাওয়াইয়া দাও!"
        ]
    },
    rajshahi: {
        title: "ঈদ মোবারক রে!",
        suffix: "টাকা পালি!",
        messages: [
            "কিরে ভাই, আমের দেশের মানুষ কি খবর? আম-লিচু দিয়া ঈদ করিস!",
            "রাজশাহীর মানুষ মানেই মিষ্টি ভাষা! এই টাকা দিয়া জিলিপি খাইস!",
            "এক মাস রোজা করে এখন তোকে একদম ফকফকা লাগছে রে! এই নে ঈদি!",
            "পদ্মার পাড়ে হাওয়া খাইতে যাবি না? এই টাকাটা পকেটে ভর তো!",
            "আরে বন্ধু, তোর জন্য এই স্পেশাল সালামি! ঈদ মোবারক!"
        ]
    },
    shuddho: {
        title: "ঈদ মোবারক!",
        suffix: "টাকা মাত্র",
        messages: [
            "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক আনন্দের!",
            "আপনার এই সালামি দিয়ে প্রিয়জনের জন্য ছোট একটি উপহার কিনে নিন!",
            "পবিত্র ঈদের আনন্দ ছড়িয়ে পড়ুক আপনার চারপাশ। খুব ভালো একটি ঈদ কাটুক!",
            "এক মাসের ত্যাগ আর ধৈর্য্য শেষে এই উপহার আপনার খুশির অংশ হোক!",
            "সালামি পাওয়াটা বড় কথা নয়, এই ভালোবাসাটাই মূল! ঈদ মোবারক!"
        ]
    }
};

// জেলা ভিত্তিক স্পেশাল মেসেজ জেনারেটর (৬৪ জেলার জন্য ডাইনামিক)
function getRegionalAdvice(regionKey, districtName) {
    let data = regionalData[regionKey] || regionalData['shuddho'];
    // ৫টি মেসেজের মধ্যে র‍্যান্ডম একটি সিলেক্ট
    let randomMsg = data.messages[Math.floor(Math.random() * data.messages.length)];
    
    // যদি জেনারেল জেলা হয়, তবে জেলার নাম মেসেজে ইনজেক্ট করা হবে
    if (regionKey === 'shuddho' && districtName !== '-- আপনার জেলা বেছে নিন --') {
        return `${districtName} জেলার প্রিয় মানুষ, ${randomMsg}`;
    }
    return randomMsg;
}

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    const regionSelect = document.getElementById('regionSelect');
    const districtName = regionSelect.options[regionSelect.selectedIndex].text;
    
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

    setTimeout(() => { showFinalResult(name, amount, regionSelect.value, districtName); }, 10500);
};

function showFinalResult(name, amount, regionKey, districtName) {
    const regionData = regionalData[regionKey] || regionalData['shuddho'];

    document.getElementById('action-container').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    document.getElementById('card-title').innerHTML = `${regionData.title}, <span class="text-yellow-400">${name}</span>!`;
    document.getElementById('card-amount').innerText = amount;
    document.getElementById('amount-suffix').innerText = regionData.suffix;
    
    // ডাইনামিক অ্যাডভাইস সেট করা
    document.getElementById('advice-text').innerText = getRegionalAdvice(regionKey, districtName);
    
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    addDoc(winnersCol, { name, amount, region: districtName, time: new Date() });
}

window.downloadCard = () => {
    const card = document.getElementById('gift-card');
    html2canvas(card, { scale: 3, backgroundColor: '#011f18', useCORS: true }).then(canvas => {
        const a = document.createElement('a');
        a.download = `Royal_Eid_Card_${Date.now()}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
    });
};

window.shareRaffle = () => {
    const text = `Alhamdulillah! Just received my Royal Eid Hadiya 2026. Get yours here: ${window.location.href}`;
    if (navigator.share) { navigator.share({ title: 'Eid Hadiya', text: text, url: window.location.href }); }
    else { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); }
};

onSnapshot(query(winnersCol, orderBy("time", "desc"), limit(6)), (snap) => {
    const lb = document.getElementById('leaderboard');
    lb.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        lb.innerHTML += `<div class="lb-entry"><span class="font-bold text-sm text-emerald-100 italic">${d.name} (${d.region})</span><span class="text-yellow-500 font-['Bebas_Neue'] text-3xl">৳ ${d.amount}</span></div>`;
    });
});
