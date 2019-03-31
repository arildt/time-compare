const json2xls = require('json2xls');
const fs = require('fs');
const sanitize = require('sanitize-filename');

module.exports = (dirName, deviations) => {
	// Create folder based on timestamp.
	const dateTimePath = sanitize(new Date().toISOString());
	const pathToFiles = `${dirName}/${dateTimePath}`;
	fs.mkdirSync(pathToFiles, { recursive: true });

	// Write report for all deviations.
	const allFileName = `${pathToFiles}/All.xlsx`;
	const xlsAll = json2xls(deviations);
	console.log('Output:', allFileName);
	fs.writeFileSync(allFileName, xlsAll, 'binary');

	// Get unique user IDs from the deviation entries.
	const userIds = [...new Set(deviations.map(deviation => deviation.userId))];

	// Write a deviation report per user.
	userIds.forEach(userId => {
		const userDeviations = deviations.filter(deviation => deviation.userId === userId);
		const xlsUser = json2xls(userDeviations);
		const userFileName = `${pathToFiles}/${userId}.xlsx`;
		console.log('Output:', userFileName);
		fs.writeFileSync(userFileName, xlsUser, 'binary');
	});
}
