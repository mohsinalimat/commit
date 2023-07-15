# Copyright (c) 2023, The Commit Company and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json


class Graph(Document):
    pass


@frappe.whitelist()
def get_graph_data(id):
    doc = frappe.get_doc("Graph", id).as_dict()
    doctypes = doc.get("doctype_names")
    doctype_list = []
    json_data = []
    if doctypes:
        doctype_list = json.loads(doctypes).get('doctype')
        for doctype in doctype_list:
            data = frappe.get_doc('DocType', doctype).as_dict()
            json_data.append(data)

    return {
        'graph_name': doc.get('graph_name'),
        'doctypes': doctype_list,
        'json_data': json_data
    }
