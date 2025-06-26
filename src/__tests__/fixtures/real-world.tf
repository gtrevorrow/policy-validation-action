
variable "tenancy_ocid" {
  description = "The OCID of the tenancy"
  type        = string
}

variable "compartment_name" {
  description = "Name of the compartment"
  type        = string
  default     = "production"
}

resource "oci_identity_policy" "comprehensive_policy" {
  name           = "comprehensive-access-policy"
  description    = "Comprehensive policy covering multiple scenarios"
  compartment_id = var.tenancy_ocid
  
  statements = [
    # Administrative access
    "Allow group Administrators to manage all-resources in tenancy",
    "Allow group TenancyAdmins to manage tenancies in tenancy",
    
    # Development team access
    "Allow group Developers to use instances in compartment ${var.compartment_name}",
    "Allow group Developers to manage buckets in compartment ${var.compartment_name}",
    "Allow group Developers to read all-resources in compartment ${var.compartment_name}",
    
    # Security team access with conditions
    "Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = 'true'",
    "Allow group SecurityAuditors to read all-resources in tenancy where request.user.mfachallenged = 'true'",
    
    # Network team access
    "Allow group NetworkAdmins to manage virtual-network-family in compartment ${var.compartment_name}",
    "Allow group NetworkAdmins to manage load-balancers in compartment ${var.compartment_name}",
    
    # Database team access
    "Allow group DatabaseAdmins to manage database-family in compartment ${var.compartment_name}",
    "Allow group DatabaseAdmins to manage autonomous-database-family in compartment ${var.compartment_name}",
    
    # Service-specific access
    "Allow group ObjectStorageAdmins to manage buckets in compartment ${var.compartment_name}",
    "Allow group ObjectStorageUsers to read buckets in compartment ${var.compartment_name}",
    
    # Conditional access examples
    "Allow group Developers to use instances in compartment ${var.compartment_name} where request.operation != 'LaunchInstance'",
    "Allow group QATesters to read instances in compartment ${var.compartment_name} where target.instance.shape.memory.in.gbs <= 8"
  ]
}

resource "oci_identity_policy" "restricted_policy" {
  name           = "restricted-access-policy"
  description    = "Policy with restricted access patterns"
  compartment_id = var.tenancy_ocid
  
  statements = [
    "Allow group RestrictedUsers to read instances in compartment ${var.compartment_name}",
    "Allow group RestrictedUsers to use virtual-network-family in compartment ${var.compartment_name}"
  ]
}
