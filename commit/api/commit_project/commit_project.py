import frappe


@frappe.whitelist()
def get_project_list_with_branches():
    """
    Get list of projects with branches for each organization
    """

    organizations = frappe.get_all("Commit Organization", fields=[
                                   "name", 'organization_name', 'github_org', 'image'])
    for organization in organizations:
        projects = frappe.get_all("Commit Project", filters={
                                  "org": organization.get("name")}, fields=["name", "repo_name", "app_name", "image", "banner_image", "path_to_folder", 'description'])
        # organization["projects"] = projects
        for project in projects:
            branches = frappe.get_all("Commit Project Branch", filters={"project": project.get(
                "name")}, fields=["branch_name", "last_fetched", "modules", "whitelisted_apis", "name"])
            project["branches"] = branches
        organization["projects"] = projects

    return organizations