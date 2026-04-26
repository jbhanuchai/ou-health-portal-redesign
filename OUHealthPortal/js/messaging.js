/* ============================================================
   FILE: messaging.js
   PURPOSE: Interactive behavior for the Secure Messaging page.
   ============================================================
   Handles conversation switching, sending messages (UI only),
   the new-message modal, and the auto-growing compose textarea.
   ============================================================ */


/* ------------------------------------------------------------
   DATA: Conversation thread content
   ------------------------------------------------------------ */
const threads = {
    drpatel: {
        name: 'Dr. Example',
        role: 'Primary Care Physician',
        initials: 'DE',
        online: true,
        messages: [
            {
                from: 'provider',
                senderInitials: 'DE',
                senderName: 'Dr. Example',
                text: 'Hello! I\'ve reviewed your recent lab results from April 18th. Your cholesterol levels are within a healthy range, and your blood glucose is looking good.',
                time: '9:02 AM',
            },
            {
                from: 'provider',
                senderInitials: 'DE',
                senderName: 'Dr. Example',
                text: 'I did notice your blood pressure is slightly elevated at 138/88. I\'d like to monitor this over the next few weeks. Are you currently experiencing any headaches or dizziness?',
                time: '9:04 AM',
            },
            {
                from: 'patient',
                senderInitials: 'JS',
                senderName: 'You',
                text: 'Thanks for the update! I have had some mild headaches in the mornings this week, but I thought it might be related to my screen time.',
                time: '9:18 AM',
            },
            {
                from: 'patient',
                senderInitials: 'JS',
                senderName: 'You',
                text: 'Should I schedule a follow-up appointment, or is there anything I can do in the meantime?',
                time: '9:19 AM',
                attachment: null,
            },
            {
                from: 'provider',
                senderInitials: 'DE',
                senderName: 'Dr. Example',
                text: 'The morning headaches are worth keeping an eye on. I\'m attaching a home blood pressure log for you — please record readings each morning for two weeks and send it back to me.',
                time: '9:47 AM',
                attachment: { name: 'BP_Log_Template.pdf', label: 'BP Log Template' },
            },
            {
                from: 'provider',
                senderInitials: 'DE',
                senderName: 'Dr. Example',
                text: 'In the meantime, try to reduce sodium intake and aim for 30 minutes of light walking daily. We can reassess at your next visit.',
                time: '9:48 AM',
            },
        ]
    },
    nursejones: {
        name: 'Nurse Example',
        role: 'RN – Student Health Center',
        initials: 'NE',
        online: false,
        messages: [
            {
                from: 'provider',
                senderInitials: 'NE',
                senderName: 'Nurse Example',
                text: 'Hi there! This is a reminder that your annual flu vaccination is due. You can walk in to the Student Health Center Monday–Friday, 8 AM to 4 PM.',
                time: 'Mon',
            },
            {
                from: 'patient',
                senderInitials: 'JS',
                senderName: 'You',
                text: 'Thanks for the reminder! I\'ll try to come in on Wednesday afternoon.',
                time: 'Mon',
            },
            {
                from: 'provider',
                senderInitials: 'NE',
                senderName: 'Nurse Example',
                text: 'Perfect! No appointment needed. See you then.',
                time: 'Mon',
            },
        ]
    },
    pharmacy: {
        name: 'OU Pharmacy Team',
        role: 'Campus Pharmacy',
        initials: 'Rx',
        online: true,
        messages: [
            {
                from: 'provider',
                senderInitials: 'Rx',
                senderName: 'OU Pharmacy',
                text: 'Your prescription for Loratadine 10 mg (30-day supply) is ready for pickup at the Goddard Health Center pharmacy. Hours: M–F 8 AM–6 PM.',
                time: 'Yesterday',
            },
            {
                from: 'patient',
                senderInitials: 'JS',
                senderName: 'You',
                text: 'Great, thank you! Can I request a refill through this portal when I run out?',
                time: 'Yesterday',
            },
            {
                from: 'provider',
                senderInitials: 'Rx',
                senderName: 'OU Pharmacy',
                text: 'Yes! You can request refills through the portal or call us at (405) 325-4441. We\'ll notify you here when it\'s ready.',
                time: 'Yesterday',
            },
        ]
    },
};

/* Map conversation item IDs to thread keys */
const convMap = {
    'conv-drpatel':     'drpatel',
    'conv-nursejones':  'nursejones',
    'conv-pharmacy':    'pharmacy',
};

let activeThread = null;


/* ------------------------------------------------------------
   FUNCTION: buildThread
   Renders the messages for the chosen conversation.
   ------------------------------------------------------------ */
