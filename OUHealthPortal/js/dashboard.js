/* ============================================================
   FILE: dashboard.js
   PURPOSE: Interactive logic for the dashboard page of the
            OU HealthConnection Patient Portal.
   ============================================================
   This script manages the visual state of the left hand
   navigation panel. When the user clicks any menu button,
   the clicked button receives the active state while all
   other buttons are returned to their default appearance.
   ============================================================ */


/* ------------------------------------------------------------
   FUNCTION: setActive
   ------------------------------------------------------------
   Highlights a single navigation button as the currently
   active menu item. The function first clears the active
   class from every button in the navigation panel and then
   applies it to the button that was clicked. Only one menu
   item should ever carry the active state at a given time.
   
   PARAMETER:
     btn : The navigation button element that was clicked.
   ------------------------------------------------------------ */
function setActive(btn) {

   
    /* Remove the active class from every navigation button
       so that no stale highlight remains from a previous
       selection. */

    /*document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active');
    });

    /* Apply the active class to the button that was clicked. */
    /*btn.classList.add('active');
   */
  //window.location.href='dashboard.html';
  return;
   
}
