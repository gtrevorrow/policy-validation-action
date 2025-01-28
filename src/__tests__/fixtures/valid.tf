resource "oci_identity_policy" "test_policy" {
    statements = [
        "Allow group Administrators to manage all-resources in tenancy",
        "Allow group Developers to use instances in compartment dev",
        "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
        "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
        "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy",
        "Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups contains 'SecurityAdmins'"
    ]
}

resource "oci_identity_policy" "test_policy_vars" {
    statements = [
        "Allow group ${var.admin_group} to manage all-resources in tenancy",
        "Define tenancy ${var.tenant_name} as ${var.tenant_ocid}",
        "Endorse group ${var.network_admins} to manage virtual-network-family in tenancy foo",
        "Admit group ${var.dev_group} of tenancy accountFoo to use instances in compartment ${var.env}",
        "Allow any-user to use instances in compartment ${var.public_compartment} where request.time BETWEEN ${var.start_time} AND ${var.end_time}"
    ]
}
