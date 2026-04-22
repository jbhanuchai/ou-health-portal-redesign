/* ============================================================
   FILE: common.js
   PURPOSE: Shared client side helpers used on multiple pages
            of the OU HealthConnection Patient Portal.
   ============================================================
   This file currently contains the password visibility toggle
   used on both the login page and the registration page. It
   is kept in a separate file so that improvements made here
   propagate automatically to every page that links it.
   ============================================================ */


/* ------------------------------------------------------------
   FUNCTION: togglePwd
   ------------------------------------------------------------
   Toggles the visibility of a password input field. When the
   input currently hides the password (type attribute set to
   "password"), the function switches it to plain text so the
   user can verify what they typed. Clicking the button again
   reverses the change.
   
   The function also swaps the Font Awesome icon between an
   open eye (password is hidden) and a crossed out eye
   (password is visible) to communicate the current state.
   
   PARAMETERS:
     id  : The HTML id of the password input to toggle.
     btn : The toggle button element that contains the icon
           to be updated.
   ------------------------------------------------------------ */
function togglePwd(id, btn) {
    const inp = document.getElementById(id);

    /* Record whether the field is currently revealed so that
       we can invert it in the next step. */
    const isText = inp.type === 'text';

    /* Flip the input type. If the password was visible we
       hide it, and if it was hidden we reveal it. */
    inp.type = isText ? 'password' : 'text';

    /* Update the icon inside the toggle button to reflect the
       new state. The open eye represents a hidden password,
       and the slashed eye represents a visible password. */
    btn.querySelector('i').className = isText
        ? 'fa-solid fa-eye'
        : 'fa-solid fa-eye-slash';
}
