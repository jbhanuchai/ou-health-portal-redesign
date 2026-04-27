/* ============================================================
   FILE: appointments.js
   PURPOSE: Page behavior for the Appointments scheduling
            workflow. Drives the three step wizard, the
            calendar, the My Appointments tab, and the cancel
            modal.
   ============================================================
   Icons referenced from this file are stored in the icons
   folder. The reasonsByCategory data structure stores icon
   filenames directly (for example 'immuneblue.svg') so they
   can be dropped into the rendered markup as <img src> values.
   When an existing icon does not have a close semantic match,
   the constant PLACEHOLDER_ICON is used as a clearly identified
   stand in until a custom SVG is added.
   ============================================================ */


/* ── Icon constants ── */
// Used wherever a Font Awesome icon did not have a close
// existing SVG equivalent. Replace the file at this path
// with a real icon and every placeholder updates at once.
const PLACEHOLDER_ICON = 'placeholder.svg';


/* ── State ── */
let currentStep=1, selectedType=null, selectedDoc=null, selectedDate=null, selectedTime=null;
let cancelTargetId=null;
// Step 2 (Provider) & Step 3 (Date/Time) data — teammate's section
let appointments=[
    {id:'a1',type:'Flu Vaccine',         doc:'Dr. Sarah Mitchell', date:'May 5, 2026',  time:'4:15 PM', status:'upcoming'},
    {id:'a2',type:'Complete Physical',   doc:'Dr. Ahmed Raza',     date:'Feb 10, 2026', time:'9:00 AM', status:'past'},
    {id:'a3',type:'STI Screening Panel', doc:'Dr. James Okafor',   date:'Jan 22, 2026', time:'2:00 PM', status:'cancelled'},
];

