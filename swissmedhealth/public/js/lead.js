frappe.ui.form.on('Lead', {
    refresh: function (frm) {
        frm.add_custom_button(__('Patient'), function () {
            frappe.model.open_mapped_doc({
                method: "swissmedhealth.swissmedhealth.hooks.lead.make_patient",
                frm: frm
            }); 
        }, "Create");
    },

});
