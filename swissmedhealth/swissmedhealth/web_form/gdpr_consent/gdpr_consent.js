frappe.ready(function() {

	let params = new URLSearchParams(window.location.search);
    let email_id = params.get('email_id');
    if (email_id) {
        frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.get_lead_details', {email_id: email_id}).then(r => {
            let doc = r.message;
            frappe.web_form.set_values(doc);
			frappe.web_form.is_new = false;
			frappe.web_form.doc.name = doc.name;
        });
    } else {
		// redirect to home page
		window.location.href = '/';
	}

	// bind events here
$('.submit-btn').on('click', function(e) {
	// Prevent the default form submission
	e.preventDefault();

	frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save', {doc: frappe.web_form.doc}).then(() => {
		frappe.msgprint({
			title: __('Success'),
			indicator: 'green',
			message: __('Thank you for submitting your medical history, a member of our team will contact you shortly...')
		});
		
		$('.web-form-container').hide();
	}).catch((err) => {
		frappe.msgprint({
			title: __('Error'),
			indicator: 'red',
			message: __('An error occurred while submitting your details. Please try again later.')
		});
	});
});

})