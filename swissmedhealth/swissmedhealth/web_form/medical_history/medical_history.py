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

	return lead

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


@frappe.whitelist(allow_guest=True)
def get_sales_partner_title(referral_code):
	lead = frappe.db.get_value("Sales Partner", {"referral_code": referral_code}, ["custom_web_form_title"], as_dict=True)
	if not lead:
		return None
	
	return lead.custom_web_form_title