const reasonsByCategory = {
    vaccines: {
        label: 'Vaccines & Immunizations',
        icon: 'immuneblue.svg',
        groups: [
            { title: 'High Priority', icon: 'exclamationred.svg', color: '#f59e0b', items: [
                { name: 'Flu + Covid Vaccine', icon: PLACEHOLDER_ICON, note: 'Walk-in friendly' },
                { name: 'Flu Vaccine',         icon: PLACEHOLDER_ICON, note: 'Walk-in friendly' },
                { name: 'Covid Vaccine',       icon: PLACEHOLDER_ICON, note: 'Walk-in friendly' },
            ]},
            { title: 'Other Vaccines', icon: 'otherblue.svg', color: '#3b82f6', items: [
                { name: 'Vaccination (other)', icon: 'immuneblue.svg',   note: null },
                { name: 'Travel Consult',      icon: PLACEHOLDER_ICON,   note: 'International travel prep' },
            ]}
        ]
    },
    wellness: {
        label: 'Wellness & Check-ups',
        icon: 'stethoscopeblue.svg',
        groups: [
            { title: 'Physical Exams', icon: 'plusblue.svg', color: '#16a34a', items: [
                { name: 'Complete Physical Exam and Check-Up',          icon: PLACEHOLDER_ICON,    note: null },
                { name: 'Annual Gynecological Exam',                    icon: 'whealthblue.svg',   note: null },
                { name: 'Appointment with a Sports Medicine Specialist',icon: PLACEHOLDER_ICON,    note: null },
            ]},
            { title: 'Other Wellness', icon: 'otherblue.svg', color: '#3b82f6', items: [
                { name: 'Dietitian Consult',  icon: PLACEHOLDER_ICON,  note: 'Nutrition & dietary guidance' },
                { name: 'Allergy Injection',  icon: 'immuneblue.svg',  note: 'Existing allergy patients only' },
            ]}
        ]
    },
    illness: {
        label: 'Illness & Injury',
        icon: 'thermometerblue.svg',
        groups: [
            { title: 'Respiratory & Infections', icon: 'coughblue.svg', color: '#dc2626', items: [
                { name: 'Respiratory (Cough/Cold/Sinus/COVID/Flu)',                                  icon: PLACEHOLDER_ICON, note: null },
                { name: 'Ear Problem (Pain/Itching/Drainage/Clogged)',                               icon: PLACEHOLDER_ICON, note: null },
                { name: 'Eye Problem (not for glasses/contacts prescriptions)',                      icon: PLACEHOLDER_ICON, note: null },
                { name: 'Urinary (UTI/Bladder or Kidney Infection/Blood in Urine)',                  icon: PLACEHOLDER_ICON, note: null },
                { name: 'STI (Sexually Transmitted Infection) exposures/symptoms with provider visit', icon: PLACEHOLDER_ICON, note: 'Confidential' },
            ]},
            { title: 'Pain & Injury', icon: 'sadfaceblue.svg', color: '#f97316', items: [
                { name: 'Back or Neck Pain',                                                  icon: PLACEHOLDER_ICON,        note: null },
                { name: 'Chest Pain',                                                         icon: 'chronicheartblue.svg',  note: 'Call 911 if emergency' },
                { name: 'Headache / Migraine',                                                icon: PLACEHOLDER_ICON,        note: null },
                { name: 'Fatigue',                                                            icon: PLACEHOLDER_ICON,        note: null },
                { name: 'Injury',                                                             icon: PLACEHOLDER_ICON,        note: null },
                { name: 'Abdominal (Pain/Nausea/Vomiting/Diarrhea/Constipation)',             icon: PLACEHOLDER_ICON,        note: null },
            ]},
            { title: 'Skin', icon: 'skinblue.svg', color: '#8b5cf6', items: [
                { name: 'Skin (Acne/Rash/Lesion)', icon: PLACEHOLDER_ICON, note: null },
            ]}
        ]
    },
    chronic: {
        label: 'Chronic Conditions',
        icon: 'chronicheartblue.svg',
        groups: [
            { title: 'Ongoing Management', icon: 'circlearrowblue.svg', color: '#3b82f6', items: [
                { name: 'Chronic Condition — Follow-up care',              icon: PLACEHOLDER_ICON,        note: 'Existing patients' },
                { name: 'Chronic Condition — New patient to establish care',icon: PLACEHOLDER_ICON,       note: 'First visit' },
                { name: 'ADHD Consultation',                                icon: PLACEHOLDER_ICON,        note: null },
                { name: 'Endocrine (Diabetes/Thyroid)',                     icon: 'labblue.svg',           note: null },
                { name: 'Heart (Blood Pressure/Palpitations)',              icon: 'chronicheartblue.svg',  note: null },
                { name: 'Abnormal Weight Gain or Loss',                     icon: PLACEHOLDER_ICON,        note: 'Not for treatment of obesity' },
            ]}
        ]
    },
    womens: {
        label: "Women's Health",
        icon: 'whealthblue.svg',
        groups: [
            { title: "Women's Health Services", icon: 'whealthblue.svg', color: '#ec4899', items: [
                { name: 'Annual Gynecological Exam',                                              icon: PLACEHOLDER_ICON,    note: null },
                { name: 'Birth Control Consult (all other forms)',                                icon: PLACEHOLDER_ICON,    note: null },
                { name: 'Birth Control Consult (Nexplanon and IUD)',                              icon: PLACEHOLDER_ICON,    note: 'Implant & IUD' },
                { name: 'Menstrual Cycle Issues (irregular, heavy, painful cycles, etc.)',        icon: 'appticonblue.svg',  note: null },
            ]}
        ]
    },
    mental: {
        label: 'Mental Health',
        icon: PLACEHOLDER_ICON,
        groups: [
            { title: 'Mental Health Services', icon: 'lightbulbblue.svg', color: '#8b5cf6', items: [
                { name: 'Mental Health (Anxiety/Depression/Insomnia/Stress)', icon: PLACEHOLDER_ICON, note: 'Counseling referrals available' },
                { name: 'ADHD Consultation',                                  icon: PLACEHOLDER_ICON, note: null },
            ]},
            { title: 'Important Note', icon: 'infoblue.svg', color: '#f97316', items: [
                { name: 'University Counseling Center (separate service)', icon: PLACEHOLDER_ICON, note: 'This portal does NOT connect to UCC — call 405-325-2911' },
            ]}
        ]
    },
    specialist: {
        label: 'Specialist & Other',
        icon: 'specialistblue.svg',
        groups: [
            { title: 'Specialist Appointments', icon: 'specialistblue.svg', color: '#0ea5e9', items: [
                { name: 'Appointment with a Sports Medicine Specialist', icon: PLACEHOLDER_ICON,   note: null },
                { name: 'Dietitian Consult',                              icon: PLACEHOLDER_ICON,   note: 'Nutrition guidance' },
                { name: 'Allergy Injection',                              icon: 'immuneblue.svg',   note: 'Existing allergy patients only' },
                { name: 'Travel Consult',                                 icon: PLACEHOLDER_ICON,   note: 'Pre-travel health planning' },
            ]}
        ]
    },
    lab: {
        label: 'Lab & Screenings',
        icon: 'labblue.svg',
        groups: [
            { title: 'STI Screenings', icon: 'search.svg', color: '#16a34a', items: [
                { name: 'STI Screening Panel (no symptoms/known exposure)',  icon: 'labblue.svg',     note: 'No provider visit needed' },
                { name: 'STI — exposures/symptoms (with provider visit)',     icon: PLACEHOLDER_ICON,  note: 'Includes consultation' },
            ]},
            { title: 'Other Lab Work', icon: 'labblue.svg', color: '#3b82f6', items: [
                { name: 'Blood Draw / Lab Order', icon: PLACEHOLDER_ICON, note: 'Requires existing lab order' },
            ]}
        ]
    },
    telehealth: {
        label: 'Telehealth — Virtual Visit',
        icon: PLACEHOLDER_ICON,
        groups: [
            { title: 'Oklahoma Residents Only', icon: 'locationblue.svg', color: '#f97316', items: [
                { name: 'Respiratory (Cough/Cold/Sinus/COVID/Flu)',           icon: PLACEHOLDER_ICON, note: null },
                { name: 'Mental Health (Anxiety/Depression/Insomnia/Stress)', icon: PLACEHOLDER_ICON, note: null },
                { name: 'Chronic Condition — Follow-up care',                 icon: PLACEHOLDER_ICON, note: null },
                { name: 'Urinary (UTI/Bladder or Kidney Infection)',          icon: PLACEHOLDER_ICON, note: null },
                { name: 'Skin (Acne/Rash/Lesion)',                            icon: PLACEHOLDER_ICON, note: null },
            ]},
            { title: 'Telehealth Info', icon: 'infoblue.svg', color: '#3b82f6', items: [
                { name: 'Please check in 15 min before your appointment. Appointments after 4pm should arrive and check in by 4pm.', icon: 'clockblue.svg', note: 'Important' },
            ]}
        ]
    }
};

