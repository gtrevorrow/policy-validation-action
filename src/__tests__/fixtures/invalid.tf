locals {
  badPolicies = [
    "Allow Administrators_locals to manage all-resources in",
    "allw foo to manage all-resources in compartment bar"
  ]
}

resource "oci_identity_policy" "invalid" {
  statements = local.badPolicies
}

resource "oci_identity_policy" "invalid2" {
  statements = [
    "Allow Administrators_locals to manage all-resources in",
    "allw foo to manage all-resources in compartment bar"
  ]
}

