const excelToJson = require('convert-excel-to-json');
const { format } = require('date-fns');
const convertExcelSerialDateToJsDate = require('./convertExcelSerialDateToJsDate');
const isDateBetween = require('./isDateBetween');

// Mappers for NAV item fields
const mappers = {
	'Document Date': val => format(convertExcelSerialDateToJsDate(val), 'YYYY-MM-DD'),
	'Posting Date': val => format(convertExcelSerialDateToJsDate(val), 'YYYY-MM-DD')
};

module.exports = (file, from, to) => {
	const navResult = excelToJson({
	    sourceFile: file,
	    columnToKey: {
	        'A': '{{A1}}',
	        'B': '{{B1}}',
	        'C': '{{C1}}',
	        'D': '{{D1}}',
	        'E': '{{E1}}',
	        'F': '{{F1}}',
	        'G': '{{G1}}',
	        'H': '{{H1}}',
	        'I': '{{I1}}',
	        'J': '{{J1}}',
	        'K': '{{K1}}',
	        'L': '{{L1}}',
	        'M': '{{M1}}',
	        'N': '{{N1}}',
	        'O': '{{O1}}',
	        'P': '{{P1}}',
	        'Q': '{{Q1}}'
	    },
	    header: {
	    	rows: 1
	    }
	});

	const navReport = navResult['Netcompany Job Ledger Entries'];

	// Map NAV items with registered mappers.
	const mappedNavReport = navReport.map(item => {
		const mappedItem = {};

		Object.keys(item).forEach(key => {
			const mapper = mappers[key] || (val => val);
			mappedItem[key] = mapper ? mapper(item[key]) : item[key];
		});
		return mappedItem;
	});

	// Filter so that we get report items within the specified date interval.
	const filteredNavReport = mappedNavReport.filter(item => isDateBetween(item['Document Date'], from, to));

	// Map field names to make them more readable.
	const navReportWithReadableFields = filteredNavReport.map(item => ({
		...item,
		No: item['No.'],
		DocumentDate: item['Document Date'],
		PostingDate: item['Posting Date'],
		DeliveryNo: item['Delivery No.'],
		CaseNo: item['Case No.']
	}));

	return navReportWithReadableFields;
}