/* ── Nav ── */
function setActive(btn){
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
}

/* ── Tab switching ── */
function showTab(tab){
    const schedPane = document.getElementById('pane-schedule');
    const managePane = document.getElementById('pane-manage');
    const stepper = document.getElementById('stepper');

    if(tab === 'schedule'){
        schedPane.style.display = 'block';
        managePane.style.display = 'none';
        // Restore stepper visibility
        if(document.getElementById('successScreen').classList.contains('show')){
            stepper.style.display = 'none';
        } else {
            stepper.style.display = 'flex';
        }
    } else {
        // My Appointments — hide everything from schedule tab
        schedPane.style.display = 'none';
        managePane.style.display = 'block';
        renderAppointments('upcoming');
        switchApptTab('upcoming');
    }
    document.getElementById('tab-schedule').classList.toggle('active', tab==='schedule');
    document.getElementById('tab-manage').classList.toggle('active', tab==='manage');
}

/* ── Stepper ── */
function goStep(n){
    document.getElementById('panel'+currentStep).classList.remove('active');
    currentStep=n;
    document.getElementById('panel'+currentStep).classList.add('active');
    // Hide step 1 button row whenever we leave step 1
    if(n !== 1) document.getElementById('btn-row-1').style.display = 'none';
    // Restore step 1 button row when going back, if a reason was already picked
    if(n === 1 && selectedType) document.getElementById('btn-row-1').style.display = 'flex';
    // Show or hide step 2 back button
    document.getElementById('btn-row-2').style.display = (n===2) ? 'flex' : 'none';
    updateStepper();
    if(n===4) fillSummary();
    window.scrollTo({top:0,behavior:'smooth'});
}
function updateStepper(){
    const s1  = document.getElementById('sc1');
    const s2  = document.getElementById('sc2');
    const s4  = document.getElementById('sc4');
    const sn1 = document.getElementById('sn1');
    const sn2 = document.getElementById('sn2');
    const sn4 = document.getElementById('sn4');
    const c1  = document.getElementById('conn1');
    const c2  = document.getElementById('conn2');
    // Step 1
    if(s1) s1.className = 'step-circle ' + (currentStep > 1 ? 'done' : 'active');
    if(sn1) sn1.classList.toggle('muted', false);
    // Step 2
    if(s2) s2.className = 'step-circle ' + (currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'inactive');
    if(sn2) sn2.classList.toggle('muted', currentStep < 2);
    // Step 3 (panel4)
    if(s4) s4.className = 'step-circle ' + (currentStep === 4 ? 'active' : currentStep > 4 ? 'done' : 'inactive');
    if(sn4) sn4.classList.toggle('muted', currentStep < 4);
    // Connectors
    if(c1) c1.classList.toggle('done', currentStep >= 2);
    if(c2) c2.classList.toggle('done', currentStep >= 4);
}

