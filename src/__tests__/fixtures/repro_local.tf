locals {
  single_policy = "Allow group Administrators to manage all-resources in tenancy"
  list_policies = [
    "Allow group NetAdmins to manage virtual-network-family in tenancy",
    "Allow group SecAdmins to manage security-lists in tenancy"
  ]
}

resource "oci_identity_policy" "single" {
  name = "single-policy"
  statements = [local.single_policy]
}

resource "oci_identity_policy" "list" {
  name = "list-policy"
  statements = local.list_policies
}

resource "oci_identity_policy" "mixed" {
  name = "mixed-policy"
  statements = [
    local.single_policy,
    "Allow group Auditors to read all-resources in tenancy"
  ]
}
