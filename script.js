// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    });
});

// Intersection Observer for Animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For timeline content specifically
                if (entry.target.classList.contains('slide-in-left') || entry.target.classList.contains('slide-in-right')) {
                    entry.target.querySelector('.timeline-content').classList.add('in-view');
                } else {
                    entry.target.classList.add('in-view');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    // Elements to observe
    const animatedElements = document.querySelectorAll(
        '.fade-up, .fade-in, .fade-left, .fade-right, .slide-in-left, .slide-in-right'
    );

    animatedElements.forEach(el => observer.observe(el));
};

// Initial triggers
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    
    // Trigger hero animations immediately if visible
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => {
            el.classList.add('in-view');
        });
    }, 100);
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
const BACKEND_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://smae-65y4.onrender.com";

function getBackendUrl(path) {
    return BACKEND_URL + path;
}

async function fetchWithFallback(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response;

}

async function fetchWithFallback(url, options) {
    try {
        return await fetch(url, options);
    } catch (error) {
        console.warn(`Fetch failed for ${url}:`, error);
        if (url.includes('localhost')) {
            const altUrl = url.replace('localhost', '127.0.0.1');
            console.warn(`Retrying with fallback URL ${altUrl}`);
            return await fetch(altUrl, options);
        }
        throw error;
    }
}

// News & Activities Tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and associated pane
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});

// CAPTCHA Implementation
let captchaResult = '';