/* ── Step 1 – Category & Reason ── */
function selectCategory(el){
    const cat = (typeof el === 'string') ? el : el.dataset.cat;
    // highlight selected card
    document.querySelectorAll('.type-card').forEach(c=>{
        c.classList.toggle('selected', c.dataset.cat===cat);
    });
    const data = reasonsByCategory[cat];
    document.getElementById('phase-b-title').textContent = data.label + ' — Choose your reason';
    const container = document.getElementById('reason-list');
    document.getElementById('phase-b-title').textContent = 'Choose your reason for visit';
    document.getElementById('phase-b-badge-text').textContent = data.label;
    container.innerHTML = data.groups.map(g=>`
        <div style="margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1.5px solid #f0f5ff">
                <span style="width:26px;height:26px;border-radius:7px;background:${g.color}22;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
                    <img src="icons/${g.icon}" alt="" style="width:14px;height:14px" />
                </span>
                <span style="font-size:11px;font-weight:800;color:var(--text-light);text-transform:uppercase;letter-spacing:.08em">${g.title}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:7px">
                ${g.items.map(r=>`
                <button class="reason-row-btn" onclick="selectReason(this)" data-reason="${r.name.replace(/"/g,'&quot;')}">
                    <span class="reason-row-text">
                        <span class="reason-row-name">${r.name}</span>
                        ${r.note ? `<span class="reason-row-note"><img src="icons/info.svg" alt="" style="width:9px;height:9px;margin-right:3px;vertical-align:middle" />${r.note}</span>` : ''}
                    </span>
                    <span class="reason-row-check"></span>
                </button>`).join('')}
            </div>
        </div>
    `).join('<div style="height:1px;background:linear-gradient(90deg,#dbeafe80,transparent);margin:4px 0 20px"></div>');
    document.getElementById('phase-a').style.display='none';
    document.getElementById('phase-b').style.display='block';
    document.getElementById('btn-row-1').style.display='flex';
    document.getElementById('btn1').disabled=true;
    selectedType=null;
    setTimeout(()=>document.getElementById('phase-b').scrollIntoView({behavior:'smooth',block:'start'}),50);
}

