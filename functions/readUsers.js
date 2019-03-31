const yaml = require('js-yaml');
const fs = require('fs');

module.exports = file => {
	const doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));

	return Object.keys(doc).map(navUser => ({
		navUser,
		jiraUser: doc[navUser]
	}));
};
