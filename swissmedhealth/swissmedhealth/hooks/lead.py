import frappe

from erpnext.crm.doctype.lead.lead import Lead as OriginalLead

class Lead(OriginalLead):
    def create_contact(self):
        if not self.lead_name:
            self.set_full_name()
            self.set_lead_name()

        if self.custom_relative_first_name:
            contact = frappe.new_doc("Contact")
            contact.update(
                {
                    "first_name": self.custom_relative_first_name,
                    "last_name": self.custom_relative_last_name,
                    "salutation": self.custom_relative_salutation,
                    "gender": self.custom_relative_gender,
                    "is_primary_contact": 1,
                    "custom_relation": self.custom_relation,
                }
            )

            if self.custom_relative_email_id:
                contact.append("email_ids", {"email_id": self.custom_relative_email_id, "is_primary": 1})

            if self.custom_relative_phone:
                contact.append("phone_nos", {"phone": self.custom_relative_phone, "is_primary_phone": 1})


            contact.insert(ignore_permissions=True)
            contact.reload()  # load changes by hooks on contact
            self.relative_contact_doc = contact
        else:
            self.relative_contact_doc = None

        # call the original method
        return super(Lead, self).create_contact()
    
    def link_to_contact(self):
        # call the original method
        super(Lead, self).link_to_contact()

        if self.relative_contact_doc:
            self.relative_contact_doc.append(
				"links", {"link_doctype": "Lead", "link_name": self.name, "link_title": self.lead_name}
			)
            self.relative_contact_doc.save()

def after_insert(doc, method):
    dental_history = frappe.new_doc("Dental History")
    dental_history.insert()
    doc.db_set('custom_dental_history', dental_history.name)
    doc.reload()