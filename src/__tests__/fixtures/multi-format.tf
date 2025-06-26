
resource "oci_identity_policy" "standard_policy" {
  statements = [
    "Allow group StandardUsers to read all-resources in compartment dev"
  ]
}

resource "oci_identity_policy" "complex_policy" {
  statements = [
    "Allow group ComplexUsers to manage instances in compartment prod where request.user.mfachallenged = 'true'",
    "Allow group ComplexUsers to use virtual-network-family in compartment prod"
  ]
}