function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate a random 5-digit number
    const chars = '0123456789';
    let captchaStr = '';
    for (let i = 0; i < 5; i++) {
        captchaStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaResult = captchaStr;
    
    // Add noise lines
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.random()*150},${Math.random()*150},${Math.random()*150},0.4)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }
    
    // Add text numbers
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    
    for (let i = 0; i < captchaStr.length; i++) {
        ctx.fillStyle = `rgb(${Math.random()*80},${Math.random()*80},${Math.random()*80})`; // Dark text
        ctx.save();
        ctx.translate(15 + (i * 20), 22);
        const rotation = (Math.random() - 0.4) * 0.4; // Mild rotation for readability
        ctx.rotate(rotation);
        ctx.fillText(captchaStr[i], 0, 0);
        ctx.restore();
    }
    
    // Add noise dots
    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(${Math.random()*200},${Math.random()*200},${Math.random()*200},0.2)`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
    
    const canvas = document.getElementById('captchaCanvas');
    const refreshBtn = document.getElementById('refreshCaptcha');
    
    if (canvas) canvas.addEventListener('click', generateCaptcha);
    if (refreshBtn) refreshBtn.addEventListener('click', generateCaptcha);
    
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userAnswer = document.getElementById('captchaAnswer').value.trim();
            const errorElement = document.getElementById('captchaError');
            const successElement = document.getElementById('formSuccessMessage');
            
            if (userAnswer.toLowerCase() !== captchaResult.toLowerCase()) {
                errorElement.textContent = 'Incorrect verification text. Please try again.';
                errorElement.style.display = 'block';
                successElement.style.display = 'none';
                generateCaptcha(); // Generate new CAPTCHA on failure
                document.getElementById('captchaAnswer').value = '';
                return;
            }

            // CAPTCHA passed
            errorElement.style.display = 'none';
            successElement.style.display = 'none';

            const formData = {
                applicantName: document.getElementById('applicantName').value.trim(),
                applicantEmail: document.getElementById('applicantEmail').value.trim(),
                applicantPhone: document.getElementById('applicantPhone').value.trim(),
                applicantDesignation: document.getElementById('applicantDesignation').value.trim(),
                instituteName: document.getElementById('instituteName').value.trim(),
                instituteAddress: document.getElementById('instituteAddress').value.trim(),
            };

            try {
                const response = await fetchWithFallback(getBackendUrl('/api/student-corner'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    successElement.textContent = data.message || 'Application submitted successfully!';
                    successElement.style.display = 'block';
                    form.reset();
                    generateCaptcha();

                    setTimeout(() => {
                        successElement.style.display = 'none';
                    }, 5000);
                } else {
                    errorElement.textContent = data.error || 'Failed to submit application. Please try again.';
                    errorElement.style.display = 'block';
                }
            } catch (error) {
                console.error('Student corner submit error:', error);
                errorElement.textContent = 'Unable to connect to server. Please ensure backend is running on http://localhost:5000';
                errorElement.style.display = 'block';
            }
        });
    }
});

/**
 * Chatbot Implementation
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle Chat Window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    // Close Chat Window
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Simple FAQ Responses Logic
    const botResponses = [
        { keywords: ['hi', 'hello', 'hey'], reply: "Hello! How can I assist you with SMAE today?" },
        { keywords: ['training', 'course', 'learn'], reply: "For trainings, please check out our Trainings section. We offer E-Bike, Solar Car, and Formula Car (EV) manufacturing courses." },
        { keywords: ['event', 'competition', 'baja', 'formula'], reply: "We host multiple events like FFS India, FKDC, and SMAE BAJA. Check our Events timeline for more details!" },
        { keywords: ['contact', 'email', 'phone', 'reach'], reply: "You can reach us at info@smae.in or call +91-9560122939. Our office is in Bengaluru." },
        { keywords: ['apply', 'register', 'join'], reply: "You can apply via the Student Page Corner section right on this page." },
    ];

    function getBotResponse(userMsg) {
        userMsg = userMsg.toLowerCase();
        
        for (let item of botResponses) {
            for (let word of item.keywords) {
                if (userMsg.includes(word)) {
                    return item.reply;
                }
            }
        }
        
        return "I'm still learning! If you need specific help, please contact us at info@smae.in.";
    }

    function addMessage(content, type) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `${type}-message`);
        
        const msgContent = document.createElement('div');
        msgContent.classList.add('message-content');
        msgContent.textContent = content;
        
        msgDiv.appendChild(msgContent);
        chatbotMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatbotMessages.appendChild(indicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatbotInput.value.trim();
        if (!message) return;

        // User message
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotInput.focus();

        // Simulate AI thinking
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const botReply = getBotResponse(message);
            addMessage(botReply, 'ai');
        }, 1000 + Math.random() * 1000); // Random delay between 1-2s
    });
});

// Instagram Widget Refresh for Live Updates
function reloadInstagramWidget() {
    const widget = document.getElementById('instagram-widget');
    if (widget) {
        // Clear existing content
        widget.innerHTML = '';
        
        // Re-add the link
        const link = document.createElement('a');
        link.href = 'https://instawidget.net/v/user/_s_m_a_e_';
        link.id = 'link-de7aff1700dda24b436ceee37dc88e2825a9780007ad4a1159267594eefb6652';
        link.textContent = '@_s_m_a_e_';
        widget.appendChild(link);
        
        // Re-add the script with timestamp to force reload
        const script = document.createElement('script');
        script.src = 'https://instawidget.net/js/instawidget.js?u=de7aff1700dda24b436ceee37dc88e2825a9780007ad4a1159267594eefb6652&width=100%&t=' + Date.now();
        widget.appendChild(script);
    }
}

// Reload every 1 minute (60000 ms) for testing - change to 300000 for production
setInterval(reloadInstagramWidget, 60000);

// ========================================
// Contact Form Handler
// ========================================

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.formMessage = document.getElementById('formMessage');
        this.apiUrl = getBackendUrl('/api/contact');
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    validateForm() {
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(err => {
            err.classList.remove('show');
            err.textContent = '';
        });
        
        // Validation
        if (!name) {
            document.getElementById('nameError').textContent = 'Name is required';
            document.getElementById('nameError').classList.add('show');
            isValid = false;
        }
        
        if (!email || !this.isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Valid email is required';
            document.getElementById('emailError').classList.add('show');
            isValid = false;
        }
        
        if (!phone || phone.length < 10) {
            document.getElementById('phoneError').textContent = 'Valid phone number is required';
            document.getElementById('phoneError').classList.add('show');
            isValid = false;
        }
        
        if (!subject) {
            document.getElementById('subjectError').textContent = 'Subject is required';
            document.getElementById('subjectError').classList.add('show');
            isValid = false;
        }
        
        if (!message) {
            document.getElementById('messageError').textContent = 'Message is required';
            document.getElementById('messageError').classList.add('show');
            isValid = false;
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Verifying...';
        this.formMessage.classList.remove('show', 'success', 'error');
        
        try {
            let recaptchaToken = null;

            const siteKeyMeta = document.querySelector('meta[name="recaptcha-site-key"]');
            const siteKey = siteKeyMeta ? siteKeyMeta.content : null;

            if (window.grecaptcha && typeof window.grecaptcha.execute === 'function' && siteKey && !siteKey.includes('YOUR_RECAPTCHA_SITE_KEY')) {
                recaptchaToken = await grecaptcha.execute(siteKey, { action: 'submit' });
            } else if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Allow local development without requiring reCAPTCHA when page is served from file:// or localhost
                recaptchaToken = 'LOCALHOST_TEST_TOKEN';
                console.warn('reCAPTCHA not available in local mode. Using localhost test token.');
            } else {
                this.formMessage.textContent = 'reCAPTCHA is not configured. Add your actual site key to the meta tag in index.html and make sure the script is loaded.';
                this.formMessage.classList.add('show', 'error');
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = 'Send Message';
                return;
            }

            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim(),
                recaptchaToken: recaptchaToken,
            };
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                this.formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                this.formMessage.classList.add('show', 'success');
                this.form.reset();
            } else {
                // Error from server
                this.formMessage.textContent = data.error || 'Failed to send message. Please try again.';
                this.formMessage.classList.add('show', 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            const msg = error.message && error.message.includes('reCAPTCHA')
                ? 'reCAPTCHA is not ready. Make sure contact.html includes the Google reCAPTCHA script and your site key is configured.'
                : 'Unable to connect to server. Make sure the backend is running on http://localhost:5000';
            this.formMessage.textContent = msg;
            this.formMessage.classList.add('show', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Send Message';
        }
    }
}

// Initialize contact form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// ========================================
// Formula SAE Blueprint Hero Animation
// ========================================

class BlueprintHeroAnimation {
    constructor() {
        this.container = document.querySelector('.particles-container');
        this.blueprintContainer = document.querySelector('.blueprint-container');
        this.formulaCar = document.querySelector('.formula-car');
        this.hero = document.querySelector('.hero');
        
        if (!this.container) return;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Generate floating particles
        this.generateParticles();
        
        // Trigger animations
        this.triggerAnimations();
    }
    
    generateParticles() {
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            this.container.appendChild(particle);
        }
    }
    
    triggerAnimations() {
        // Blueprint car drawing animation - SVG elements already have animations via CSS
        if (this.blueprintContainer) {
            this.blueprintContainer.style.opacity = '1';
        }
    }
    
    setupEventListeners() {
        // Mouse move parallax
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Touch support for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.handleMouseMove(e.touches[0]);
            }
        });
    }
    
    handleMouseMove(event) {
        const rect = this.hero.getBoundingClientRect();
        
        // Check if mouse is within hero section
        if (event.clientY < rect.top || event.clientY > rect.bottom) {
            return;
        }
        
        this.targetX = (event.clientX - rect.left) / rect.width - 0.5;
        this.targetY = (event.clientY - rect.top) / rect.height - 0.5;
        
        // Smooth parallax movement
        this.mouseX += (this.targetX - this.mouseX) * 0.1;
        this.mouseY += (this.targetY - this.mouseY) * 0.1;
        
        if (this.blueprintContainer) {
            const maxOffset = 30;
            this.blueprintContainer.style.transform = `
                translate(
                    calc(-50% + ${this.mouseX * maxOffset}px),
                    calc(-50% + ${this.mouseY * maxOffset * 0.5}px)
                )
            `;
        }
        
        requestAnimationFrame(() => {
            // Continuous parallax update
            if (this.blueprintContainer) {
                const maxOffset = 30;
                this.blueprintContainer.style.transform = `
                    translate(
                        calc(-50% + ${this.mouseX * maxOffset}px),
                        calc(-50% + ${this.mouseY * maxOffset * 0.5}px)
                    )
                `;
            }
        });
    }
}

// Initialize animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlueprintHeroAnimation();
});

// Also initialize on page load in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BlueprintHeroAnimation();
    });
} else {
    new BlueprintHeroAnimation();
}

// Membership form handler (simple local handler)
document.addEventListener('DOMContentLoaded', () => {
    const membershipForm = document.getElementById('membershipForm');
    if (!membershipForm) return;

    membershipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('memberName').value.trim();
        const email = document.getElementById('memberEmail').value.trim();
        const type = document.getElementById('memberType').value;
        const messageEl = document.getElementById('membershipMessage');

        if (!name || !email) {
            messageEl.textContent = 'Please provide name and email.';
            messageEl.style.color = 'red';
            messageEl.classList.add('show');
            return;
        }

        // For now, just show a success message. If you want, we can wire this to the backend.
        messageEl.textContent = `Thanks ${name}! We'll contact you at ${email} about ${type} membership.`;
        messageEl.style.color = 'green';
        messageEl.classList.add('show');
        membershipForm.reset();
    });
});

