/* ============================================================
   FILE: profile.js
   PURPOSE: Interactive behavior for the My Profile page.
   ============================================================
   Handles inline editing of profile fields, password change
   validation, notification preference toggles, and the toast
   messages that confirm each action to the user.
   ============================================================ */

   // Stores the original field values so edits can be cancelled cleanly.
   let originalProfileValues = {};

   // Tracks whether the profile is currently in edit mode.
   let isEditingProfile = false;
   
   // Puts every info-value field into an editable input and shows
   // the save and cancel buttons at the bottom of the form.
   function startEditProfile() {
       if (isEditingProfile) return;
   
       isEditingProfile = true;
       originalProfileValues = {};
   
       document.querySelectorAll('.info-value').forEach((value, index) => {
           // Save the original text so cancelProfileChanges can restore it.
           originalProfileValues[index] = value.textContent.trim();
   
           const currentText = value.textContent.trim();
           const input = document.createElement('input');
   
           input.className = 'profile-edit-input';

           // Treat placeholder text as empty so the user does not have to
           // manually clear it before typing their real value.
           input.value =
               currentText === 'Not provided' ||
               currentText === 'Not selected' ||
               currentText === 'Choose not to disclose'
                   ? ''
                   : currentText;
   
           value.innerHTML = '';
           value.appendChild(input);
       });
   
       document.querySelector('.profile-footer-actions').style.display = 'flex';
       showProfileMessage('Edit mode enabled. Update your information and click Save Changes.');
   }
   
   // Validates required fields, writes the new values back into the DOM,
   // and exits edit mode. Shows an error toast if validation fails.
   function saveProfileChanges() {
       let validationFailed = false;
   
       document.querySelectorAll('.info-value').forEach((value) => {
           const input = value.querySelector('input');
   
           if (input) {
               const fieldName = value.dataset.field;
               const newValue = input.value.trim();
   
               const requiredFields = ['fullName', 'email', 'cellPhone'];
   
               // Highlight required fields that were left empty.
               if (requiredFields.includes(fieldName) && newValue === '') {
                   input.style.borderColor = '#dc2626';
                   input.style.background = '#fef2f2';
                   validationFailed = true;
                   return;
               }
   
               input.style.borderColor = '';
               input.style.background = '';
   
               value.textContent = newValue || 'Not provided';
   
               // Apply the muted style when the field has no user value.
               if (newValue === '') {
                   value.classList.add('muted');
               } else {
                   value.classList.remove('muted');
               }
           }
       });
   
       if (validationFailed) {
           showProfileMessage('Full Name, Email, and Cell Phone are required fields.');
           return;
       }
   
       // Also update the summary name shown at the top of the profile card.
       const fullName = document.querySelector('[data-field="fullName"]');
       const summaryName = document.getElementById('summaryName');
   
       if (fullName && summaryName) {
           summaryName.textContent = fullName.textContent.trim();
       }
   
       isEditingProfile = false;
       document.querySelector('.profile-footer-actions').style.display = 'none';
       showProfileMessage('Profile updated successfully.');
   }
   
   // Restores every field to its original value and exits edit mode.
   function cancelProfileChanges() {
       document.querySelectorAll('.info-value').forEach((value, index) => {
           value.textContent = originalProfileValues[index];
   
           // Reapply the muted style for placeholder values.
           if (
               value.textContent.trim() === 'Not provided' ||
               value.textContent.trim() === 'Not selected' ||
               value.textContent.trim() === 'Choose not to disclose'
           ) {
               value.classList.add('muted');
           } else {
               value.classList.remove('muted');
           }
       });
   
       isEditingProfile = false;
       document.querySelector('.profile-footer-actions').style.display = 'none';
       showProfileMessage('Changes cancelled.');
   }
   
   // Toggles a single notification preference badge between On and Off.
   function togglePreference(badge) {
       const preferenceItem = badge.closest('.preference-item');
   
       if (badge.textContent.trim() === 'On') {
           badge.textContent = 'Off';
           badge.classList.add('off');
           preferenceItem.classList.remove('active');
           showProfileMessage('Notification preference turned off.');
       } else {
           badge.textContent = 'On';
           badge.classList.remove('off');
           preferenceItem.classList.add('active');
           showProfileMessage('Notification preference turned on.');
       }
   }
   
   // Opens the change password modal.
   function showPasswordPanel() {
       const modal = document.getElementById('passwordModal');
   
       if (modal) {
           modal.style.display = 'flex';
       }
   }
   
   // Closes the change password modal without saving anything.
   function closePasswordModal() {
       const modal = document.getElementById('passwordModal');
   
       if (modal) {
           modal.style.display = 'none';
       }
   }
   
   // Validates the new password against complexity requirements and
   // confirms that the confirmation field matches before saving.
   function updatePassword() {
       const current = document.getElementById('currentPassword').value;
       const newPass = document.getElementById('newPassword').value;
       const confirm = document.getElementById('confirmPassword').value;
   
       if (!current || !newPass || !confirm) {
           showProfileMessage('Please fill in all password fields.');
           return;
       }
   
       if (newPass.length < 8) {
           showProfileMessage('Password must be at least 8 characters.');
           return;
       }
   
       if (!/[A-Z]/.test(newPass)) {
           showProfileMessage('Password must include at least one uppercase letter.');
           return;
       }
   
       if (!/[0-9]/.test(newPass)) {
           showProfileMessage('Password must include at least one number.');
           return;
       }
   
       if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) {
           showProfileMessage('Password must include at least one special character.');
           return;
       }
   
       if (newPass !== confirm) {
           showProfileMessage('New passwords do not match.');
           return;
       }
   
       closePasswordModal();
       showProfileMessage('Password updated successfully.');
   
       // Clear all three password fields after a successful update.
       document.getElementById('currentPassword').value = '';
       document.getElementById('newPassword').value = '';
       document.getElementById('confirmPassword').value = '';
   }
   
   // Scrolls the notification preferences section into view and shows
   // a helper message explaining how to toggle preferences.
   function showNotificationHelp() {
       const prefCard = document.querySelector('.preference-list');
   
       if (prefCard) {
           prefCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
   
       showProfileMessage('Use the On/Off badges in Communication Preferences to update reminders.');
   }
   
   // Creates a temporary toast notification at the bottom of the page.
   // Any existing toast is removed first so messages do not stack.
   function showProfileMessage(message) {
       const oldToast = document.querySelector('.profile-toast');
   
       if (oldToast) {
           oldToast.remove();
       }
   
       const toast = document.createElement('div');
       toast.className = 'profile-toast';
       toast.textContent = message;
   
       document.body.appendChild(toast);
   
       // Start fading out after 4.7 seconds, then remove from DOM.
       setTimeout(() => {
           toast.classList.add('hide');
       }, 4700);
   
       setTimeout(() => {
           toast.remove();
       }, 5200);
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       const editButton = document.getElementById('editProfileBtn');
       const saveButton = document.getElementById('saveProfileBtn');
       const cancelButton = document.getElementById('cancelProfileBtn');
       const footerActions = document.querySelector('.profile-footer-actions');
   
       if (editButton) {
           editButton.addEventListener('click', startEditProfile);
       }
   
       if (saveButton) {
           saveButton.addEventListener('click', saveProfileChanges);
       }
   
       if (cancelButton) {
           cancelButton.addEventListener('click', cancelProfileChanges);
       }
   
       // Attach the toggle handler to every notification preference badge.
       document.querySelectorAll('.toggle-badge').forEach((badge) => {
           badge.addEventListener('click', () => togglePreference(badge));
       });
   
       // Close the password modal when the user clicks the backdrop.
       const passwordModal = document.getElementById('passwordModal');
   
       if (passwordModal) {
           passwordModal.addEventListener('click', (event) => {
               if (event.target === passwordModal) {
                   closePasswordModal();
               }
           });
       }
   
       // Hide the save and cancel footer until edit mode is entered.
       if (footerActions) {
           footerActions.style.display = 'none';
       }
   });