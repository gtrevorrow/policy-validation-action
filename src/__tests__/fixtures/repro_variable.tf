variable "common_policies" {
  default = ["Allow group Administrators to manage all-resources in tenancy"]
}

resource "oci_identity_policy" "test" {
  name = "test-policy"
  statements = var.common_policies
}

resource "oci_identity_policy" "test_mixed" {
  name = "test-policy-mixed"
  statements = [var.common_policies, "Allow group Users to use all-resources in tenancy"]
}
