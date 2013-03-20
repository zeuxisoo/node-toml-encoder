function TOMLEncoder() {
}

TOMLEncoder.prototype.encode = function(toml) {
	if (this.isObject(toml) === false) {
		throw new Error("Encode data must JSON object");
	}

	var temp = [];
	for(var key in toml) {
		temp.push(this.process(key, toml[key]));
	}

	return temp.join('');
}

TOMLEncoder.prototype.process = function(key, value, parentKey) {
	var temp = [];

	if (this.isObject(value) === true) {
		if (this.isAssoc(value) === true) {
			temp.push(key + " = [" + this.implodeArray(",", value) + "] \n");
		}else{
			if (parentKey) {
				key = parentKey + "." + key;
			}
			temp.push("[" + key + "] \n");
			for(var k in value) {
				temp.push(this.process(k, value[k], key));
			}
		}
	}else{
		var value = this.processValue(value);

		temp.push(key + " = " + value + " \n");
	}

	return temp.join('');
}

TOMLEncoder.prototype.implodeArray = function(spliter, array) {
	var i = 0, temp = [];

	while(i < array.length) {
		var value = array[i];

		if (this.isObject(value) === true) {
			temp.push("[" + this.implodeArray(",", value) + "]");
		}else{
			value = this.processValue(value);
			temp.push(value);
		}

		if (i != array.length - 1) {
			temp.push(",");
		}

		i++;
	}

	return temp.join('');
}

TOMLEncoder.prototype.processValue = function(value) {
	if (this.isISODate(value) === true) {

	}else if (this.isString(value) === true) {
		value = this.processString(value);
	}else if (this.isBoolean(value)) {
		if (value)
			value = "true";
		else
			value = "false"
	}

	return value;
}

TOMLEncoder.prototype.processString = function(value) {
	var searchPattern = ["\0", "\t", "\n", "\r", '"', "\\\\"],
		replacePattern = ['\\0', '\\t', '\\n', '\\r', '\"', '\\'];

	for(var i=0; i<searchPattern.length; i++) {
		value = value.replace(new RegExp(searchPattern[i], "gi"), replacePattern[i]);
	}

	value = '"' + value + '"';

	return value;
}

TOMLEncoder.prototype.isObject = function(object) {
	return (typeof object === "object")
}

TOMLEncoder.prototype.isAssoc = function(array) {
	var self = this;

	return Object.keys(array).filter(function(value) {
		return (self.isString(value) === true && isNaN(value) === true);
	}).length === 0;
}

TOMLEncoder.prototype.isString = function(value) {
	return (typeof value == "string");
}

TOMLEncoder.prototype.isISODate = function(value) {
	return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
}

TOMLEncoder.prototype.isBoolean = function(value) {
	return (typeof value == "boolean");
}

TOMLEncoder.prototype.objectKeys = function(object) {
	var keys = [];
	for(var i in object) {
		if (object.hasOwnProperty(i) === true) {
			keys.push(i);
		}
	}
	return keys;
}

module.exports = TOMLEncoder;
