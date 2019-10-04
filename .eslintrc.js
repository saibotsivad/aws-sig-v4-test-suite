module.exports = {
	'env': {
		'node': true,
		'es6': true
	},
	'parserOptions': {
		'ecmaVersion': 8,
		'sourceType': 'module'
	},
	'extends': 'eslint:recommended',
	'rules': {
		// for each rule, read more at http://eslint.org/docs/rules/RULE
		// e.g. http://eslint.org/docs/rules/indent
		'eqeqeq': [
			'error',
			'always'
		],
		'indent': [
			'error',
			'tab',
			{ SwitchCase: 1 }
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'eol-last': [
			'error',
			'always'
		],
		'no-return-await': 'error',
		'semi': [
			'error',
			'never'
		],
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-new': 'error',
		'no-unexpected-multiline': 'error',
		'no-unused-vars': [
			'error',
			{ 'args': 'none' }
		],
		'brace-style': [
			'error',
			'1tbs',
			{ 'allowSingleLine': true }
		],
		'key-spacing': [
			'error',
			{
				'beforeColon': false,
				'afterColon': true
			}
		],
		'valid-jsdoc': 'error'
	}
}
