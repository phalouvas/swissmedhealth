frappe.ready(function () {

	let params = new URLSearchParams(window.location.search);
	let email_id = params.get('email_id');
	if (email_id) {
		frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.get_medical_history_details', { email_id: email_id }).then(r => {
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
	$('.submit-btn').on('click', function (e) {
		// Prevent the default form submission
		e.preventDefault();

		let validation_result = frappe.web_form.validate_section();
		if (!validation_result) {
			return;
		}

		// Validate weight and height
		const weight = parseFloat(frappe.web_form.get_value('weight'));
		const height = parseInt(frappe.web_form.get_value('height'), 10);

		if (isNaN(weight) || weight <= 0) {
			frappe.msgprint({
				title: __('Validation Error'),
				indicator: 'red',
				message: __('Weight must be greater than zero.')
			});
			return;
		}
		if (isNaN(height) || height <= 0) {
			frappe.msgprint({
				title: __('Validation Error'),
				indicator: 'red',
				message: __('Height must be greater than zero.')
			});
			return;
		}

		// set custom_status to 'Documentation received'
		frappe.web_form.doc.custom_status = 'Documentation received';

		frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save_medical_history', { doc: frappe.web_form.doc }).then(() => {
			let params = new URLSearchParams(window.location.search);
			let email_id = params.get('email_id');
			window.location.href = '../lead-step-3/new?email_id=' + encodeURIComponent(email_id);
		}).catch((err) => {
			frappe.msgprint({
				title: __('Error'),
				indicator: 'red',
				message: __('An error occurred while submitting your details. Please try again later.')
			});
		});
	});

})