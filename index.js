const { basic, normalizePath, sts } = require('./tests.json')

module.exports = {
	// Values taken from documentation: https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html
	config: {
		service: 'service',
		region: 'us-east-1',
		accessKeyId: 'AKIDEXAMPLE',
		secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
	},
	// Value copied from "post-sts-token/readme.txt"
	stsToken: 'AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA==',
	// Parsed and raw tests
	tests: {
		all: [ ...basic, ...normalizePath, ...sts ],
		basic,
		normalizePath,
		sts
	}
}
