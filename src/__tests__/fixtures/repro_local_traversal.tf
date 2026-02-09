locals {
  policy_map = {
    main = "Allow group Admins to manage all-resources in tenancy"
  }
}

resource "oci_identity_policy" "test" {
  name = "test-policy"
  statements = [local.policy_map["main"]]
}
