# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Change categories are:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for once-stable features removed in upcoming releases.
* `Removed` for deprecated features removed in this release.
* `Fixed` for any bug fixes.
* `Security` to invite users to upgrade in case of vulnerabilities.

## [Unreleased]

n/a

## [2.0.1] - 2010-01-24

### Fixed

- Multi-line header values were previously parsed incorrectly. Based
  on my reading of [the specs](http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2)
  a multi-line header `Key: A\n\s+B` would become `Key: A\sB` so
  that's how it's parsed.

## [2.0.0] - 2020-01-10

### Added

- The generated JSON `request` object now includes `path` and `query`
  to make it easier to grab those parts without parsing the `uri` part.

### Changed

- All data is available at `/index.json` for easier parsing by
  non-JavaScript projects.
- To handle duplicate header keys, the `headers` object for each
  request is now an array of arrays, each inner array a two-element
  key/value pair. (See the [./example.js](example) to see how you
  might use that.) Fixes #1

## [1.0.0] - 2019-10-04

### Added

- Project initialization.

[Unreleased]: https://github.com/saibotsivad/aws-sig-v4-test-suite/branches/compare/develop..master
[2.0.1]: https://github.com/saibotsivad/aws-sig-v4-test-suite/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/saibotsivad/aws-sig-v4-test-suite/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/saibotsivad/aws-sig-v4-test-suite/src/v1.0.0/
