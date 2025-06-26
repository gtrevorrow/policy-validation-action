
# Custom policy format
policy "admin_access" {
  statement = "Allow group Admins to manage all-resources in tenancy"
}

policy "user_access" {
  statement = "Allow group Users to read instances in compartment dev"
}
