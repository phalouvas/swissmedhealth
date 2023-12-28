frappe.ui.form.on('Lead', {
    refresh: function (frm) {

        // If the lead is saved, then add the button to create a patient
        let doc = frm.doc;
        if (!frm.is_new() && doc.__onload && !doc.__onload.is_customer) {
            frm.add_custom_button(__('Create Patient'), function () {
                frappe.model.open_mapped_doc({
                    method: "swissmedhealth.swissmedhealth.hooks.lead.make_patient",
                    frm: frm
                });
            }).addClass('btn-primary');
        }
    },
});
