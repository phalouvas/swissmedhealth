frappe.ready(function () {
    // Initialize form with existing data if email is provided
    let params = new URLSearchParams(window.location.search);
    let email_id = params.get('email_id');
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

    // Use the standard Frappe web form submission process with our own after_save
    frappe.web_form.after_save = () => {
        // Automatically redirect to the next form
        let email_id = frappe.web_form.doc.email_id;
        window.location.href = '../lead-step-2/new?email_id=' + encodeURIComponent(email_id);
    }

    // Override the submit button click handler
    $('.submit-btn').on('click', async function (e) {
        // Prevent the default form submission
        e.preventDefault();
        
        // Get the email_id from the form or URL
        let email_id = params.get('email_id') || frappe.web_form.doc.email_id;
        
        // If we're updating an existing record, set the name
        if (!params.get('email_id')) {
            let r = await frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.get_lead_details', 
                { email_id: email_id, throw_error: false });
                
            if (r.message) {
                frappe.web_form.doc.name = r.message.name;
            }
        }
        
        // Save the data and redirect
        frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save', 
            { doc: frappe.web_form.doc })
            .then(r => {
                if (r.message && r.message.email_id) {
                    window.location.href = '../lead-step-2/new?email_id=' + encodeURIComponent(r.message.email_id);
                }
            })
            .catch((err) => {
                frappe.msgprint({
                    title: __('Error'),
                    indicator: 'red',
                    message: __('An error occurred while submitting your details. Please try again later.')
                });
            });
    });
})