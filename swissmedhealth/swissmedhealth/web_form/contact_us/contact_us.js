frappe.ready(function() {
	
	// bind events here
	frappe.web_form.after_save = () => {
		let email_id = frappe.web_form.doc.email_id;
		window.location.href = '../lead-step-2/new?email_id=' + encodeURIComponent(email_id);
	}

})