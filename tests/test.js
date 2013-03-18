var TOMLEncoder = require('../TOMLEncoder');

var testData = {
	'a': 1,
	'b': [1, 2, 3],
	'c': {
		'a': 'apple',
		'b': [4, 5, 6],
		'c': "C\\Windows\\etc\\host",

		'd': "\0",
		'e': "\t",
		'f': "\n",
		'g': "\r",
		'h': "'",
		'i': "\\",
	},
	'd': true
};

toml = new TOMLEncoder()
data = toml.encode(testData);

console.log(data);
