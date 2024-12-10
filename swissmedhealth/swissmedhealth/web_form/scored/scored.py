import frappe

def get_context(context):
	# do your magic here
	pass

@frappe.whitelist(allow_guest=True)
def get_scored_details(email_id):
	lead = frappe.db.get_value("Lead", {"email_id": email_id}, ["custom_stress_identification"], as_dict=True)
	# if empty lead throw error
	if not lead:
		frappe.throw("Not found")
	
	# get the dental history document from the lead
	stress_identifications = frappe.get_value("Stress Identification", lead.custom_stress_identification, ["*"], as_dict=True)
	return stress_identifications

@frappe.whitelist(allow_guest=True)
def save(doc):
	# doc is in json format. Convert it to dict
	doc = frappe.parse_json(doc)
	# Get the lead from the doc.name assign all values from doc to lead and save
	lead = frappe.get_doc("Stress Identification", doc.name)
	lead.update(doc)
	lead.save(ignore_permissions=True)
	return lead