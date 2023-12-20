import frappe
from frappe.model.mapper import get_mapped_doc

@frappe.whitelist()
def make_patient(source_name, target_doc=None):
	return _make_patient(source_name, target_doc)

def _make_patient(source_name, target_doc=None, ignore_permissions=False):
	def set_missing_values(source, target):
		if source.company_name:
			target.customer_type = "Company"
			target.customer_name = source.company_name
		else:
			target.customer_type = "Individual"
			target.customer_name = source.lead_name

		target.customer_group = frappe.db.get_default("Customer Group")

	doclist = get_mapped_doc(
		"Lead",
		source_name,
		{
			"Lead": {
				"doctype": "Patient",
				"field_map": {
					"name": "lead_name",
					"first_name": "first_name",
					"middle_name": "middle_name",
					"last_name": "last_name",
					"gender": "sex",
				},
				"field_no_map": ["disabled"],
			}
		},
		target_doc,
		set_missing_values,
		ignore_permissions=ignore_permissions,
	)

	return doclist