frappe.ready(function () {

	// Set the current date in the data-fieldtype "Date" using jQuery in yyyy-mm-dd format
	let currentDate = new Date();
	let formattedDate = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);
	$('input[data-fieldtype="Date"]').val(formattedDate);

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

	// set referral code from URL
	let referral_code = params.get('referral_code');
	if (referral_code) {
		frappe.web_form.set_value('custom_referral_code', referral_code);
	}

	// bind events here
	frappe.web_form.after_save = () => {
		frappe.msgprint({
			title: __('Success'),
			indicator: 'green',
			message: __('We have received your information and a member of our patient management team will be contacting you via your preferred contact method shortly.')
		});

		$('.web-form-container').hide();
	}

	$('.submit-btn').on('click', async function (e) {

		// Set the user consent fields in web form
		frappe.web_form.doc.consent_accept_registration = $('label:contains("Accept Registration")').closest('.form-group').find('select').val();
		frappe.web_form.doc.consent_accept_personal_data = $('label:contains("Accept Personal Data")').closest('.form-group').find('select').val();
		frappe.web_form.doc.consent_accept_communication = $('label:contains("Accept Communication")').closest('.form-group').find('select').val();
		frappe.web_form.doc.consent_date = $('label:contains("Consent Date")').closest('.form-group').find('input').val();
		
		// Get the email from the URL
		let params = new URLSearchParams(window.location.search);
		let email_id = params.get('email_id');
		if (!email_id) {
			// Get the email_id from the submitted form
			frappe.web_form.doc.email_id = frappe.web_form.doc.custom_relative_email_id;
			email_id = frappe.web_form.doc.email_id;
			let r = await frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.get_lead_details', { email_id: email_id, throw_error: false });
			if (r.message == undefined) {
				return;
			}
			frappe.web_form.doc.name = r.message.name;
			// Prevent the default form submission
			e.preventDefault();

			frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save', { doc: frappe.web_form.doc }).then(r => {
				let email_id = r.message.email_id;
				frappe.msgprint({
					title: __('Success'),
					indicator: 'green',
					message: __('We have received your information and a member of our patient management team will be contacting you via your preferred contact method shortly.')
				});
	
				$('.web-form-container').hide();
			}).catch((err) => {
				frappe.msgprint({
					title: __('Error'),
					indicator: 'red',
					message: __('An error occurred while submitting your details. Please try again later.')
				});
			});	
		} else {
			// Prevent the default form submission
			e.preventDefault();
			frappe.call('swissmedhealth.swissmedhealth.web_form.medical_history.medical_history.save', { doc: frappe.web_form.doc }).then(r => {
				let email_id = r.message.email_id;
				frappe.msgprint({
					title: __('Success'),
					indicator: 'green',
					message: __('We have received your information and a member of our patient management team will be contacting you via your preferred contact method shortly.')
				});
	
				$('.web-form-container').hide();
			}).catch((err) => {
				frappe.msgprint({
					title: __('Error'),
					indicator: 'red',
					message: __('An error occurred while submitting your details. Please try again later.')
				});
			});
		}
	});

})