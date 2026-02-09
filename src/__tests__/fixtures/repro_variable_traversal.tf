variable "policies" {
  default = [
    "Allow group Admins to manage all-resources in tenancy",
    "Allow group Users to read all-resources in tenancy"
  ]
}

resource "oci_identity_policy" "test" {
  name = "test-policy"
  statements = [var.policies[0]]
}
