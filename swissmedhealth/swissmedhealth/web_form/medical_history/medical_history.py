import frappe
from datetime import datetime

def get_context(context):
	# do your magic here
	pass

@frappe.whitelist(allow_guest=True)
def get_lead_details(email_id, throw_error=True):
	lead = frappe.db.get_value("Lead", {"email_id": email_id}, ["*"], as_dict=True)
	# if empty lead throw error
	if not lead:
		if throw_error == 'false':
			return None
		else:
			frappe.throw("Not found")
	return lead

@frappe.whitelist(allow_guest=True)
def save(doc):
	# doc is in json format. Convert it to dict
	doc = frappe.parse_json(doc)
	# Get the lead from the doc.name assign all values from doc to lead and save
	lead = frappe.get_doc("Lead", doc.name)
	lead.update(doc)
	lead.save(ignore_permissions=True)

	if not doc.get("country"):
		doc["country"] = lead.country

	address = frappe.get_doc("Address", lead.custom_customer_primary_address)
	if address:
		address.update({
			"address_line1": doc.custom_street_name if doc.custom_street_name else "-",
			"address_line2": doc.custom_building_name,
			"city": doc.city if doc.city else "-",
			"pincode": doc.custom_post_code,
			"country": doc.country,
		})
		address.save(ignore_permissions=True)

	if doc.get("consent_accept_registration"):
		save_customer_consent(doc)

	return lead

@frappe.whitelist(allow_guest=True)
def save_customer_consent(doc):
	lead = frappe.get_doc("Lead", doc.name)
	customer_consent = frappe.get_doc("Customer Consent", lead.custom_customer_consent)
	customer_consent.update({
		"accept_registration": doc.consent_accept_registration,
		"accept_personal_data": doc.consent_accept_personal_data,
		"accept_communication": doc.consent_accept_communication,
		"acceptance_date": frappe.utils.nowdate(),
		"signature": doc.undefined
	})
	customer_consent.save(ignore_permissions=True)

@frappe.whitelist(allow_guest=True)
def get_medical_history_details(email_id):
	lead = frappe.db.get_value("Lead", {"email_id": email_id}, ["custom_medical_history"], as_dict=True)
	# if empty lead throw error
	if not lead:
		frappe.throw("Not found")

	# get the dental history document from the lead
	medical_history = frappe.get_value("Medical History", lead.custom_medical_history, ["*"], as_dict=True)
	return medical_history

@frappe.whitelist(allow_guest=True)
def save_medical_history(doc):
	# doc is in json format. Convert it to dict
	doc = frappe.parse_json(doc)
	# Get the lead from the doc.name assign all values from doc to lead and save
	lead = frappe.get_doc("Medical History", doc.name)
	lead.update(doc)
	lead.save(ignore_permissions=True)
	return lead