/* ============================================================
   FILE: common.js
   PURPOSE: Shared client side helpers used on multiple pages
            of the OU HealthConnection Patient Portal.
   ============================================================
   This file holds the password visibility toggle used on
   both the login page and the registration page. Keeping it
   here means any fix or improvement automatically applies to
   every page that includes this script.
   ============================================================ */


/* ------------------------------------------------------------
   FUNCTION: togglePwd
   ------------------------------------------------------------
   Toggles a password input between hidden and visible text.
   When the input type is "password" the field masks what the
   user typed. Calling this function switches it to "text" so
   the user can read their entry. Calling it again switches
   it back to "password".

   The Font Awesome icon inside the button is also swapped so
   the button always shows the state the field will move TO
   when clicked. An open eye means the password is currently
   hidden, and a slashed eye means it is currently visible.

   Parameters:
     id  - the HTML id of the password input to toggle
     btn - the button element whose icon needs to be updated
   ------------------------------------------------------------ */
function togglePwd(id, btn) {
    const inp = document.getElementById(id);

    // Save the current state so we can flip it below.
    const isText = inp.type === 'text';

    // Switch the input type to show or hide the password.
    inp.type = isText ? 'password' : 'text';

    // Swap the icon to reflect the new state of the field.
    // Open eye means the password is now hidden.
    // Slashed eye means the password is now visible.
    btn.querySelector('i').className = isText
        ? 'fa-solid fa-eye'
        : 'fa-solid fa-eye-slash';
}