const indexAndAggregateNavItems = require('./indexAndAggregateNavItems');
const indexAndAggregateJiraItems = require('./indexAndAggregateJiraItems');
const isUnequalHours = require('./isUnequalHours');

// Declare the various types of deviation.
const DEVIATION_TYPES = {
	NOT_FOUND_IN_NAV: 'NOT_FOUND_IN_NAV',
	NOT_FOUND_IN_JIRA: 'NOT_FOUND_IN_JIRA',
	HOUR_MISMATCH: 'HOUR_MISMATCH'
};

module.exports = (navReport, jiraReport, cases, users) => {
	// Need to aggregate hours for NAV items and Jira items.
	const aggregatedNavReport = indexAndAggregateNavItems(navReport, cases);
	const aggregatedJiraReport = indexAndAggregateJiraItems(jiraReport, cases, users);

	console.log(cases);

	const visitedIndices = [];

	// Holds all deviations.
	const deviations = [];

	// Loop through each aggregated entry in the Jira report.
	Object.keys(aggregatedJiraReport).forEach(index => {
		const jiraItem = aggregatedJiraReport[index];
		const navItem = aggregatedNavReport[index];

		visitedIndices.push(index);

		if (!navItem) {
			const deviation = {
				userId: jiraItem.user.navUser,
				userName: jiraItem.Username,
				date: jiraItem.Date,
				deliveryNo: jiraItem.case.deliveryNo,
				caseNo: jiraItem.case.caseNo,
				caseDescription: jiraItem.case.caseDescription,
				jiraLabel: jiraItem.Labels,
				jiraTask: jiraItem.Key,
				jiraHours: jiraItem.TimeSpent,
				navHours: 0,
				hourDeviation: -jiraItem.TimeSpent,
				deviationType: DEVIATION_TYPES.NOT_FOUND_IN_NAV
			};
			deviations.push(deviation);
			return;
		}

		if (isUnequalHours(navItem, jiraItem)) {
			const deviation = {
				userId: jiraItem.user.navUser,
				userName: jiraItem.Username,
				date: jiraItem.Date,
				deliveryNo: jiraItem.case.deliveryNo,
				caseNo: jiraItem.case.caseNo,
				caseDescription: jiraItem.case.caseDescription,
				jiraLabel: jiraItem.Labels,
				jiraTask: jiraItem.Key,
				jiraHours: jiraItem.TimeSpent,
				navHours: navItem.Quantity,
				hourDeviation: navItem.Quantity - jiraItem.TimeSpent,
				deviationType: DEVIATION_TYPES.HOUR_MISMATCH
			}
			deviations.push(deviation);
		}
	});

	Object.keys(aggregatedNavReport).forEach(index => {
		if (visitedIndices.includes(index)) {
			return;
		}

		const navItem = aggregatedNavReport[index];
		const jiraItem = aggregatedJiraReport[index];

		if (!jiraItem) {
			if (navItem.Quantity === 0) {
				return;
			}

			const deviation = {
				userId: navItem.No,
				userName: navItem.Description,
				date: navItem.DocumentDate,
				deliveryNo: navItem.case.deliveryNo,
				caseNo: navItem.case.caseNo,
				caseDescription: navItem.case.caseDescription,
				jiraLabel: navItem.case.jiraLabel,
				jiraTask: '',
				jiraHours: 0,
				navHours: navItem.Quantity,
				hourDeviation: navItem.Quantity,
				deviationType: DEVIATION_TYPES.NOT_FOUND_IN_JIRA
			};

			deviations.push(deviation);
		}
	});

	return deviations;
}
