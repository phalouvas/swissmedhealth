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
    }
	
	// bind events here
	frappe.web_form.after_save = () => {
		let email_id = frappe.web_form.doc.email_id;
		let href = '/lead-step-2/new?email_id=' + encodeURIComponent(email_id);
		// Get the redirect button with class name "new-btn" and set the href attribute
		$('.new-btn').attr('href', href);
		// Also change the text of the button to "Please complete your medical history here"
		$('.new-btn').text('Medical information Form');
	}

	$('.submit-btn').on('click', function (e) {

		let params = new URLSearchParams(window.location.search);
		let email_id = params.get('email_id');
		if (!email_id) {
			return;
		}
		// Prevent the default form submission
		e.preventDefault();

		frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save', { doc: frappe.web_form.doc }).then(() => {
			let params = new URLSearchParams(window.location.search);
			let email_id = params.get('email_id');
			window.location.href = '../lead-step-2/new?email_id=' + encodeURIComponent(email_id);
		}).catch((err) => {
			frappe.msgprint({
				title: __('Error'),
				indicator: 'red',
				message: __('An error occurred while submitting your details. Please try again later.')
			});
		});
	});

})