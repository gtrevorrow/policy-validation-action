
resource "oci_identity_policy" "admin_policy" {
  name = "admin-policy"
  description = "Administrator access policy"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = 'true'"
  ]
}

resource "oci_identity_policy" "dev_policy" {
  name = "dev-policy"
  description = "Developer access policy"
  compartment_id = var.dev_compartment_ocid
  statements = [
    "Allow group Developers to use instances in compartment ${var.dev_compartment}",
    "Allow group Developers to manage buckets in compartment ${var.dev_compartment}"
  ]
}