function backToCategories(){
    document.getElementById('phase-a').style.display='block';
    document.getElementById('phase-b').style.display='none';
    document.getElementById('btn-row-1').style.display='none';
    document.getElementById('btn-row-1').style.display='none';
    document.getElementById('btn1').disabled=true;
    selectedType=null;
}

function selectReason(el){
    document.querySelectorAll('.reason-row-btn').forEach(c=>c.classList.remove('selected'));
    el.classList.add('selected');
    selectedType = el.dataset.reason || el.querySelector('.reason-row-name').textContent.trim();
    document.getElementById('btn1').disabled=false;
    // Show preview
    // Scroll preview into view

}




/* ── Step 4 – Summary ── */
function fillSummary(){
    document.getElementById('sum-type').textContent = selectedType || '—';
    document.getElementById('sum-doc').textContent  = selectedDoc  || '—';
    document.getElementById('sum-date').textContent = selectedDate || '—';
    document.getElementById('sum-time').textContent = selectedTime || '—';
}
function confirmAppt(){
    const a={id:'a'+Date.now(),type:selectedType,doc:selectedDoc||'TBD',date:selectedDate||'TBD',time:selectedTime||'TBD',status:'upcoming'};
    appointments.unshift(a);
    document.getElementById('successMsg').textContent=`Your "${selectedType}" appointment has been scheduled with ${selectedDoc||'your provider'} on ${selectedDate||'TBD'} at ${selectedTime||'TBD'}.`;
    document.getElementById('panel4').classList.remove('active');
    document.getElementById('stepper').style.display='none';
    document.getElementById('successScreen').classList.add('show');
}
function resetScheduler(){
    selectedType=null;selectedDoc=null;selectedDate=null;selectedTime=null;currentStep=1;
    calSelDay=null;calSelTime=null;calSelDocIdx=null;
    document.getElementById('stepper').style.display='flex';
    document.getElementById('successScreen').classList.remove('show');
    document.querySelectorAll('.type-card').forEach(c=>c.classList.remove('selected'));
    document.querySelectorAll('.reason-row-btn').forEach(c=>c.classList.remove('selected'));
    document.getElementById('phase-a').style.display='block';
    document.getElementById('phase-b').style.display='none';
    document.getElementById('btn-row-1').style.display='none';
    document.getElementById('btn1').disabled=true;
    document.getElementById('panel1').classList.add('active');
    // Reset calendar panel
    document.getElementById('cal-empty').style.display='';
    document.getElementById('cal-detail').style.display='none';
    calRender();
    updateStepper();
}

/* ── My Appointments ── */
function renderAppointments(status){
    const list=appointments.filter(a=>a.status===status);
    const el=document.getElementById('appt-'+status);
    if(!list.length){el.innerHTML='<div class="empty-state"><img src="icons/'+PLACEHOLDER_ICON+'" alt="" style="width:40px;height:40px;margin-bottom:14px;display:block" /><p>No '+status+' appointments.</p></div>';return;}
    el.innerHTML=list.map(a=>{
        const pts=a.date.split(' '),mon=pts[0],day=parseInt(pts[1]);
        const badge=a.status==='upcoming'?'badge-upcoming':a.status==='past'?'badge-completed':'badge-cancelled';
        const label=a.status==='upcoming'?'Upcoming':a.status==='past'?'Completed':'Cancelled';
        return`<div class="appt-card" id="card-${a.id}">
            <div class="appt-date-block"><div class="appt-month">${mon}</div><div class="appt-day">${day}</div></div>
            <div class="appt-info">
                <div class="appt-title">${a.type}</div>
                <div class="appt-sub">${a.doc} &nbsp;·&nbsp; ${a.time} &nbsp;·&nbsp; Goddard Health Center</div>
                <span class="appt-badge ${badge}">${label}</span>
            </div>
            ${a.status==='upcoming'?`<div class="appt-actions"><button class="appt-btn" onclick="rescheduleAppt('${a.id}')">Reschedule</button><button class="appt-btn cancel" onclick="openCancelModal('${a.id}')">Cancel</button></div>`:''}
        </div>`;
    }).join('');
}
function switchApptTab(tab){
    ['upcoming','past','cancelled'].forEach(t=>{document.getElementById('appt-'+t).style.display=t===tab?'block':'none';document.getElementById('mtab-'+t).classList.toggle('active',t===tab);});
    renderAppointments(tab);
}
function rescheduleAppt(id){
    const a=appointments.find(x=>x.id===id);if(!a)return;
    appointments=appointments.filter(x=>x.id!==id);
    showTab('schedule');resetScheduler();
}
function openCancelModal(id){cancelTargetId=id;document.getElementById('cancelModal').classList.add('open');}
function closeModal(){document.getElementById('cancelModal').classList.remove('open');cancelTargetId=null;}
function doCancel(){
    const a=appointments.find(x=>x.id===cancelTargetId);
    if(a){
        a.status='cancelled';
        // Free up the slot so others can book it
    }
    closeModal();
    renderAppointments('upcoming');
}

