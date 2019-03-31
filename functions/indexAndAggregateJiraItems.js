const createIndex = require('./createIndex');

// Aggregates all hours per user, delivery, case and date.
module.exports = (jiraReport, cases, users) => jiraReport
	.map(item => ({
		...item,
		user: users.find(u => Array.isArray(u.jiraUser)
			? u.jiraUser.find(u2 => u2 === item.Username)
			: u.jiraUser === item.Username),
		workLogs: [
			{
				TimeSpent: item.TimeSpent,
				Comment: item.Comment
			}
		]
	}))
	.reduce((acc, item) => {
		const caseItem = cases.find(c => c.jiraLabel === item.Labels);

		if (!caseItem) {
			console.error(`Unable to identify case from JIRA item: ${JSON.stringify(item)}\n`);
			return acc;
		}

		if (!item.user) {
			console.error(`Unable to identify NAV user identity from JIRA username: ${item.Username}`);
			return acc;
		}
		
		// Create index based on date, NAV user name, NAV delivery number and NAV case number.
		const index = createIndex(item.Date, item.user.navUser, caseItem.deliveryNo, caseItem.caseNo);
		
		const existingJiraItem = acc[index];

		if (!existingJiraItem) {
			const jiraItemWithCase = { ...item, case: caseItem };
			return { ...acc, [index]: jiraItemWithCase };
		}

		const jiraItemWithCaseAndWorkLogs = {
			...existingJiraItem,
			TimeSpent: existingJiraItem.TimeSpent + item.TimeSpent,
			workLogs: [...existingJiraItem.workLogs, {
				TimeSpent: item.TimeSpent,
				Comment: item.Comment
			}]
		};
		
		return { ...acc, [index]: jiraItemWithCaseAndWorkLogs };
	}, {});