const fs = require('fs')
const path = require('path')

const awsFolder = './raw/aws-sig-v4-test-suite'

const read = file => fs.readFileSync(file, { encoding: 'utf8' })

const parseRequest = requestString => {
	const [ requestLine, ...lines ] = requestString.split(/\r?\n/)
	const [ method, uri, protocol ] = requestLine.split(' ')
	const request = { method, uri, protocol }

	const [ path, query ] = uri.split('?')
	request.path = path
	request.query = (query || '').replace(/^\?/, '')

	const headerLines = []
	while (lines.length > 0) {
		const line = lines.shift()
		if (line === '') {
			break
		}
		headerLines.push(line)
	}

	request.headers = headerLines
		.reduce((headers, line) => {
			headers.push(line.split(':').map(part => part.trim()))
			return headers
		}, [])

	request.body = lines.join('\r\n')

	return request
}

const load = prefix => name => {
	const test = path.join(awsFolder, prefix, name, name)
	const req = read(test + '.req')
	return {
		name,
		request: parseRequest(req),
			// method
			// uri
			// STRETCH: path vs query?
			// headers [ [key,val] ]
			// body
		req,
		authz: read(test + '.authz'),
		creq: read(test + '.creq'),
		sreq: read(test + '.sreq'),
		sts: read(test + '.sts')
	}
}

const basic = fs
	.readdirSync(awsFolder)
	.filter(folder => folder !== 'normalize-path' && folder !== 'post-sts-token')
	.map(load('.'))

const normalizePath = fs
	.readdirSync(path.join(awsFolder, 'normalize-path'))
	.filter(folder => !folder.includes('.txt'))
	.map(load('normalize-path'))

const sts = fs
	.readdirSync(path.join(awsFolder, 'post-sts-token'))
	.filter(folder => !folder.includes('.txt'))
	.map(load('post-sts-token'))

const json = {
	// Values taken from documentation:
	// https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html
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

fs.writeFileSync('./index.json', JSON.stringify(json, undefined, 2), { encoding: 'utf8' })