/* Calendar */
const CAL_MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CAL_MONTHS_S = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const CAL_DAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const CAL_DOWS     = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ALL OF THIS INFO WILL BE HARD-CODED LOL*/
const CAL_AVAIL = {
    '2026-4': [5,7,11,13,18,22,26,28],
    '2026-5': [2,4,9,11,16,18,23,25],
};
const CAL_TIME_SETS = [
    ['8:00 AM','8:30 AM','10:00 AM','10:30 AM','2:00 PM','3:30 PM'],
    ['8:00 AM','9:00 AM','11:00 AM','1:30 PM','3:00 PM','4:00 PM'],
    ['8:30 AM','9:30 AM','10:30 AM','2:30 PM','3:30 PM','4:30 PM'],
    ['9:00 AM','10:00 AM','11:30 AM','1:00 PM','2:00 PM','4:00 PM'],
];
const CAL_DOCS = [
    { name:'Dr. Carter Norvell',    role:'Primary Care Physician',  color:'#3b82f6', init:'CN' },
    { name:'Dr. Jamari Davis',      role:'Internal Medicine',       color:'#8b5cf6', init:'JD' },
    { name:'Dr. Gavin Sonnenburg',  role:'Family Medicine',         color:'#06b6d4', init:'GS' },
    { name:'Dr. Phuong Nguyen',     role:'General Practice',        color:'#f97316', init:'PN' },
];
const CAL_DOC_SETS = [[0,1],[1,2],[0,2,3],[1,3],[0,1,2]];

let calYear=2026, calMonth=4, calSelDay=null, calSelTime=null, calSelDocIdx=null;

function calRender(){
    document.getElementById('cal-month-label').textContent = CAL_MONTHS[calMonth]+' '+calYear;
    const fd = new Date(calYear,calMonth,1).getDay();
    const nd = new Date(calYear,calMonth+1,0).getDate();
    const td = new Date(); td.setHours(0,0,0,0);
    const key = calYear+'-'+calMonth;
    const av  = CAL_AVAIL[key]||[];
    let h = CAL_DAYS.map(d=>`<div class="cal-day-name">${d}</div>`).join('');
    for(let i=0;i<fd;i++) h+=`<div class="cal-day"></div>`;
    
    for(let d=1;d<=nd;d++){
        const dt=new Date(calYear,calMonth,d);
        const past=dt<td;
        const isAv=av.includes(d);
        const isSel=calSelDay===d;
        let cls='cal-day';
        if(past){ cls+=' cal-past'; h+=`<div class="${cls}">${d}</div>`; continue; }
        if(isAv){ cls+=' cal-avail'; if(isSel) cls+=' cal-sel'; }
        else { cls+=' cal-unavail'; }
        h+=`<div class="${cls}" ${isAv?`onclick="calPickDay(${d})"`:''}>${d}</div>`;
    }
    document.getElementById('cal-grid').innerHTML=h;
}

