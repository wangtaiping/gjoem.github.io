(function() {
    // Styles
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --cosai-accent: #c5a059;
            --cosai-bg: #111111;
            --cosai-text: #e0e0e0;
            --cosai-blue: #5B9BD5;
        }

        #cosai-widget-container {
            position: fixed;
            bottom: 90px;
            right: 30px;
            z-index: 10000;
            font-family: 'Montserrat', sans-serif;
        }

        #cosai-bubble {
            width: 60px;
            height: 60px;
            background: var(--cosai-accent);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            animation: cosai-pulse 2s infinite;
            transition: transform 0.3s;
            color: #000;
            text-align: center;
            line-height: 1;
        }

        #cosai-bubble:hover {
            transform: scale(1.1);
        }

        #cosai-bubble span {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        @keyframes cosai-pulse {
            0% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(197, 160, 89, 0); }
            100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); }
        }

        #cosai-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 360px;
            height: 500px;
            background: var(--cosai-bg);
            border: 1px solid #222;
            border-radius: 12px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        #cosai-window.active {
            display: flex;
        }

        #cosai-header {
            padding: 15px 20px;
            background: #1a1a1a;
            border-bottom: 1px solid #222;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #cosai-header h4 {
            margin: 0;
            font-size: 14px;
            color: var(--cosai-text);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cosai-badge {
            padding: 2px 6px;
            background: rgba(91,155,213,0.2);
            border: 1px solid var(--cosai-blue);
            color: var(--cosai-blue);
            font-size: 9px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        #cosai-close {
            cursor: pointer;
            color: #888;
            font-size: 20px;
            line-height: 1;
        }

        #cosai-chat-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .cosai-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.5;
        }

        .cosai-msg-bot {
            background: #222;
            color: #ccc;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        .cosai-msg-user {
            background: var(--cosai-accent);
            color: #000;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            font-weight: 600;
        }

        .cosai-options {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
        }

        .cosai-opt-btn {
            padding: 8px 14px;
            background: #222;
            border: 1px solid #333;
            color: var(--cosai-accent);
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: 0.2s;
        }

        .cosai-opt-btn:hover {
            border-color: var(--cosai-accent);
            background: #2a2a2a;
        }

        #cosai-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #cosai-form input {
            padding: 10px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 6px;
            color: #fff;
            font-size: 13px;
            outline: none;
        }

        #cosai-form input:focus {
            border-color: var(--cosai-accent);
        }

        #cosai-submit {
            padding: 12px;
            background: var(--cosai-accent);
            color: #000;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 12px;
        }

        #cosai-footer {
            padding: 12px;
            background: #1a1a1a;
            border-top: 1px solid #222;
            text-align: center;
        }

        #cosai-footer a {
            color: var(--cosai-accent);
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
        }

        /* Scrollbar */
        #cosai-chat-body::-webkit-scrollbar { width: 4px; }
        #cosai-chat-body::-webkit-scrollbar-track { background: transparent; }
        #cosai-chat-body::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    // HTML Structure
    const container = document.createElement('div');
    container.id = 'cosai-widget-container';
    container.innerHTML = `
        <div id="cosai-bubble">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="margin-bottom:2px;"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5-1.338C8.47 21.513 10.179 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.477 0-2.872-.392-4.08-1.077l-.29-.164-3.03.81.81-3.03-.164-.29A7.945 7.945 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
            <span>CosAI</span>
        </div>
        <div id="cosai-window">
            <div id="cosai-header">
                <h4>CosAI Beauty Assistant <span class="cosai-badge">AI</span></h4>
                <div id="cosai-close">&times;</div>
            </div>
            <div id="cosai-chat-body"></div>
            <div id="cosai-footer">
                <a href="https://wa.me/8615622220825" target="_blank">WhatsApp: +86 156-2222-0825</a>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const bubble = document.getElementById('cosai-bubble');
    const win = document.getElementById('cosai-window');
    const closeBtn = document.getElementById('cosai-close');
    const chatBody = document.getElementById('cosai-chat-body');

    let currentStep = 0;
    const leadData = {};

    const steps = [
        {
            question: "What country is your target market?",
            options: ["USA", "Europe", "Middle East", "Southeast Asia", "Latin America", "Other"],
            field: "market"
        },
        {
            question: "What product type are you interested in?",
            options: ["Skincare", "Hair Care", "Perfume", "Makeup", "Body Care", "Multiple"],
            field: "product"
        },
        {
            question: "What's your expected order quantity?",
            options: ["Under 500", "500-2,000", "2,000-10,000", "10,000+"],
            field: "quantity"
        },
        {
            question: "What's your budget range?",
            options: ["Under $5K", "$5K-$20K", "$20K-$50K", "$50K+"],
            field: "budget"
        },
        {
            question: "Great! Leave your contact and we'll send you a custom proposal.",
            isForm: true
        }
    ];

    function addMessage(text, type = 'bot') {
        const msg = document.createElement('div');
        msg.className = `cosai-msg cosai-msg-${type}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderOptions(options, field) {
        const optContainer = document.createElement('div');
        optContainer.className = 'cosai-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'cosai-opt-btn';
            btn.textContent = opt;
            btn.onclick = () => {
                leadData[field] = opt;
                addMessage(opt, 'user');
                optContainer.remove();
                currentStep++;
                nextStep();
            };
            optContainer.appendChild(btn);
        });
        chatBody.appendChild(optContainer);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function renderForm() {
        const form = document.createElement('div');
        form.id = 'cosai-form';
        form.innerHTML = `
            <input type="text" id="cosai-name" placeholder="Full Name" required>
            <input type="email" id="cosai-email" placeholder="Email Address" required>
            <input type="text" id="cosai-whatsapp" placeholder="WhatsApp Number" required>
            <button id="cosai-submit">Send</button>
        `;
        chatBody.appendChild(form);
        chatBody.scrollTop = chatBody.scrollHeight;

        document.getElementById('cosai-submit').onclick = () => {
            const name = document.getElementById('cosai-name').value;
            const email = document.getElementById('cosai-email').value;
            const whatsapp = document.getElementById('cosai-whatsapp').value;

            if (name && email && whatsapp) {
                leadData.name = name;
                leadData.email = email;
                leadData.whatsapp = whatsapp;
                leadData.timestamp = new Date().toISOString();

                // Save to localStorage
                localStorage.setItem('gjoem_ai_lead', JSON.stringify(leadData));

                form.remove();
                addMessage("Thank you! We'll contact you within 24 hours on WhatsApp.");
            } else {
                alert("Please fill in all fields.");
            }
        };
    }

    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            setTimeout(() => {
                addMessage(step.question);
                if (step.options) {
                    renderOptions(step.options, step.field);
                } else if (step.isForm) {
                    renderForm();
                }
            }, 500);
        }
    }

    bubble.onclick = () => {
        win.classList.toggle('active');
        if (win.classList.contains('active') && chatBody.children.length === 0) {
            nextStep();
        }
    };

    closeBtn.onclick = () => {
        win.classList.remove('active');
    };
})();
