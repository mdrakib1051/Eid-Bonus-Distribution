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
    "রমজানের রোজা আপনার নফসের ওপর বিজয় ঘোষণা করুক। ঈদ হোক নতুন সূচনার প্রতীক।",
    "এক মাস সিয়াম সাধনা শেষে এই উপহার আপনার জন্য দোয়া ও ভালোবাসার নিদর্শন। ঈদ মোবারক!",
    "রোজা রাখা শুধু পানাহার ত্যাগ নয়, বরং তাকওয়া অর্জনের পথ। আল্লাহ কবুল করুন।",
    "ধৈর্যশীলদের জন্য মহান আল্লাহ সুসংবাদ দিয়েছেন। আপনার ধৈর্য ও সিয়াম কবুল হোক।",
    "সালাত ও সিয়ামের মাধ্যমে আত্মার পবিত্রতা আসে। আল্লাহ সবাইকে সঠিক পথে রাখুন।"
];

// 5 Premium SVG Gift Card Templates (Pre-generated)
const svgCardsTemplates = [
    // Template 1: Royal Crown (Gold on Deep Green)
    `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#064e3b;stop-opacity:1"/><stop offset="100%" style="stop-color:#011f18;stop-opacity:1"/></linearGradient><linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#facc15;stop-opacity:1"/><stop offset="50%" style="stop-color:#eab308;stop-opacity:1"/><stop offset="100%" style="stop-color:#facc15;stop-opacity:1"/></linearGradient></defs><rect width="500" height="300" fill="url(#g1)" rx="20" ry="20" stroke="url(#goldG)" stroke-width="5"/><path d="M 250 50 L 275 85 L 315 85 L 290 120 L 305 160 L 250 140 L 195 160 L 210 120 L 185 85 L 225 85 Z" fill="url(#goldG)" transform="translate(-10,-10)"/></svg>`,
    
    // Template 2: Islamic Star (Gold on Deep Emerald)
    `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#065f46;stop-opacity:1"/><stop offset="100%" style="stop-color:#022c22;stop-opacity:1"/></linearGradient><linearGradient id="goldG2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#facc15;stop-opacity:1"/><stop offset="100%" style="stop-color:#ca8a04;stop-opacity:1"/></linearGradient></defs><rect width="500" height="300" fill="url(#g2)" rx="25" ry="25" stroke="url(#goldG2)" stroke-width="6"/><path d="M 250 70 L 290 110 L 330 70 L 310 120 L 350 160 L 300 140 L 250 180 L 200 140 L 150 160 L 190 120 Z" fill="url(#goldG2)" transform="translate(10,10)"/></svg>`,
    
    // Template 3: Crescent Moon (Gold on Dark Sapphire)
    `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1"/><stop offset="100%" style="stop-color:#111827;stop-opacity:1"/></linearGradient><linearGradient id="goldG3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1"/><stop offset="50%" style="stop-color:#f59e0b;stop-opacity:1"/><stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1"/></linearGradient></defs><rect width="500" height="300" fill="url(#g3)" rx="30" ry="30" stroke="url(#goldG3)" stroke-width="7"/><path d="M 250 150 m -70 0 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0 M 270 150 a 50 50 0 1 1 -100 0 a 50 50 0 1 1 100 0" fill="url(#goldG3)"/></svg>`,

    // Template 4: Geometric Pattern (Silver on Deep Onyx)
    `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg"><defs><rect id="p1" width="50" height="50" fill="none" stroke="#d1d5db" stroke-width="1"/><pattern id="geoP" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(45)"><use href="#p1"/></pattern></defs><rect width="500" height="300" fill="#111" rx="15" ry="15"/><rect width="500" height="300" fill="url(#geoP)" rx="15" ry="15"/></svg>`,

    // Template 5: Calligraphy Style (Gold Brush)
    `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="300" fill="#030712" rx="40" ry="40"/><path d="M 100 100 q 50 -50 100 0 q 50 50 100 0 q 50 -50 100 0" stroke="#facc15" stroke-width="15" fill="none" stroke-linecap="round"/></svg>`
];

window.startRoyalSpin = () => {
    const name = document.getElementById('userName').value.trim();
    if (!name) return alert("দয়া করে আপনার নাম লিখুন!");
    if (localStorage.getItem('eid_26_final_vVoucher')) return alert("আপনি অলরেডি হাদিয়া নিয়ে নিয়েছেন!");

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
    localStorage.setItem('eid_26_final_vVoucher', 'true');
}

// Download Pre-generated SVG Gift Card
window.downloadSvgCard = () => {
    // Choose a random SVG template (Template 1 to 5)
    const randomTemplateIndex = Math.floor(Math.random() * svgCardsTemplates.length);
    const svgContent = svgCardsTemplates[randomTemplateIndex];
    
    // Create a data URI from the SVG content
    const svgDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.download = `Royal_Gift_Voucher_${Date.now()}.svg`; // Saves as SVG file
    a.href = svgDataUri;
    a.click();
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
