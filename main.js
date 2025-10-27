// Typing animation script
var typed = new Typed(".text", {
    strings: ["Web Designer", "Frontend Developer", "UI/UX Enthusiast"],
    typeSpeed: 70,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

// Hamburger menu toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


// Active link highlighting on scroll
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Sticky navbar
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove toggle icon and navbar when click navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Function to handle tab switching
function setupTabs(tabContainerSelector) {
    const tabContainer = document.querySelector(tabContainerSelector);
    if (tabContainer) {
        const tabButtons = tabContainer.querySelectorAll('.tab-btn');
        const tabContents = tabContainer.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });
    }
}

// Setup tabs for both skills and projects sections
setupTabs('.skills-tabs');
setupTabs('.work-tabs');


// Certificate Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const certificateItems = document.querySelectorAll('.certificate-item');
const closeBtn = document.querySelector('.close-btn');

certificateItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = item.querySelector('img').src;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = 'none';
    }
});

// SCROLL REVEAL ANIMATION
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
});

/* Chat UI behavior */
document.addEventListener('DOMContentLoaded', () => {
    // Chat launcher: when clicked, try to find the existing Chatbase widget button and trigger it.
    const chatLauncher = document.getElementById('chat-launcher');
    const chatBadge = document.getElementById('chat-launcher-badge');

    function findChatOpenButton() {
        // common heuristics to find an embed's open button in the page
        const selectors = [
            '[data-chatbase-widget]',
            '[data-chatbase-launcher]',
            '[aria-label*="chat"]',
            '[title*="chat"]',
            '[class*="chatbase"]',
            '[class*="cb-"], [class*="chat-"], [class*="launcher"], [class*="widget"]'
        ];
        for (const sel of selectors) {
            try {
                const el = document.querySelector(sel);
                if (el) return el;
            } catch (e) { /* ignore invalid selectors */ }
        }

        // fallback: search any element that looks like a chat button by text
        const all = Array.from(document.querySelectorAll('button, a, div'));
        for (const el of all) {
            const txt = (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '').toLowerCase();
            if (txt.includes('chat') || txt.includes('help') || txt.includes('support')) return el;
        }
        return null;
    }

    async function triggerChatOpen() {
        const btn = findChatOpenButton();
        if (btn) {
            // If it's hidden inside an iframe or not directly clickable, try focusing or dispatching events.
            try {
                btn.click();
                return true;
            } catch (e) {
                try {
                    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    btn.dispatchEvent(evt);
                    return true;
                } catch (e2) {
                    console.warn('Could not programmatically click chat button', e2);
                }
            }
        }
        return false;
    }

    if (chatLauncher) {
        chatLauncher.addEventListener('click', async () => {
            const opened = await triggerChatOpen();
            if (!opened) {
                // if no native chat found, as fallback open chatbase script loader (if present) by adding a small notice
                chatLauncher.classList.add('shake');
                setTimeout(() => chatLauncher.classList.remove('shake'), 600);
                // temporarily show badge to indicate loading/failure
                chatBadge.hidden = false;
                chatBadge.innerText = '!';
                setTimeout(() => { chatBadge.hidden = true; }, 2200);
            }
        });
    }
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const chatUnread = document.getElementById('chat-unread');

    let unread = 0;

    function openChat() {
        chatPanel.style.display = 'flex';
        chatToggle.setAttribute('aria-pressed', 'true');
        chatUnread.hidden = true;
        unread = 0;
        scrollChatToBottom();
    }

    function closeChat() {
        chatPanel.style.display = 'none';
        chatToggle.setAttribute('aria-pressed', 'false');
    }

    function scrollChatToBottom() {
        setTimeout(() => { chatBody.scrollTop = chatBody.scrollHeight; }, 80);
    }

    function appendMessage(content, who = 'bot') {
        const msg = document.createElement('div');
        msg.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
        const bub = document.createElement('div');
        bub.className = 'bubble';
        bub.innerText = content;
        msg.appendChild(bub);
        chatBody.appendChild(msg);
        scrollChatToBottom();
    }

    chatToggle && chatToggle.addEventListener('click', () => {
        if (chatPanel.style.display === 'flex') {
            closeChat();
        } else {
            openChat();
        }
    });

    chatClose && chatClose.addEventListener('click', closeChat);

    chatForm && chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';

        // simple bot reply (placeholder). Replace with real API if desired.
        const typing = document.createElement('div');
        typing.className = 'msg bot';
        const tBubble = document.createElement('div');
        tBubble.className = 'bubble';
        tBubble.innerText = '...';
        typing.appendChild(tBubble);
        chatBody.appendChild(typing);
        scrollChatToBottom();

        setTimeout(() => {
            typing.remove();
            // basic helpful responses
            let reply = "I heard: '" + text + "'. I can help update content, explain code, or suggest UI tweaks. What would you like?";
            // very simple heuristic for quick answers
            if (/resume|cv/i.test(text)) reply = 'You can attach a resume link in the About section or add a prominent Download Resume button.';
            if (/projects|portfolio/i.test(text)) reply = 'Projects look best with consistent images and short descriptions—want me to align them or change styles?';
            if (/contact|email/i.test(text)) reply = 'I recommend showing a contact card with email and LinkedIn; you already have a form—do you want socials shown more prominently?';

            appendMessage(reply, 'bot');

            // if panel is closed, increment unread
            if (chatPanel.style.display !== 'flex') {
                unread += 1;
                chatUnread.hidden = false;
                chatUnread.innerText = unread > 9 ? '9+' : unread;
            }
        }, 700 + Math.random() * 600);
    });
});
