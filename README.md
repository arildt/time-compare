# time-compare
Compares time registrations between NAV and Jira.

## Usage

`node index --users path/to/users.yml --cases path/to/cases.yml --jira path/to/jira.xls --nav path/to/nav.xlsx --from 2018-11-01 --to 2018-11-30`

### CLI Arguments

* `users`: The path to the users master data file (YAML format).
* `cases`: The path to the NAV cases master data file (YAML format).
* `jira`: The path to the Jira Excel report. The path may be relative to the directory from which you are executing the script, or absolute, i.e. `~/Downloads/jira-report.xls`.
* `nav`: The path to the NAV Excel report. The path may be relative to the directory from which you are executing the script, or absolute, i.e. `~/Downloads/nav-report.xls`.
* `from`: The date from which to compare the reports. The `from` date is inclusive.
* `to`: The date to which to compare the reports. The `to` date is inclusive.

### Users Master Data

Master data of the users for whom to check time registrations. Represented as an object with the NAV user identity as key and the various constellation of names (to consolidate NAV user with Jira user) as values.

Example format:

```yaml
JOND:
  - Jon Doe
  - Jon Frank Doe
PAULP:
  - Paul Phoenix
```

### Cases Master Data

Master data of the NAV cases for which to check time registrations. Represented as an object with the unique Jira label as key (should start with "NC-") and various case parameters as values.

Example format:

```yaml
NC-SomeDelivery-NFR0001:
  deliveryNo: NFR0001
  caseNo: 16000100
  caseDescription: Some Delivery
NC-SomeOtherDelivery-NFR0002:
  deliveryNo: NFR0002
  caseNo: 16000100
  caseDescription: Some Other Delivery
```

## Output

The deviation reports are generated and written to a folder in the directory from which you are executing the script. The name of the folder is the timestamp at which the script was executed, e.g. `2019-03-29T183542.293Z`.
