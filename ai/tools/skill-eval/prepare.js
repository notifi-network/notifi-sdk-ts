#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = {
    install: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--skill') {
      args.skill = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--eval') {
      args.evalId = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--install') {
      args.install = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  return args;
}

function usage() {
  return [
    'Usage:',
    '  npm run skill-eval:prepare -- --skill <skill-name> --eval <eval-id> [--install]',
    '',
    'Options:',
    '  --skill    Skill name, for example: notifi-react-integration',
    "  --eval     Eval id from the skill's evals.json",
    '  --install  Run the fixture install command after checkout',
  ].join('\n');
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Unable to read JSON at ${filePath}: ${error.message}`);
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: options.captureOutput ? 'pipe' : 'inherit',
  });

  if (result.error) {
    fail(`Failed to run ${command}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    if (options.captureOutput) {
      const stderr = (result.stderr || '').trim();
      const stdout = (result.stdout || '').trim();
      const details = stderr || stdout;
      fail(
        `${command} ${args.join(' ')} failed${details ? `: ${details}` : ''}`,
      );
    }

    fail(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }

  return result;
}

function canResolveCommit(repoPath, commit) {
  const result = spawnSync(
    'git',
    ['rev-parse', '--verify', `${commit}^{commit}`],
    {
      cwd: repoPath,
      encoding: 'utf8',
      stdio: 'pipe',
    },
  );

  return result.status === 0;
}

