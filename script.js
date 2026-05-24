let header = document.querySelector("header");
window.addEventListener("scroll", () => {
    if(window.scrollY >50){
        header.classList.add("koyu-menu");
    }else{
    header.classList.remove("koyu-menu");
    }
});


let systemBtn = document.getElementById("systemBtn");
let demoBtn = document.getElementById("demoBtn");
let hedefOzellikler = document.getElementById("features");
let hedefDemo = document.getElementById("demo");

systemBtn.addEventListener("click", () =>{
    hedefOzellikler.scrollIntoView({behavior: "smooth"});
});
demoBtn.addEventListener("click", () => {
    hedefDemo.scrollIntoView({behavior: "smooth"});
}); 


let demoSicaklik = document.getElementById("demo-sicaklik");
let demoNem = document.getElementById("demo-nem");

function sensorGuncelle(){
let yeniSicaklik = Math.floor(Math.random() * 16 ) + 20;
let yeniNem = Math.floor(Math.random() * 41) + 40;
demoSicaklik.innerHTML = `${yeniSicaklik} °C`
demoNem.innerHTML = `${yeniNem} %`
}


let sensorMotoru;
let suPompaBtn = document.getElementById("demo-pompaBtn");
let pompaAcik = false;
suPompaBtn.addEventListener("click", () => {
    if(pompaAcik == false){
        suPompaBtn.innerHTML = "Sistem : Açık";
        suPompaBtn.style.backgroundColor = "green";
        suPompaBtn.style.boxShadow = "1px 2px 32px green";
        sensorMotoru = setInterval(sensorGuncelle,2000);

        pompaAcik = true;

    }else{
        suPompaBtn.innerHTML = "Sistem : Kapalı";
        suPompaBtn.style.backgroundColor = "red";
        suPompaBtn.style.boxShadow = "1px 2px 32px red";
        clearInterval(sensorMotoru);
        pompaAcik = false;
    }
});


let gonderBtn = document.getElementById("chatGonderBtn");
let chatInput = document.getElementById("chatInput");
let chatEkran = document.getElementById("chatEkrani");

gonderBtn.addEventListener("click", () => {
    let text = chatInput.value;
    if(text.trim() ==="") return;
    let kucukText = text.toLowerCase();
    chatEkran.innerHTML += `<p><strong>Siz:</strong> ${text}</p>`;
    let anlikSicaklik = document.getElementById("demo-sicaklik").innerHTML;
    let anlikNem = document.getElementById("demo-nem").innerHTML;

    if(kucukText.includes("sıcaklık") || kucukText.includes("derece")){
        chatEkran.innerHTML += `<p><strong>Sistem:</strong> Ortam sıcaklığı şu an ${anlikSicaklik}</p>`;
    }
    else if (kucukText.includes("nem")){
        chatEkran.innerHTML += `<p><strong>Sistem:</strong> Ortam nem seviyesi şu an ${anlikNem}</p>`;
} else{
    chatEkran.innerHTML += `<p><strong>Sistem:</strong> Bu komutu anlayamadım</p>`;
}
chatInput.value = "";
chatEkran.scrollTop = chatEkran.scrollHeight;
});


let ayBtn = document.getElementById("aylikBtn");
let yilBtn = document.getElementById("yillikBtn");

yilBtn.addEventListener("click", () => {
    yilBtn.classList.add("aktif");
    ayBtn.classList.remove("aktif");
    let tumFiyatlar = document.querySelectorAll(".fiyat-degeri");

    tumFiyatlar.forEach(fiyat => {
    let aylikUcret = fiyat.getAttribute("data-aylik");
    let yillikHesap = aylikUcret * 10;
    fiyat.innerHTML = Math.floor(yillikHesap);

    let paraBirimiEtiketi = fiyat.nextElementSibling;
    if(paraBirimiEtiketi && paraBirimiEtiketi.classList.contains("para-birimi")){
        paraBirimiEtiketi.innerHTML = "$/yıl";
    }
});
});

ayBtn.addEventListener("click", () => {
    ayBtn.classList.add("aktif");
    yilBtn.classList.remove("aktif");
    let tumFiyatlar = document.querySelectorAll(".fiyat-degeri");

    tumFiyatlar.forEach(fiyat => {
        let aylikUcret = fiyat.getAttribute("data-aylik");
        fiyat.innerHTML = aylikUcret;

        let paraBirimiEtiketi = fiyat.nextElementSibling;
    if(paraBirimiEtiketi && paraBirimiEtiketi.classList.contains("para-birimi")){
        paraBirimiEtiketi.innerHTML = "$/ay";
    }
});
});



let sorular = document.querySelectorAll(".faq-soru");

sorular.forEach(soru => {

    soru.addEventListener("click", function() {

        let cevap = this.nextElementSibling;
        let mevcutStil = window.getComputedStyle(cevap).display;

        if (mevcutStil === "none") {
            cevap.style.display = "block";
            let ikon = this.querySelector("i");
            if(ikon) ikon.style.transform = "rotate(180deg)";

        } else {
            cevap.style.display = "none";
            let ikon = this.querySelector("i");
            if(ikon) ikon.style.transform = "rotate(0deg)";
        }
    });
});


document.addEventListener("submit", function(e) {
    
    if (e.target && e.target.classList.contains("contact-form")) {
        e.preventDefault(); 
        let form = e.target;
        let isimInput = form.querySelector(".contact-text");
        let mailInput = form.querySelector(".contact-mail");
        let mesajInput = form.querySelector(".contact-message");
        let gonderBtn = form.querySelector(".contact-btn");

        if (gonderBtn) {
            gonderBtn.innerHTML = "Gönderiliyor...";
            gonderBtn.style.backgroundColor = "#ff9800";
            gonderBtn.disabled = true;
        }

        setTimeout(() => {
            let eskiMesaj = document.querySelector(".form-basari-mesaji");
            if (eskiMesaj) eskiMesaj.remove();

            form.insertAdjacentHTML("afterend", `
                <div class="form-basari-mesaji" style="color: #4caf50; margin-top: 20px; font-weight: bold; text-align: center;">
                    Teşekkürler ${isimInput ? isimInput.value : ''}! Mesajınız başarıyla sisteme iletildi.
                </div>
            `);

            if (isimInput) isimInput.value = "";
            if (mailInput) mailInput.value = "";
            if (mesajInput) mesajInput.value = "";

            if (gonderBtn) {
                gonderBtn.innerHTML = "Gönder";
                gonderBtn.style.backgroundColor = "";
                gonderBtn.disabled = false;
            }

        }, 1500);
    }
});