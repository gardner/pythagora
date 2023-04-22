const AVAILABLE_MODES = Object.keys(require('../const/modes.json'));
const argsStr = process.env.PYTHAGORA_CONFIG;
const { deleteTest } = require('../helpers/starting.js');
const { logAndExit } = require('./cmdPrint.js');

const argArray = argsStr.split("--");
const args = {};

for (let i = 0; i < argArray.length; i++) {
    const arg = argArray[i].trim().split(' ');

    if (!arg[0]) continue;
    args[arg[0].replace(/-/g, '_')] = arg.length > 2 ? arg.slice(1) : (arg[1] || true);
}

if (args.delete) deleteTest(args.delete);

if (!args.mode) {
    if (args.rerun_all_failed || args.test_id) {
        console.log('Mode not provided. Setting to "test".');
        args.mode = 'test';
    } else {
        console.log('Mode not provided. Defaulting to "capture".');
        args.mode = 'capture';
    }
} else if (!AVAILABLE_MODES.includes(args.mode)) {
    logAndExit(`Mode "${args.mode}" not recognized. Available modes are: ${AVAILABLE_MODES.join(', ')}`);
}

if (args.rerun_all_failed && args.mode !== 'test') logAndExit(`Flag --rerun_all_failed allowed only in "--mode test"`);
if (args.test_id && !(args.mode === 'test' || args.mode === 'jest')) logAndExit(`Flag --test-id allowed only in "--mode test"`);
if (args.rerun_all_failed && args.test_id) logAndExit(`Not allowed to set flags --rerun_all_failed and --test-id at same time.`);

if (args.pick && args.mode !== 'capture') logAndExit(`Flag --pick allowed only in "--mode capture"`);
if (args.ignore && args.mode !== 'capture') logAndExit(`Flag --ignore allowed only in "--mode capture"`);

console.log(`Running "${process.env.PYTHAGORA_CONFIG}" using Pythagora in "${args.mode.toUpperCase()}" mode.`);

module.exports = args