function buildThread(key) {
    const data = threads[key];
    if (!data) return;

    activeThread = key;

    /* Update thread header */
    document.getElementById('thread-avatar-text').textContent   = data.initials;
    document.getElementById('thread-name-text').textContent     = data.name;
    document.getElementById('thread-role-text').textContent     = data.role;

    /* Build messages HTML */
    const container = document.getElementById('thread-messages');
    container.innerHTML = '';

    /* Date separator – always shown as "Today" in this demo */
    const sep = document.createElement('div');
    sep.className = 'date-sep';
    sep.textContent = 'Today';
    container.appendChild(sep);

    data.messages.forEach(msg => {
        const row = document.createElement('div');
        row.className = `msg-row ${msg.from}`;

        const avClass = msg.from === 'patient' ? 'patient-av' : '';

        let attachHTML = '';
        if (msg.attachment) {
            const pillClass = msg.from === 'patient' ? '' : 'provider-attach';
            attachHTML = `
                <div class="attachment-pill ${pillClass}">
                    <img src="icons/uploadicon.svg" class="icon icon-sm" alt="" />
                    ${msg.attachment.label}
                </div>`;
        }

        row.innerHTML = `
            <div class="msg-sender-avatar ${avClass}">${msg.senderInitials}</div>
            <div class="msg-group">
                <div class="msg-sender-name">${msg.senderName}</div>
                <div class="bubble">
                    ${msg.text}
                    ${attachHTML}
                </div>
                <div class="msg-time">${msg.time}</div>
            </div>`;

        container.appendChild(row);
    });

    /* Scroll to bottom */
    container.scrollTop = container.scrollHeight;

    /* Show thread pane, hide empty state */
    document.getElementById('thread-empty').style.display   = 'none';
    document.getElementById('thread-header').style.display  = 'flex';
    document.getElementById('thread-messages').style.display = 'flex';
    document.getElementById('compose-area').style.display   = 'flex';
}


/* ------------------------------------------------------------
   FUNCTION: selectConv
   Marks a conversation item as active and loads its thread.
   ------------------------------------------------------------ */
function selectConv(itemEl, threadKey) {
    /* Clear previous active */
    document.querySelectorAll('.conv-item').forEach(el => el.classList.remove('active'));
    itemEl.classList.add('active');

    /* Remove unread badge from clicked item */
    const badge = itemEl.querySelector('.unread-badge');
    if (badge) badge.remove();

    buildThread(threadKey);
}


/* ------------------------------------------------------------
   FUNCTION: sendMessage
   Appends the composed text as a patient bubble.
   ------------------------------------------------------------ */
function sendMessage() {
    const textarea = document.getElementById('compose-input');
    const text = textarea.value.trim();
    if (!text || !activeThread) return;

    const data = threads[activeThread];
    const container = document.getElementById('thread-messages');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const row = document.createElement('div');
    row.className = 'msg-row patient';
    row.innerHTML = `
        <div class="msg-sender-avatar patient-av">JS</div>
        <div class="msg-group">
            <div class="msg-sender-name">You</div>
            <div class="bubble">${escapeHtml(text)}</div>
            <div class="msg-time">${timeStr}</div>
        </div>`;

    container.appendChild(row);
    container.scrollTop = container.scrollHeight;

    /* Also push to data so the thread persists within the session */
    data.messages.push({
        from: 'patient',
        senderInitials: 'JS',
        senderName: 'You',
        text,
        time: timeStr,
    });

    textarea.value = '';
    textarea.style.height = 'auto';

    showToast('Message sent securely.');
}


/* ------------------------------------------------------------
   UTILITY: escapeHtml
   Prevents raw HTML injection from user-typed content.
   ------------------------------------------------------------ */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


/* ------------------------------------------------------------
   FUNCTION: showToast
   ------------------------------------------------------------ */
function showToast(message) {
    const existing = document.querySelector('.msg-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'msg-toast';
    toast.innerHTML = `<img src="icons/check.svg" class="icon icon-sm" alt="" style="filter:brightness(0) invert(1)" /> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('hide'), 3200);
    setTimeout(() => toast.remove(), 3700);
}


/* ------------------------------------------------------------
   FUNCTION: openNewMsgModal / closeNewMsgModal
   ------------------------------------------------------------ */
function openNewMsgModal() {
    document.getElementById('new-msg-modal').classList.add('open');
}

function closeNewMsgModal() {
    document.getElementById('new-msg-modal').classList.remove('open');
}

function submitNewMsg() {
    const recipient = document.getElementById('modal-recipient').value;
    const subject   = document.getElementById('modal-subject').value.trim();
    const body      = document.getElementById('modal-body').value.trim();

    if (!recipient || !subject || !body) {
        alert('Please fill in all fields before sending.');
        return;
    }

    closeNewMsgModal();
    showToast('New message sent securely.');

    /* Reset modal fields */
    document.getElementById('modal-subject').value = '';
    document.getElementById('modal-body').value    = '';
}


/* ------------------------------------------------------------
   DOMContentLoaded: Wire up all event listeners.
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {

    /* Conversation list click */
    document.querySelectorAll('.conv-item').forEach(item => {
        const key = convMap[item.id];
        item.addEventListener('click', () => selectConv(item, key));
    });

    /* Auto-open first conversation */
    const first = document.querySelector('.conv-item');
    if (first) {
        const key = convMap[first.id];
        selectConv(first, key);
    }

    /* Send button */
    document.getElementById('send-btn').addEventListener('click', sendMessage);

    /* Send on Ctrl+Enter / Cmd+Enter */
    document.getElementById('compose-input').addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    /* Auto-grow compose textarea */
    document.getElementById('compose-input').addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 140) + 'px';
    });

    /* New message modal triggers */
    document.getElementById('new-msg-btn').addEventListener('click', openNewMsgModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeNewMsgModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeNewMsgModal);
    document.getElementById('modal-send-btn').addEventListener('click', submitNewMsg);

    /* Close modal by clicking the overlay backdrop */
    document.getElementById('new-msg-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('new-msg-modal')) {
            closeNewMsgModal();
        }
    });
});