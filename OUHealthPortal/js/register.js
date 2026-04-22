/* ============================================================
   FILE: register.js
   PURPOSE: Interactive logic for the registration page of
            the OU HealthConnection Patient Portal.
   ============================================================
   This script drives two features that are unique to the
   registration flow:
   
     1. A three step wizard that advances the user through
        Identity, Contact, and Security panels.
     2. A password strength meter that scores the password
        as the user types and updates a colored progress bar
        plus a descriptive label.
   ============================================================ */


/* ------------------------------------------------------------
   STATE: currentStep
   ------------------------------------------------------------
   Tracks which step panel is currently visible to the user.
   The value begins at 1 because the Identity panel is shown
   when the page first loads.
   ------------------------------------------------------------ */
let currentStep = 1;


/* ------------------------------------------------------------
   FUNCTION: goStep
   ------------------------------------------------------------
   Advances the registration wizard to a target step number.
   The function performs three coordinated updates so that
   every piece of the interface stays synchronized:
   
     Part A: Reveal the requested panel and hide the others.
     Part B: Update each circular step indicator so it shows
             an active, completed, or pending state.
     Part C: Color the horizontal connector lines between
             indicators to reflect completed transitions.
   
   PARAMETER:
     n : The target step number (expected to be 1, 2, or 3).
   ------------------------------------------------------------ */
function goStep(n) {
    currentStep = n;

    /* PART A: Panel visibility.
       Iterate over every step panel and add the active class
       only to the panel whose index matches the target step.
       The CSS rule .step-panel.active handles the actual
       show and hide behavior. */
    document.querySelectorAll('.step-panel').forEach((p, i) => {
        p.classList.toggle('active', i + 1 === n);
    });

    /* PART B: Step indicator state.
       Loop through all three indicators. Steps before the
       current step are marked as done, the current step is
       marked as active, and steps after it remain pending.
       A checkmark icon replaces the number inside any
       completed circle. */
    for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById('step-ind-' + i);
        ind.classList.remove('active', 'done');

        if (i < n) {
            ind.classList.add('done');
        } else if (i === n) {
            ind.classList.add('active');
        }

        const sc = document.getElementById('sc' + i);
        if (i < n) {
            sc.innerHTML = '<i class="fa-solid fa-check" style="font-size:12px;"></i>';
        } else {
            sc.textContent = i;
        }
    }

    /* PART C: Connector line color.
       Each of the two connector lines joins two indicators.
       A line is marked as done when the step that precedes
       it has already been completed. */
    for (let i = 1; i <= 2; i++) {
        const line = document.getElementById('line-' + i);
        line.classList.toggle('done', i < n);
    }
}
