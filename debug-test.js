// Debug test for OciCisBenchmarkValidator
const { OciCisBenchmarkValidator } = require('./src/validators/OciCisBenchmarkValidator.ts');

async function debugTest() {
  const policies = [
    'Allow group IAMAdmins to manage groups in tenancy where target.group.name != \'Administrators\'',
    'Allow group SecurityAdmins to manage security-family in tenancy where request.user.mfachallenged = \'true\''
  ];
  
  console.log('Testing policies:', policies);
  
  const validator = new OciCisBenchmarkValidator();
  const reports = await validator.validate(policies);
  
  console.log('\nReports generated:', reports.length);
  
  reports.forEach(report => {
    console.log(`\nCheck: ${report.checkId} - ${report.name}`);
    console.log(`Passed: ${report.passed}`);
    console.log(`Issues: ${report.issues.length}`);
    report.issues.forEach(issue => {
      console.log(`  - ${issue.statement}`);
      console.log(`    ${issue.message}`);
    });
  });
}

debugTest().catch(console.error);
