frappe.ready(function () {

    let params = new URLSearchParams(window.location.search);
    let email_id = params.get('email_id');
    
    // Handle existing lead case
    if (email_id) {
        frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.get_lead_details', { email_id: email_id }).then(r => {
            let doc = r.message;

            frappe.web_form.set_values(doc);
            frappe.web_form.is_new = false;
            frappe.web_form.doc.name = doc.name;

            // Check if custom_referral_code is not empty and make it read-only
            if (doc.custom_referral_code) {
                frappe.web_form.set_df_property('custom_referral_code', 'read_only', 1);
            }
        });
    }

    // Set referral code from URL
    let referral_code = params.get('referral_code');
    if (referral_code) {
        frappe.web_form.set_value('custom_referral_code', referral_code);
    }
    
    // Use Frappe's after_save hook for guaranteed execution after save completes
    frappe.web_form.after_save = function() {
        try {
            // Get the email directly from the form values to ensure it's current
            let email_id = frappe.web_form.get_value('email_id');
            
            // Redirect to the next step with email
            window.location.href = '../lead-step-2/new?email_id=' + encodeURIComponent(email_id);
        } catch (err) {
            console.error("Error in after_save:", err);
            frappe.msgprint({
                title: __('Error'),
                indicator: 'red',
                message: __('An error occurred while processing your details. Please try again later.')
            });
        }
    };

    // Keep your click handler for backward compatibility but simplify it
    $('.submit-btn').on('click', async function (e) {
        e.preventDefault();
        
        try {
            // Just trigger the normal save process - after_save will handle the redirect
            if (frappe.web_form.is_new) {
                await frappe.web_form.save();
            } else {
                await frappe.web_form.update();
            }
        } catch (err) {
            console.error("Error during form submission:", err);
            frappe.msgprint({
                title: __('Error'),
                indicator: 'red',
                message: __('An error occurred while submitting your details. Please try again later.')
            });
        }
    });
})