function ensureCommitAvailable(repoPath, commit) {
  if (canResolveCommit(repoPath, commit)) {
    return;
  }

  const fetchResult = spawnSync('git', ['fetch', 'origin', commit], {
    cwd: repoPath,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (fetchResult.status === 0 && canResolveCommit(repoPath, commit)) {
    return;
  }

  fail(
    `Commit ${commit} is not available in the fixture repo. Check the fixture metadata and make sure the pinned commit exists.`,
  );
}

function getRepoRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function getAiRoot(repoRoot) {
  return path.join(repoRoot, 'ai');
}

function makeRunId(evalId) {
  return `${new Date().toISOString().replace(/[:.]/g, '-')}-eval-${evalId}`;
}

function getRelativePath(rootPath, targetPath) {
  return path.relative(rootPath, targetPath) || '.';
}

function formatAppContext(appContext) {
  if (!appContext || typeof appContext !== 'object') {
    return '- None provided';
  }

  return Object.entries(appContext)
    .map(([key, value]) => `- ${key}: ${String(value)}`)
    .join('\n');
}

function extractRubricDimensions(rubricContent) {
  return rubricContent
    .split('\n')
    .filter((line) => line.startsWith('### '))
    .map((line) => line.slice(4).trim());
}

function buildPromptContent({
  evalEntry,
  fixtureJson,
  runDirectory,
  fixtureDirectory,
  rubricPath,
  repoRoot,
}) {
  const relativeFixtureDirectory = getRelativePath(repoRoot, fixtureDirectory);
  const relativeRunDirectory = getRelativePath(repoRoot, runDirectory);
  const relativeRubricPath = getRelativePath(repoRoot, rubricPath);

  return [
    `Skill: ${evalEntry.skillName}`,
    `Eval ID: ${evalEntry.id}`,
    fixtureJson.fixture_id ? `Fixture: ${fixtureJson.fixture_id}` : null,
    `Fixture repo path: ${relativeFixtureDirectory}`,
    `Run directory: ${relativeRunDirectory}`,
    `Rubric: ${relativeRubricPath}`,
    '',
    'Fixture summary:',
    fixtureJson.description || 'No fixture description provided.',
    '',
    'App context:',
    formatAppContext(fixtureJson.app_context),
    '',
    'Eval prompt:',
    evalEntry.prompt,
    '',
    'Expected output:',
    evalEntry.expected_output || 'No expected output provided.',
    '',
    'Reviewer guidance:',
    '- Use the rubric to score the result after the agent finishes.',
    '- Check whether runtime placeholders are clearly called out instead of silently hardcoded.',
    '- Prefer the smallest correct integration over a demo-only wrapper.',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildReviewTemplate({
  rubricContent,
  evalEntry,
  fixtureJson,
  repoRoot,
  rubricPath,
}) {
  const dimensions = extractRubricDimensions(rubricContent);
  const relativeRubricPath = getRelativePath(repoRoot, rubricPath);
  const lines = [
    `# Review Template - ${evalEntry.skillName} eval ${evalEntry.id}`,
    '',
    `- Fixture: ${fixtureJson.fixture_id || 'unknown'}`,
    `- Rubric: ${relativeRubricPath}`,
    '',
    '## Result',
    '',
  ];

  for (const dimension of dimensions) {
    lines.push(`### ${dimension}`);
    lines.push('');
    lines.push('- Score: Pass / Partial / Fail');
    lines.push('- Notes:');
    lines.push('');
  }

  lines.push('## Overall');
  lines.push('');
  lines.push('- Overall: Pass / Partial / Fail');
  lines.push('- Summary:');

  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(usage());
    return;
  }

  if (!args.skill || !args.evalId) {
    console.log(usage());
    fail('Both --skill and --eval are required.');
  }

  const repoRoot = getRepoRoot();
  const aiRoot = getAiRoot(repoRoot);
  const evalsPath = path.join(
    aiRoot,
    'skills',
    args.skill,
    'evals',
    'evals.json',
  );
  const evalsJson = readJson(evalsPath);
  const evalId = Number(args.evalId);
  const evalEntry = (evalsJson.evals || []).find(
    (entry) => Number(entry.id) === evalId,
  );

  if (!evalEntry) {
    fail(`Eval ${args.evalId} not found in ${evalsPath}`);
  }

  if (!evalEntry.fixture || !evalEntry.fixture.path) {
    fail(`Eval ${args.evalId} does not define a fixture path.`);
  }

  evalEntry.skillName = evalsJson.skill_name || args.skill;

  const fixturePath = path.join(repoRoot, evalEntry.fixture.path);
  const fixtureJson = readJson(fixturePath);

  if (!fixtureJson.repo) {
    fail(`Fixture ${fixturePath} is missing repo.`);
  }

  if (!fixtureJson.commit) {
    fail(`Fixture ${fixturePath} is missing commit.`);
  }

  const rubricRelativePath =
    evalsJson.rubric || path.join('evals', 'rubric.md');
  const rubricPath = path.join(
    aiRoot,
    'skills',
    args.skill,
    rubricRelativePath.replace(/^evals\//, 'evals/'),
  );

  if (!fs.existsSync(rubricPath)) {
    fail(`Rubric not found at ${rubricPath}`);
  }

  const workspaceRoot = path.join(aiRoot, '.workspaces', args.skill);
  const fixturesRoot = path.join(workspaceRoot, 'fixtures');
  const runsRoot = path.join(workspaceRoot, 'runs');
  const fixtureId =
    fixtureJson.fixture_id || evalEntry.fixture.fixture_id || `eval-${evalId}`;
  const fixtureDirectory = path.join(fixturesRoot, fixtureId);
  const runDirectory = path.join(runsRoot, makeRunId(evalId));
  const promptPath = path.join(runDirectory, 'prompt.txt');
  const reviewTemplatePath = path.join(runDirectory, 'review-template.md');
  const runJsonPath = path.join(runDirectory, 'run.json');

  ensureDir(fixturesRoot);
  ensureDir(runsRoot);

  const fixtureGitDirectory = path.join(fixtureDirectory, '.git');

  if (!fs.existsSync(fixtureGitDirectory)) {
    runCommand('git', ['clone', fixtureJson.repo, fixtureDirectory]);
  }

  const status = runCommand('git', ['status', '--porcelain'], {
    cwd: fixtureDirectory,
    captureOutput: true,
  });

  if ((status.stdout || '').trim()) {
    fail(
      `Fixture repo has local changes at ${getRelativePath(repoRoot, fixtureDirectory)}. Clean it before preparing a new run.`,
    );
  }

  runCommand('git', ['fetch', '--all', '--tags'], { cwd: fixtureDirectory });

  ensureCommitAvailable(fixtureDirectory, fixtureJson.commit);
  runCommand('git', ['checkout', fixtureJson.commit], {
    cwd: fixtureDirectory,
  });

  if (args.install) {
    const installCommand = fixtureJson.setup && fixtureJson.setup.install;

    if (!installCommand) {
      fail(`Fixture ${fixturePath} does not define setup.install.`);
    }

    runCommand('sh', ['-c', installCommand], { cwd: fixtureDirectory });
  }

  ensureDir(runDirectory);

  const rubricContent = fs.readFileSync(rubricPath, 'utf8');
  const promptContent = buildPromptContent({
    evalEntry,
    fixtureJson,
    runDirectory,
    fixtureDirectory,
    rubricPath,
    repoRoot,
  });
  const reviewTemplate = buildReviewTemplate({
    rubricContent,
    evalEntry,
    fixtureJson,
    repoRoot,
    rubricPath,
  });

  const runJson = {
    skill: evalEntry.skillName,
    evalId,
    fixtureId,
    fixtureRepoPath: getRelativePath(repoRoot, fixtureDirectory),
    fixtureCommit: fixtureJson.commit,
    fixtureRepo: fixtureJson.repo,
    promptPath: getRelativePath(repoRoot, promptPath),
    reviewTemplatePath: getRelativePath(repoRoot, reviewTemplatePath),
    rubricPath: getRelativePath(repoRoot, rubricPath),
    createdAt: new Date().toISOString(),
    installRan: args.install,
  };

  fs.writeFileSync(promptPath, `${promptContent}\n`, 'utf8');
  fs.writeFileSync(reviewTemplatePath, `${reviewTemplate}\n`, 'utf8');
  fs.writeFileSync(
    runJsonPath,
    `${JSON.stringify(runJson, null, 2)}\n`,
    'utf8',
  );

  console.log('Prepared eval run successfully.');
  console.log('');
  console.log(`Fixture path: ${runJson.fixtureRepoPath}`);
  console.log(`Fixture commit: ${runJson.fixtureCommit}`);
  console.log(`Run directory: ${getRelativePath(repoRoot, runDirectory)}`);
  console.log(`Prompt: ${runJson.promptPath}`);
  console.log(`Review template: ${runJson.reviewTemplatePath}`);
  console.log(`Rubric: ${runJson.rubricPath}`);
  console.log('');
  console.log('Next step:');
  console.log(
    'Open the fixture repo in a new agent session and use the generated prompt.txt content.',
  );
}

main();
