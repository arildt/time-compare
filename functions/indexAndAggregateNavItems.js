const createIndex = require('./createIndex');

// Aggregates all hours per user, delivery, case and date.
module.exports = (navReport, cases) => navReport
	.map(navItem => ({
		...navItem,
		Quantities: [navItem.Quantity]
	}))
	.reduce((acc, navItem) => {
		const caseItem = cases.find(c => c.deliveryNo === navItem.DeliveryNo && c.caseNo === navItem.CaseNo);

		if (!caseItem) {
			console.error(`Unable to identify case from NAV item ${JSON.stringify(navItem)}\n`);
			return acc;
		}

		// Concatenate index based on document date, NAV user name, NAV delivery number and NAV case number.
		const index = createIndex(navItem.DocumentDate, navItem.No, caseItem.deliveryNo, caseItem.caseNo);

		const existingNavItem = acc[index];

		if (!existingNavItem) {
			const navItemWithCase = { ...navItem, case: caseItem };
			return { ...acc, [index]: navItemWithCase };
		}
		
		const extendedNavItem = {
			...existingNavItem,
			Quantity: existingNavItem.Quantity + navItem.Quantity,
			Quantities: [...existingNavItem.Quantities, navItem.Quantity]
		};

		return { ...acc, [index]: extendedNavItem };
	}, {});