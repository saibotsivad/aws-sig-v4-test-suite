# aws-sig-v4-test-suite

These are the test suite files found in the [AWS documentation](https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html).

For convenience, the request files are also available as parsed objects, using [http-string-parser](https://github.com/apiaryio/http-string-parser).

Your test file would probably look something like this:

```js
const suite = require('aws-sig-v4-test-suite')

// The AWS configuration object, taken from their documentation
suite.config
suite.config.region // => "us-east-1"
suite.config.scope // => "AKIDEXAMPLE/2015..."
suite.config.key // => "wJalrXUtn..."
suite.config.service // => "service"

// Taken from the test suite files
suite.stsToken // => "AQoDYXdzEPT..."

suite.tests.all.forEach(test => {
	// The folder name
	test.name // => "get-header-key-duplicate"

	// The request, parsed for convenience
	test.request.method // => GET
	test.request.headers['My-Header1'] // => "value1"
	//...

	// Each file
	test.req // => "GET / HTTP/1.1\nHost:example..."
	test.authz // => "AWS4-HMAC..."
	test.creq // => "GET\n/\n\nhost:example..."
	test.sreq // => "GET / HTTP/1.1\nHost:example..."
	test.sts // => "AWS4-HMAC..."
});
```

## API

The following properties are exported:

#### `config: Object`

This is the AWS configuration details, taken from their documentation page. It contains:

* `region: String` - The AWS region used in the tests.
* `scope: String` - Taken from the AWS documentation page.
* `service: String` - Taken from the AWS documentation page.
* `key: String` - Taken from the AWS documentation page.

#### `stsToken: String`

Used when making AWS STS requests, taken from the AWS test suite files.

#### `tests: Object`

An object containing four lists of tests.

* `tests.all: Array` - The full list of tests.
* `tests.basic: Array` - The subset not including STS or path normalization.
* `tests.normalizePath: Array` - The subset only testing path normalization.
* `tests.sts: Array` - The subset only testing STS requests.

Each test object contains the following properties:

* `req: String` - The `.req` file contents.
* `authz: String` - The `.authz` file contents.
* `creq: String` - The `.creq` file contents.
* `sreq: String` - The `.sreq` file contents.
* `sts: String` - The `.sts` file contents.
* `request: Object` - The `.req` file parsed as an HTTP request, without modification, which contains:
	* `request.method: String` - The method name.
	* `request.uri: String` - The full path and query parameters.
	* `request.headers: String` - A case-sensitive map of header key-values.
	* `request.body: String` - The body contents.

## Contributing

I do not anticipate this module changing, but if you have suggestions please open an issue to discuss it.

## License

The test files originated from AWS, but were given with an Apache 2.0 license.

This test suite, all other generated code, documentation, and assets, are released under the [Very Open License](http://veryopenlicense.com)