function changeMonth(dir){
    calMonth+=dir;
    if(calMonth<0){calMonth=11;calYear--;} if(calMonth>11){calMonth=0;calYear++;}
    calSelDay=null; calSelTime=null; calSelDocIdx=null;
    calRender();
    document.getElementById('cal-empty').style.display='';
    document.getElementById('cal-detail').style.display='none';
}

function calPickDay(d){
    calSelDay=d; calSelTime=null; calSelDocIdx=null;
    calRender();
    const dt=new Date(calYear,calMonth,d);
    document.getElementById('d-mon').textContent   = CAL_MONTHS_S[calMonth];
    document.getElementById('d-day').textContent   = d;
    document.getElementById('d-dow').textContent   = CAL_DOWS[dt.getDay()].slice(0,3).toUpperCase();
    document.getElementById('d-title').textContent = CAL_DOWS[dt.getDay()]+', '+CAL_MONTHS[calMonth]+' '+d;
    const times = CAL_TIME_SETS[d % CAL_TIME_SETS.length];
    document.getElementById('d-sub').textContent   = times.length+' time slots available';
    document.getElementById('cal-times').innerHTML = times.map(t=>
        `<div class="cal-t-chip" onclick="calPickTime(this,'${t}')">${t}</div>`
    ).join('');
    const ds = CAL_DOC_SETS[d % CAL_DOC_SETS.length];
    document.getElementById('cal-phys').innerHTML  = ds.map(i=>{
        const p=CAL_DOCS[i];
        return `<div class="cal-phys-card" onclick="calPickDoc(this,${i})">
            <div class="cal-phys-av" style="background:${p.color}">${p.init}</div>
            <div class="cal-phys-info"><div class="p-name">${p.name}</div><div class="p-role">${p.role}</div></div>
            <div class="cal-phys-check"></div>
        </div>`;
    }).join('');
    document.getElementById('cal-empty').style.display='none';
    document.getElementById('cal-detail').style.display='flex';
    calUpdateBtn();
}

function calPickTime(el,t){
    document.querySelectorAll('.cal-t-chip').forEach(c=>c.classList.remove('cal-chosen'));
    el.classList.add('cal-chosen'); calSelTime=t; calUpdateBtn();
}

function calPickDoc(el,i){
    document.querySelectorAll('.cal-phys-card').forEach(c=>c.classList.remove('cal-chosen'));
    el.classList.add('cal-chosen'); calSelDocIdx=i; calUpdateBtn();
}

function calUpdateBtn(){
    // The cal-confirm button currently has no icon element in
    // the HTML. Only the label and the ready class are toggled
    // here. To restore an inline icon next to the label, add an
    // <img> to the button in appointments.html and update its
    // src in this function.
    const btn=document.getElementById('cal-confirm-btn');
    const lbl=document.getElementById('cal-confirm-label');
    const ready=calSelTime&&calSelDocIdx!==null;
    btn.classList.toggle('ready',ready);
    if(ready){
        lbl.textContent='Continue to Review';
    } else {
        const miss=(!calSelTime&&calSelDocIdx===null)?'a time & physician':!calSelTime?'a time':'a physician';
        lbl.textContent='Select '+miss+' to continue';
    }
}
function calConfirm(){
    if(!calSelTime||calSelDocIdx===null) return;
    const p=CAL_DOCS[calSelDocIdx];
    const dt=new Date(calYear,calMonth,calSelDay);
    selectedDoc  = p.name;
    selectedDate = CAL_MONTHS[calMonth]+' '+calSelDay +', '+calYear;
    selectedTime = calSelTime;
    goStep(4);
}

calRender();

/* ── Init ── */
updateStepper();
document.getElementById('btn1').addEventListener('click', function(){ if(!this.disabled) goStep(2); });