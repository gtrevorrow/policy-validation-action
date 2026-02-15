import { ReferenceLookupValidator } from '../../validators/ReferenceLookupValidator';

const validator = new ReferenceLookupValidator();

describe('ReferenceLookupValidator', () => {
  test('passes when group exists in lookup', async () => {
    const statements = ['Allow group Admins to manage all-resources in tenancy'];
    const reports = await validator.validate(statements, { referenceValidation: { groupLookup: ['Admins'] } });

    expect(reports).toHaveLength(1);
    expect(reports[0].issues).toHaveLength(0);
    expect(reports[0].passed).toBe(true);
  });

  test('errors when group does not exist in lookup', async () => {
    const statements = ['Allow group Unknown to manage all-resources in tenancy'];
    const reports = await validator.validate(statements, { referenceValidation: { groupLookup: ['Admins'] } });

    expect(reports[0].issues).toHaveLength(1);
    expect(reports[0].issues[0].severity).toBe('error');
  });

  test('warns when group is HCL variable', async () => {
    const statements = ['Allow group ${var.admin_group} to manage all-resources in tenancy'];
    const reports = await validator.validate(statements, { referenceValidation: { groupLookup: ['Admins'] } });

    expect(reports[0].issues).toHaveLength(1);
    expect(reports[0].issues[0].severity).toBe('warning');
    expect(reports[0].passed).toBe(true);
  });

  test('treatWarningsAsFailures can fail on unresolved group', async () => {
    const statements = ['Allow group ${var.admin_group} to manage all-resources in tenancy'];
    const reports = await validator.validate(statements, {
      referenceValidation: {
        groupLookup: ['Admins']
      },
      treatWarningsAsFailures: true,
    });

    expect(reports[0].issues).toHaveLength(1);
    expect(reports[0].passed).toBe(false);
  });
});
