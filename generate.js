const { parseRequest } = require('http-string-parser')
const fs = require('fs')
const path = require('path')

const awsFolder = './raw/aws-sig-v4-test-suite'

const read = file => fs.readFileSync(file, { encoding: 'utf8' })

const load = prefix => name => {
	const test = path.join(awsFolder, prefix, name, name)
	const req = read(test + '.req')
	return {
		name,
		request: parseRequest(req),
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

const tests = { basic, normalizePath, sts }

fs.writeFileSync('./tests.json', JSON.stringify(tests, undefined, 2), { encoding: 'utf8' })
