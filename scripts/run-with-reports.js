/**
 * Test runner: bddgen -> playwright test -> always generate Allure HTML report.
 *
 * The Allure report is generated even when tests fail (failed runs are exactly
 * when the report matters most). The process exit code still follows the test
 * result, so CI keeps working correctly.
 *
 * Extra CLI args are forwarded to `playwright test`, e.g.:
 *   npm test -- --grep @smoke
 */
const { spawnSync } = require('child_process');

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  return result.status ?? 1;
}

// 1. Generate Playwright tests from .feature files
let exitCode = run('npx', ['bddgen']);

// 2. Run the tests (Playwright HTML report is generated automatically here)
if (exitCode === 0) {
  exitCode = run('npx', ['playwright', 'test', ...process.argv.slice(2)]);
}

// 3. Always generate the Allure HTML report from allure-results/
const allureExitCode = run('npx', [
  'allure',
  'generate',
  'allure-results',
  '-o',
  'allure-report',
  '--clean',
]);

process.exit(exitCode !== 0 ? exitCode : allureExitCode);
