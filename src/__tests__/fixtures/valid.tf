locals {
    admin_group = "Administrators"
    dev_group = "Developers"
    network_admins = "NetworkAdmins"
    tenant_name = "Acceptor"
    tenant_ocid = "ocid1.tenancy.oc1..aaaaaa"
    env = "dev"
    public_compartment = "public"
    start_time = "2023-01-01T00:00:00Z"
    end_time = "2023-12-31T23:59:59Z"
    policies = [
        "Allow group Administrators_locals to manage all-resources in tenancy",
        "Allow group Developers_locals to use instances in compartment dev",
        "Define tenancy Acceptor_locals as ocid1.tenancy.oc1..aaaaaa",
        "Endorse group NetworkAdmins_locals to manage virtual-network-family in tenancy foo",
        "Admit group ServiceAdmins_locals of tenancy accountFoo to manage instances in tenancy",
        "Allow group SecurityAdmins_locals to manage all-resources in tenancy where request.user.groups in ('SecurityAdmins')"
    ]

}

resource "oci_identity_policy" "test_policy" {
    statements = [
        "Allow group Administrators to manage all-resources in tenancy",
        "Allow group Developers to use instances in compartment dev",
        "Define tenancy Acceptor as ocid1.tenancy.oc1..aaaaaa",
        "Endorse group NetworkAdmins to manage virtual-network-family in tenancy foo",
        "Admit group ServiceAdmins of tenancy accountFoo to manage instances in tenancy",
        "Allow group SecurityAdmins to manage all-resources in tenancy where request.user.groups in ('SecurityAdmins')"
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

resource "oci_identity_policy" "test_policy_locals" {
    statements = local.polcies
}
