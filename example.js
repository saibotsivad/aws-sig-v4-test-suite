/*

This example shows how you would use this test suite.

For example, I'll use aws-sign-web[^1], which is a 
signing module designed for the browser.

[1]: https://github.com/danieljoos/aws-sign-web

*/
const { config, tests } = require('./index.json')
const awsSignWeb = require('aws-sign-web')
const jsdom = require('jsdom')

const { window } = new jsdom.JSDOM('', { pretendToBeVisual: true })
global.window = window
global.document = window.document

const signDate = new Date('2015-08-30T12:36:00Z')
const awsSigner = new awsSignWeb.AwsSigner(config)

tests.basic.forEach(test => {
	const request = {
		method: test.request.method,
		url: `https://${test.request.headers.Host}${test.request.uri}`,
		headers: {},
		body: test.request.body,
	}

	test.request.headers.forEach(([ key, value ]) => {
		if (request.headers[key]) {
			request.headers[key] += `, ${value}`
		} else {
			request.headers[key] = value
		}
	})

	const signed = awsSigner.sign(request, signDate)
	if (test.authz !== signed.Authorization) {
		console.error('The generated signature did not match the expected!')
		console.log('Expected: ', test.authz)
		console.log('Actual: ', signed.Authorization)
		process.exit(1)
	}
})
