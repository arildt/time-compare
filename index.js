const argv = require('minimist')(process.argv.slice(2));

const readUsers = require('./functions/readUsers');
const readCases = require('./functions/readCases');
const loadNavReport = require('./functions/loadNavReport');
const loadJiraReport = require('./functions/loadJiraReport');
const identifyDeviations = require('./functions/identifyDeviations');
const writeDeviationReports = require('./functions/writeDeviationReports');

const users = readUsers(argv.users);
const cases = readCases(argv.cases);

const navReport = loadNavReport(argv.nav, argv.from, argv.to);
const jiraReport = loadJiraReport(argv.jira, argv.from, argv.to);

const deviations = identifyDeviations(navReport, jiraReport, cases, users);

writeDeviationReports(__dirname, deviations);
