'use strict';

function isAlpha(string = '') {
	return /[a-zA-Z]/.test(string);
}

function isNum(string = '') {
	return /\d/.test(string);
}

function isUpper(string = '') {
	return string.toUpperCase() === string;
}

function isLower(string = '') {
	return string.toLowerCase() === string;
}

function isUpperAlpha(string) {
	return isAlpha(string) && isUpper(string);
}

function isLowerAlpha(string) {
	return isAlpha(string) && isLower(string);
}

function trim(string) {
	return string.replace(/^[_.\- ]+/, '');
}

function capitalize(string) {
	return string.substring(0, 1).toUpperCase() + string.substring(1);
}

function getNextWord(string) {
	const split = string.split(/[_.\- ]+/)[0];

	let retval = '';
	let lastWasUpperAlpha = true;
	for (let c = 0; c < split.length; c++) {
		const character = split[c];
		if (isUpperAlpha(character)) {
			if (!lastWasUpperAlpha) {
				return retval;
			}

			lastWasUpperAlpha = true;
		} else {
			if (isLowerAlpha(character)) {
				if (lastWasUpperAlpha && c > 1) {
					return retval.substring(0, retval.length - 1);
				}
			} else if (isNum(character)) {
				return retval + character;
			}

			lastWasUpperAlpha = false;
		}

		retval += character;
	}

	return retval;
}

const toCamelCase = (string, pascalCase, abbreviations) => {
	let retval = '';
	let isFirstWord = true;
	let i = 0;
	while (string.length > 0 && i < 10) {
		string = trim(string);
		let nextWord = getNextWord(string);
		if ((!isUpper(nextWord) || !abbreviations || (isFirstWord && !pascalCase))) {
			nextWord = nextWord.toLowerCase();
		}

		if (!isFirstWord || pascalCase) {
			retval += capitalize(nextWord);
		} else {
			retval += nextWord;
		}

		isFirstWord = false;
		string = string.substring(nextWord.length);
		i++;
	}

	return retval;
};

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = Object.assign({
		pascalCase: false,
		abbreviations: false
	}, options);

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
	}

	return toCamelCase(input, options.pascalCase, options.abbreviations);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;
