const fs = require('fs');
const cheerio = require('cheerio');
const isDateBetween = require('./isDateBetween');

// Set up mappers for specific fields in the report.
const mappers = {
	// Remove timestamp
	Date: val => {
		const day = val.substring(0, 2);
		const month = val.substring(3, 5);
		const year = val.substring(6, 10);
		return `${year}-${month}-${day}`;
	},
	// Remove labels that do not start with "NC-""
	Labels: val => val.split(/, ?/).filter(token => token.startsWith('NC-')).join(', '),
	// Parse time spent.
	'Time Spent (h)': val => parseFloat(val)
};

module.exports = (file, from, to) => {
	const content = fs.readFileSync(file);
	const $ = cheerio.load(content);

	const tables = [];

	$('table table').each((i, tableElem) => {
		const table = [];

		// Collects column headers.
		const columns = [];

		$(tableElem).find('tr').each((rowIndex, rowElem) => {
			const row = {};
			
			$(rowElem).find('td').each((columnIndex, cellElem) => {
				const cellText = $(cellElem).text().trim();

				if (rowIndex === 0) {
					columns.push(cellText);
				}

				const mapper = mappers[columns[columnIndex]];
				row[columns[columnIndex]] = mapper ? mapper(cellText) : cellText;
			});

			if (rowIndex !== 0) {
				table.push(row);
			}
		});

		tables.push(table);
	});

	// First table is the report table.
	const jiraReport = tables[0];

	// Removing total row at the bottom of JIRA report.
	jiraReport.pop();

	// Filter so that we get report items within the specified date interval.
	const filteredJiraReport = jiraReport.filter(item => isDateBetween(item.Date, from, to));

	// Map field names to make them more readable.
	const jiraReportWithReadableFields = filteredJiraReport.map(item => ({
		...item,
		TimeSpent: item['Time Spent (h)']
	}));

	return jiraReportWithReadableFields;
};