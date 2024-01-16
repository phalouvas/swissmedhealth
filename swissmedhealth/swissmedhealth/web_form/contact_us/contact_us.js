frappe.ready(function() {
	
	// bind events here
	frappe.web_form.after_save = () => {
		let email_id = frappe.web_form.doc.email_id;
		let href = '/lead-step-2/new?email_id=' + encodeURIComponent(email_id);
		// Get the redirect button with class name "new-btn" and set the href attribute
		$('.new-btn').attr('href', href);
		// Also change the text of the button to "Please complete your medical history here"
		$('.new-btn').text('Please complete your medical history here');
	}

})