# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.7](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.6...v0.2.7) (2025-04-03)


### Features

* enhance CLI options with environment variable support and update README documentation ([429e3cd](https://github.com/gtrevorrow/policy-validation-action/commit/429e3cd22aae5aa183c0836a5dfb507687aa5b3c))
* Enhance release workflow ([6b4ecdf](https://github.com/gtrevorrow/policy-validation-action/commit/6b4ecdfae132453104b755cf38c660971b316bc2))


### Bug Fixes

* **CI/CD:** Improve CI/CD workflow for cross-platform builds ([5085a6e](https://github.com/gtrevorrow/policy-validation-action/commit/5085a6e2695148745f64688348f37889b81feb09))
* **CI/CD:** Properly configure GitHub Packages registry access ([7e09c7e](https://github.com/gtrevorrow/policy-validation-action/commit/7e09c7e07ec280b4e921c11b4bb29c20ef257350))
* update README to correct the branch name for pushing releases ([1d181de](https://github.com/gtrevorrow/policy-validation-action/commit/1d181de79c88b341e6913781f693817354ab31c5))
* update README to ensure proper formatting for release instructions ([ba2bb8b](https://github.com/gtrevorrow/policy-validation-action/commit/ba2bb8bc45fb2784aa5f529034b045ad62aada5f))
* update release workflow for main and development branches, improve npm publishing logic, and enhance README documentation ([43a409f](https://github.com/gtrevorrow/policy-validation-action/commit/43a409f87694f82bd043e0ceae416a9fe92dfe30))


### Refactors

* **CI/CD:** Streamline workflows and improve package installation ([50ce320](https://github.com/gtrevorrow/policy-validation-action/commit/50ce3206ffb278f8603a67199b54d34d256d8b64))


### Maintenance

* update Node.js version requirement and CLI command references in README ([8221196](https://github.com/gtrevorrow/policy-validation-action/commit/82211963a9a7238ce767ded6159ac8b160cfb344))


### Documentation

* enhance regex pattern documentation in README for clarity and examples ([5662e2e](https://github.com/gtrevorrow/policy-validation-action/commit/5662e2e43189d29260fd0193b84f2d2da7b3f899))
* update release instructions in README for conventional commits ([dfc350c](https://github.com/gtrevorrow/policy-validation-action/commit/dfc350c021f72c9cbb09c306e48ca199a900aa4a))

### [0.2.6](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.5...v0.2.6) (2025-03-11)


### Bug Fixes

* improve error handling in CLI validation and enhance test setup ([c719ed1](https://github.com/gtrevorrow/policy-validation-action/commit/c719ed1a73836cc320a26ae7af4529abffc925d0))
* update CLI validation command and improve test directory setup ([b3a29fc](https://github.com/gtrevorrow/policy-validation-action/commit/b3a29fc60cbacdebe6284120021d1ef46154d04b))
* update patternMatch rule in Policy grammar for improved matching ([73a7ce3](https://github.com/gtrevorrow/policy-validation-action/commit/73a7ce386080ebadc801407e0f40e03716297413))
* update Policy grammar for dynamic group subject and quoted string handling ([a1846e7](https://github.com/gtrevorrow/policy-validation-action/commit/a1846e782bd7ccf409a378d60d88e40b41b1a314))


### Maintenance

* update GitHub Actions workflow to add permissions and improve error handling ([720406a](https://github.com/gtrevorrow/policy-validation-action/commit/720406afa93b8351a7dfaaa8f92e04c17a50c77d))

### [0.2.5](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.4...v0.2.5) (2025-03-06)


### Bug Fixes

* **tests:** increase timeout values for CLI tests to prevent failures in CI ([7d61675](https://github.com/gtrevorrow/policy-validation-action/commit/7d616756044d7ce0171237f0147b122b97652a40))


### Maintenance

* update version to 0.2.4 and increase timeouts in CLI tests ([71da5b1](https://github.com/gtrevorrow/policy-validation-action/commit/71da5b136b3e64bac40e617c4dc87228d349ec99))


### Tests

* enhance CLI test validation for JSON output structure ([4fedad8](https://github.com/gtrevorrow/policy-validation-action/commit/4fedad8fc0f7645b658318b0fbdf055aa938175b))
* fix file path in CLI test command for correct execution ([1c2d45b](https://github.com/gtrevorrow/policy-validation-action/commit/1c2d45bad5da3761de46d27a851705008f2312d0))

### [0.2.4](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.3...v0.2.4) (2025-03-04)


### Features

* Improve policy extraction and add ANTLR parser generation ([e71aada](https://github.com/gtrevorrow/policy-validation-action/commit/e71aadabccced4b16ea38c03d20d15ea989bfc32))


### Bug Fixes

* **regex:** update RegexPolicyExtractor to handle Terraform HCL variables in policy statements ([126ab65](https://github.com/gtrevorrow/policy-validation-action/commit/126ab650661f79da0fc67532f481989f5a3d2174))


### Refactors

* enhance file finding capabilities and CLI interface ([97e77c6](https://github.com/gtrevorrow/policy-validation-action/commit/97e77c6eaf7f8244920e4e9eb5500ce153057521))

### [0.2.3](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.2...v0.2.3) (2025-02-27)


### Bug Fixes

* update package name and version to @gtrevorrow/policy-validation-action@0.2.2 ([bbb513e](https://github.com/gtrevorrow/policy-validation-action/commit/bbb513e8176edcbdb570d1c07ff2e769efc92589))
* update pretest script to set npm audit level to high ([63c25b3](https://github.com/gtrevorrow/policy-validation-action/commit/63c25b3d02f6ebc4a489312fe86263e5d6f0bd49))
* update release workflow to use GITHUB_TOKEN for npm authentication ([c801be1](https://github.com/gtrevorrow/policy-validation-action/commit/c801be19f067659b5c200293b60a96554bd34a0e))


### Maintenance

* bumped @actions/github version ([731db87](https://github.com/gtrevorrow/policy-validation-action/commit/731db877951f822c1fa1919d769b1ad230f5d8ff))
* remove npm audit step from release workflow ([84457b7](https://github.com/gtrevorrow/policy-validation-action/commit/84457b7c6e23fdd38d340257edbfdef5108e2b9d))
* update package configuration ([6650ef6](https://github.com/gtrevorrow/policy-validation-action/commit/6650ef6426f025554d56508ac0f36cb72fb05476))

### [0.2.2](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.1...v0.2.2) (2025-02-26)


### Bug Fixes

* Update authentication token for npm registry and add audit step ([dc4ec75](https://github.com/gtrevorrow/policy-validation-action/commit/dc4ec75d1f23b8ecfe55d0ccd1a765531680d26f))


### Documentation

* update README.md with regex pattern processing details and CI configuration updates ([2bc591c](https://github.com/gtrevorrow/policy-validation-action/commit/2bc591cfaf7205091b225ca6d01496641714ae82))

### [0.2.1](https://github.com/gtrevorrow/policy-validation-action/compare/v0.2.0...v0.2.1) (2025-02-15)


### Features

* Adopt scoped package name for GitHub Packages ([db379be](https://github.com/gtrevorrow/policy-validation-action/commit/db379be2f146affc1d19fdeb14053d1e19f8ca27))
* **cli:** add structured logging and JSON output ([c4743ee](https://github.com/gtrevorrow/policy-validation-action/commit/c4743ee903d3309387a04cd7fd41695627f7cdc8))
* Configure publishing to GitHub Packages ([ab243b6](https://github.com/gtrevorrow/policy-validation-action/commit/ab243b6314201784e9e975e5ed0c38c304724f0b))
* Configure release workflow for scoped package ([d6e8ef2](https://github.com/gtrevorrow/policy-validation-action/commit/d6e8ef274af73086180a8ce52ff8a5789e12c280))
* install policy-validation-action from GitHub repo ([f241872](https://github.com/gtrevorrow/policy-validation-action/commit/f2418720e5ecc91bda1167c01ca22debebdbc926))
* Support pluggable extraction strategies and OCI Landing Zone IAM module ([fc1d028](https://github.com/gtrevorrow/policy-validation-action/commit/fc1d028d0164b72c241bf261832ad7ec9bda2a98))


### Bug Fixes

* ensure consistent JSON output handling across CLI and tests ([a6780bb](https://github.com/gtrevorrow/policy-validation-action/commit/a6780bbb1ee4cdcba80dd58ce3628c3ea94e5f8c))
* **extractor:** enable global pattern matching for policy statements ([20588e1](https://github.com/gtrevorrow/policy-validation-action/commit/20588e1a9935b07f83cda4fccb66a5852bf30cc9))
* **workflow:** improve JSON output extraction and validation in GitHub Actions ([0e7cf6a](https://github.com/gtrevorrow/policy-validation-action/commit/0e7cf6a5cfe7bd948c0515b833dfa8698cb0a5d7))


### Tests

* update integration test to check for exact length of expressions ([7f27893](https://github.com/gtrevorrow/policy-validation-action/commit/7f27893609648f0d4cea7770e9ec0a379158309c))
* **workflow:** add custom extractor pattern test using environment variable. ([46c5756](https://github.com/gtrevorrow/policy-validation-action/commit/46c57561936fc1b6d41efe845559022772187738))
* **workflow:** correct outcome check for test fixtures in workflow ([ada803c](https://github.com/gtrevorrow/policy-validation-action/commit/ada803cd5d89ec157e8b0c415fe6e4146191653d))
* **workflow:** correct typo in tenancy definition in test workflow ([6eaa687](https://github.com/gtrevorrow/policy-validation-action/commit/6eaa68788858f0aaad668773603cc81f7439a30f))
* **workflow:** enhance JSON structure validation in output handling ([a4271ba](https://github.com/gtrevorrow/policy-validation-action/commit/a4271bad80a5ba9c86ecde2ea7125ed18538d3fe))
* **workflow:** enhance JSON validation logic in verify_json function ([8f90c8f](https://github.com/gtrevorrow/policy-validation-action/commit/8f90c8f1c83fd2b0db6bca4248afab5807c150d1))
* **workflow:** enhance output verification by explicitly handling step names and improving JSON validation ([443b599](https://github.com/gtrevorrow/policy-validation-action/commit/443b59947c07a862492c36a79a51a626a3506e2e))
* **workflow:** enhance output verification for invalid policy tests with JSON validation ([a7810c9](https://github.com/gtrevorrow/policy-validation-action/commit/a7810c926e41f5b36216f720cc94715231e8024d))
* **workflow:** enhance output verification in GitHub Actions with detailed logging ([81679f9](https://github.com/gtrevorrow/policy-validation-action/commit/81679f9f173ce8aa2f684b281be39f9ab08757f6))
* **workflow:** improve output verification by using step names and handling different cases ([5b738b9](https://github.com/gtrevorrow/policy-validation-action/commit/5b738b91a3d67d358069ca19fc33a963cdc8a8f1))
* **workflow:** install jq for JSON processing in bitbucket-pipelines.yml ([22c7a57](https://github.com/gtrevorrow/policy-validation-action/commit/22c7a57cc7e27a3e770811449b79ce1e7f67cfed))
* **workflow:** install jq for JSON processing in gitlab CI pipeline ([60ac811](https://github.com/gtrevorrow/policy-validation-action/commit/60ac811d18234a244f9004ff83c285e29047e92f))


### Refactors

* standardize validation output format across CLI and GitHub Action ([4b30f55](https://github.com/gtrevorrow/policy-validation-action/commit/4b30f550a8332522cd51d449c89007cd9d7f08a7))
* **workflow:** enhance verify_json function with stricter type checking ([237554f](https://github.com/gtrevorrow/policy-validation-action/commit/237554fff0e15a231bf92ff14103dd482bf1a471))
* **workflow:** improve JSON validation logic in output handling ([b539824](https://github.com/gtrevorrow/policy-validation-action/commit/b539824780ba044309358477df504772e9a5a466))
* **workflow:** remove validatePolicies function and streamline policy validation in runAction ([09e3137](https://github.com/gtrevorrow/policy-validation-action/commit/09e3137e60a35a41efdb3ce97144b4241478d0b9))
* **workflow:** simplify output verification by using environment variables in test.yml ([02a5ab3](https://github.com/gtrevorrow/policy-validation-action/commit/02a5ab3ae5e19740bd1c67a61637b876732efc0a))
* **workflow:** streamline policy validation output handling in runAction ([4dd899a](https://github.com/gtrevorrow/policy-validation-action/commit/4dd899aaa701f539f8fb01830b1bd75195efad26))
* **workflow:** update jq filter for improved JSON structure verification in test.yml ([1fd2794](https://github.com/gtrevorrow/policy-validation-action/commit/1fd27949d75699d40672de49e057d5c1819c4d2e))


### Documentation

* update README formatting for improved readability and consistency ([62b2142](https://github.com/gtrevorrow/policy-validation-action/commit/62b214284d09836ac7b86b048e549999e7e956a8))
* update README to include Table of Contents and enhance sections for clarity ([461fefb](https://github.com/gtrevorrow/policy-validation-action/commit/461fefb7e18ca7b491b387f6618867832ec7e317))


### Maintenance

* Fix formatting in release workflow configuration ([a738826](https://github.com/gtrevorrow/policy-validation-action/commit/a7388263a1f5f6d2ab6c19e54ec6fbf8720c771f))
* **package.json:** updated the repository url with the correct github url ([6cdc0f7](https://github.com/gtrevorrow/policy-validation-action/commit/6cdc0f7a08ec729390a5e4fac3fe24b907b892fe))
* Refactor CI configurations to use globally installed CLI ([f12e6ce](https://github.com/gtrevorrow/policy-validation-action/commit/f12e6ce0e12919a5ee0237748e2362f98c06f2fa))

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
