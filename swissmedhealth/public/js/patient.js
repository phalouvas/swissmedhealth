frappe.ui.form.on("Patient", {
	refresh: function (frm) {
		// if field custom_date is empty set the current date
		if (!frm.doc.custom_date) {
			frm.set_value("custom_date", frappe.datetime.nowdate());
		}
	}
});