document.addEventListener("DOMContentLoaded", () => {

    // 1. Header Scroll Effect
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("koyu-menu");
            } else {
                header.classList.remove("koyu-menu");
            }
        });
    }

    // 2. Hero Button Smooth Scroll
    const systemBtn = document.getElementById("systemBtn");
    const demoBtn = document.getElementById("demoBtn");
    const architectureSection = document.getElementById("architecture");
    const dashboardSection = document.getElementById("dashboard");

    if (systemBtn && architectureSection) {
        systemBtn.addEventListener("click", () => {
            architectureSection.scrollIntoView({ behavior: "smooth" });
        });
    }
    if (demoBtn && dashboardSection) {
        demoBtn.addEventListener("click", () => {
            dashboardSection.scrollIntoView({ behavior: "smooth" });
        });
    }

    // 3. Dashboard & Sensor Simulation
    const valTemp = document.getElementById("val-temp");
    const valHumidity = document.getElementById("val-humidity");
    const pumpToggleBtn = document.getElementById("pump-toggle");
    const systemStatus = document.getElementById("system-status");

    let sensorInterval;
    let isPumpActive = false;

    function updateSensorReadings() {
        if (!valTemp || !valHumidity) return;

        const newTemp = (Math.random() * 10 + 22).toFixed(1); // 22.0 - 32.0
        const newHumidity = (Math.random() * 30 + 45).toFixed(1); // 45.0 - 75.0

        valTemp.innerHTML = `${newTemp}<span class="unit">°C</span>`;
        valHumidity.innerHTML = `${newHumidity}<span class="unit">%</span>`;
    }

    if (pumpToggleBtn) {
        pumpToggleBtn.addEventListener("click", togglePump);
    }

    function togglePump() {
        isPumpActive = !isPumpActive;

        if (isPumpActive) {
            pumpToggleBtn.textContent = "Sistemi Durdur";
            pumpToggleBtn.classList.add("active");
            if(systemStatus) systemStatus.textContent = "SİSTEM AKTİF";
            if(systemStatus) systemStatus.style.color = "var(--success)";
            sensorInterval = setInterval(updateSensorReadings, 2500);
            logToTerminal("[SİSTEM] Sulama sistemi manuel olarak başlatıldı.", "system");
        } else {
            pumpToggleBtn.textContent = "Sulama Sistemini Başlat";
            pumpToggleBtn.classList.remove("active");
            if(systemStatus) systemStatus.textContent = "SİSTEM BEKLEMEDE";
            if(systemStatus) systemStatus.style.color = "var(--text-muted)";
            clearInterval(sensorInterval);
            logToTerminal("[SİSTEM] Sulama sistemi durduruldu.", "system");
        }
    }

    // 4. Terminal Assistant
    const terminalInput = document.getElementById("terminal-input");
    const terminalBody = document.getElementById("terminal-body");

    if (terminalInput) {
        terminalInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const command = terminalInput.value.trim().toLowerCase();
                if (command === "") return;

                logToTerminal(`> ${terminalInput.value}`, "user");
                processCommand(command);
                terminalInput.value = "";
            }
        });
    }

    function logToTerminal(message, type) {
        if (!terminalBody) return;
        const p = document.createElement("p");
        if (type === 'user') {
            p.innerHTML = `<span class="log-user">${message}</span>`;
        } else {
            p.innerHTML = message.replace('[SİSTEM]', '<span class="log-time">[SİSTEM]</span>')
                                 .replace('[ASİSTAN]', '<span class="log-time">[ASİSTAN]</span>');
        }
        terminalBody.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(command) {
        let response = "";
        switch (command) {
            case "durum":
                response = `[ASİSTAN] Sistem durumu: ${systemStatus.textContent}.`;
                break;
            case "sıcaklık":
            case "sıcaklık kaç":
                response = `[ASİSTAN] Mevcut ortam sıcaklığı: ${valTemp.textContent}.`;
                break;
            case "nem":
            case "nem kaç":
                response = `[ASİSTAN] Mevcut bağıl nem: ${valHumidity.textContent}.`;
                break;
            case "sistemi başlat":
                if (!isPumpActive) {
                    togglePump();
                    response = "[ASİSTAN] Sistem başlatılıyor...";
                } else {
                    response = "[ASİSTAN] Sistem zaten aktif durumda.";
                }
                break;
            case "sistemi durdur":
                if (isPumpActive) {
                    togglePump();
                    response = "[ASİSTAN] Sistem durduruluyor...";
                } else {
                    response = "[ASİSTAN] Sistem zaten durdurulmuş durumda.";
                }
                break;
            case "yardım":
                response = "[ASİSTAN] Kullanılabilir komutlar: 'durum', 'sıcaklık', 'nem', 'sistemi başlat', 'sistemi durdur', 'temizle'";
                break;
            case "temizle":
                if(terminalBody) terminalBody.innerHTML = `<p><span class="log-time">[ASİSTAN]</span> Terminal temizlendi. Komutlarınızı bekliyorum.</p>`;
                return; // No need to log a response for clear
            default:
                response = "[ASİSTAN] Komut anlaşılamadı. 'yardım' yazarak komutları görebilirsiniz.";
        }
        logToTerminal(response, "assistant");
    }

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-soru");
        if (question) {
            question.addEventListener("click", () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });

    // 6. Contact Form Submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

        const form = e.target;
        const formData = new FormData(form);
        const contactBtn = document.getElementById("contactBtn");
        const nameInput = document.getElementById("contactText");

        contactBtn.textContent = "Gönderiliyor...";
        contactBtn.disabled = true;

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) { // Sunucudan başarılı bir yanıt (2xx) geldiyse
                 displayFormStatus(`Teşekkürler ${nameInput.value}! Mesajınız başarıyla iletildi.`, 'success');
                 form.reset();
             } else { // Sunucudan bir hata yanıtı (4xx, 5xx) geldiyse
                 // Formspree'den gelen JSON formatındaki hatayı işlemeye çalışalım
                 response.json().then(data => {
                     if (Object.hasOwn(data, 'errors')) {
                         // Hata mesajını kullanıcıya göster
                         const errorMessage = data.errors.map(error => error.message).join(", ");
                         displayFormStatus(`Hata: ${errorMessage}`, 'error');
                     } else {
                         displayFormStatus('Bir sunucu hatası oluştu. Lütfen tekrar deneyin.', 'error');
                     }
                 });
             }
        })
        .catch(error => {
            console.error('Form gönderme hatası:', error);
            displayFormStatus('Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.', 'error');
        })
        .finally(() => {
            contactBtn.textContent = "Mesajı Gönder";
            contactBtn.disabled = false;
        });
    });
}

// Form durum mesajlarını göstermek için yardımcı fonksiyon
function displayFormStatus(message, type) {
    let statusEl = document.querySelector(".form-status-mesaji");
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status-mesaji';
        contactForm.insertAdjacentElement('afterend', statusEl);
    }

    statusEl.textContent = message;
    statusEl.style.cssText = `
        text-align: center; 
        margin-top: 20px; 
        font-weight: bold; 
        color: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
    `;

    setTimeout(() => { statusEl.textContent = ''; }, 6000);
}
});