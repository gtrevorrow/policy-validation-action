variable "policy_set" {
  default = {
    main = "Allow group Admins to manage all-resources in tenancy"
  }
}

resource "oci_identity_policy" "test" {
  name = "test-policy"
  statements = [var.policy_set.main]
}
