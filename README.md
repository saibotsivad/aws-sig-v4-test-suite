# @saibotsivad/aws-sig-v4-test-suite

These are the test suite files found in the [AWS documentation](https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html).

The raw request files from AWS have been parsed, and are exported as objects in the `index.json` file.

## install

Using npm:

```bash
npm install --save-dev @saibotsivad/aws-sig-v4-test-suite
```

## example

Your test file would probably look something like this:

```js
const suite = require('@saibotsivad/aws-sig-v4-test-suite')

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
	test.request.headers // => [ 'My-Header1', 'value1' ]
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
	* `request.uri: String` - The full path and query parameters, from the AWS test.
	* `request.query: String` - The query portion of the URI, without the leading `?` character.
	* `request.path: String` - The path portion of the URI, without URI encoding.
	* `request.headers: Array<String, String>` - A case-sensitive list of header key-value pairs.
	* `request.body: String` - The body contents.

## Notes on Headers

By far the quirkiest bit of this is the header parsing. In general, most JavaScript libraries do not support multiple entries for the same header key, e.g. the following is valid:

```
GET / HTTP/1.1
Host: example.com
My-Header1: value1
My-Header1: value2
```

My understanding of the HTTP specs is that the equivalent single-key request would look like this (and *is* supported in all HTTP request libraries):

```
GET / HTTP/1.1
Host: example.com
My-Header1: value1, value2
```

However, to give the most flexibility to consumers of this library, I have parsed HTTP request headers to an array of key/value pairs, so the above example headers parse to:

```json
[
	[ "Host", "example.com" ],
	[ "My-Header1", "value1" ],
	[ "My-Header1", "value2" ]
]
```

As a consumer of this library, it is your responsibility to handle headers in the way that makes the most sense for your software.

## Notes on Bad Tests

There are two tests provided by AWS which do not conform to their specifications. I've opened communications with them and hope to find a resolution, but in the meanwhile both these tests have been removed from the exported JSON test suite.

### get-header-value-multiline

According to the AWS test `get-header-value-multiline`, the request:

```
GET / HTTP/1.1
Host: example.amazonaws.com
My-Header1: value1
  value2
     value3
X-Amz-Date:20150830T123600Z
```

Should normalize to this:

```
GET / HTTP/1.1
Host: example.amazonaws.com
My-Header1: value1, value2, value3
X-Amz-Date:20150830T123600Z
```

However, my understanding of the HTTP request specs (see [here](https://stackoverflow.com/questions/31237198/is-it-possible-to-include-multiple-crlfs-in-a-http-header-field) for discussion) is that the correct interpretation of the request would be this equivalent form:

```
GET / HTTP/1.1
Host: example.amazonaws.com
My-Header1: value1 value2 value3
X-Amz-Date:20150830T123600Z
```

In fact, the comma delimited form that AWS considers equivalent would be equivalent to:

```
GET / HTTP/1.1
Host: example.amazonaws.com
My-Header1: value1
My-Header1: value2
My-Header1: value3
X-Amz-Date:20150830T123600Z
```

I have decided to drop this single test from the `tests.all` property, until I hear a correction on my interpretation.

### get-utf8

The [signature specs](https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html) state that "each path segment must be URI-encoded twice", giving the example:

```
Original: /documents and settings/
=>
Encoded Once: /documents%20and%20settings/
=>
Canonical (Encoded Twice):
/documents%2520and%2520settings/
```

However, in the `get-utf8` test, the path `/ሴ` is shown encoded only once, as `/%E1%88%B4` instead of `/%25E1%2588%25B4` which would be encoded twice.

## Contributing

I do not anticipate this module changing, but if you have suggestions please open an issue to discuss it.

## License

The test files originated from AWS, but were given with an Apache 2.0 license.

This test suite, all other generated code, documentation, and assets, are released under the [Very Open License](http://veryopenlicense.com)
