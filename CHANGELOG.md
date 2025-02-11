# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.2.0 (2025-02-11)


### ⚠ BREAKING CHANGES

* **extractor:** processFile signature has changed to support the new
extraction system. It now accepts pattern and extractor type parameters.

Affects: src/extractors/*, src/Main.ts, src/cli.ts, src/__tests__/Main.test.ts

### Features

* Implement pluggable policy extractors with regex support; update CI and documentation ([1ee4aba](https://github.com/username/policy-validation-action/commit/1ee4aba3a055cd198a3bc01692362611521e0e94))


### Bug Fixes

* **cli:** separate logging and JSON output to different streams ([a1b3b95](https://github.com/username/policy-validation-action/commit/a1b3b952323d74b6fdf844e43b83c87c5fd30d3b))


### Maintenance

* Add .npmignore files for various modules and implement module exports for lodash functions ([2b0b0d9](https://github.com/username/policy-validation-action/commit/2b0b0d947d44ba8701763e5d2645a569e052fe1c))
* Add security audit to CI workflows and package scripts; implement weekly audit schedule ([b610287](https://github.com/username/policy-validation-action/commit/b610287ece3f2745323c4a5afd5983c8cab8b57b))
* Remove duplicate standard-version entry from package.json ([52df8e6](https://github.com/username/policy-validation-action/commit/52df8e66febd2598eb4059b153ebed9451146d01))


### Tests

* **build:** update CI configurations to run Jest tests and replace policy-validator with local script ([c05b732](https://github.com/username/policy-validation-action/commit/c05b732a53b56d1e73066c394368db151b4b737c))
* enhance CI configuration for detailed Jest reporting and custom pattern testing ([98adda8](https://github.com/username/policy-validation-action/commit/98adda8584d18c50ebb35aac0c078a682e5cf9cd))
* enhance CI configuration to provide detailed Jest test output and streamline policy testing ([fe6c669](https://github.com/username/policy-validation-action/commit/fe6c669566f5ffecfad8f363a295521f0507c98e))
* remove extractor option from validation commands in CI configurations ([baed1c1](https://github.com/username/policy-validation-action/commit/baed1c15ccf4cb32f7678ee4662be436843ee44e))
* remove redundant verification steps and enhance fixture testing ([290baf1](https://github.com/username/policy-validation-action/commit/290baf16e59800c10c8f5b7570c0fd354937c1e6))
* replace policy-validator with local script in CI configurations ([1307bb5](https://github.com/username/policy-validation-action/commit/1307bb52cf9e573eb8b723811c4e7be128d5782b))
* update CI and Bitbucket configurations to use npx for policy-validator ([d959261](https://github.com/username/policy-validation-action/commit/d9592612b065dbf5ba8d3e0e19803d29209c2c36))
* update CI configuration to improve policy validation tests and rename variable file ([24fb9b7](https://github.com/username/policy-validation-action/commit/24fb9b74115d55de98656de29a95a9ab6c7f69e6))
* update CI configuration to run Jest tests before policy validation ([ff46b4e](https://github.com/username/policy-validation-action/commit/ff46b4ecebbe6dc4090627cdf134e149c191c986))
* update CI configurations to use npx for policy-validator and add logging for validation steps ([2dae73b](https://github.com/username/policy-validation-action/commit/2dae73b71227291d0f1ccf2d193b68335a30ca63))
* update fixture path in test workflow to use current directory ([9459168](https://github.com/username/policy-validation-action/commit/94591685fe966fcf05ca3832aae87ce6644e36bc))
* update fixture path in test workflow to use specific directory ([e183fe2](https://github.com/username/policy-validation-action/commit/e183fe2066a76a496da2cb44fa2834968a177c02))
* update test workflow to include extractor pattern and improve fixture verification ([48aa0cf](https://github.com/username/policy-validation-action/commit/48aa0cf109c62264b4f5d3921f958371c853d769))
* update test workflow to include fixture verification and correct fixture path ([46aacbe](https://github.com/username/policy-validation-action/commit/46aacbe292ad087baaf65bba664561b73f77639d))


### Refactors

* clean up test workflows and improve variable interpolation handling ([0bfd2eb](https://github.com/username/policy-validation-action/commit/0bfd2ebca0ca98bac9ab6765c831acabac5540b9))
* enhance test workflow with success message and update fixture path ([cff80f2](https://github.com/username/policy-validation-action/commit/cff80f21a225da55a5b6d16ae0de7ad6ef67c0e4))
* **extractor:** implement policy extraction strategy pattern ([a753a66](https://github.com/username/policy-validation-action/commit/a753a668f1ab8fc34902bf1a96a427f9f542f572))
* fix path handling in findTerraformFiles; remove redundant function and update tests ([ef27a96](https://github.com/username/policy-validation-action/commit/ef27a96d062fa3a4f90c252029a16b05afe0f06f))
* remove redundant expression type checks from test workflow ([67d2584](https://github.com/username/policy-validation-action/commit/67d25843aa56f4f3f8ed54322c17e4fdfa2c7263))
* simplify path handling in findTerraformFiles; remove deprecated allow_segments output and update package.json import ([983b022](https://github.com/username/policy-validation-action/commit/983b02274d076430f6f3eaf38883ee2778be9536))
* update fixture path in test workflow to use absolute path ([129ece5](https://github.com/username/policy-validation-action/commit/129ece5b8a08ee135dc8e9d827c5f4736ed7abe2))
* update fixture path in test workflow to use source directory ([9f090a0](https://github.com/username/policy-validation-action/commit/9f090a0d084792a5d5a95d4503190d3f4476707a))
