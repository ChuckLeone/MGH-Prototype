#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

var target = "dev";
if (process.env.TARGET) {
    target = process.env.TARGET;
}

module.exports = function() {
	if (rootdir) {
		// CONFIGURE HERE
		// with the names of the files that contain tokens you want
		// replaced.  Replace files that have been copied via the prepare step.
		var filestoreplace = [
			"config.xml",
		];
		filestoreplace.forEach(function(val, index, array) {
			var fullfilename = path.join(rootdir, val);
			if (fs.existsSync(fullfilename)) {

				replace_string_in_file(fullfilename,
					"[0-9]+\.[0-9]+\.[0-9]+-[0-9]+-dev|integration|staging",
					"/\*REP\*/ VERSION /\*REP\*/");
			} else {
				//console.log("missing: "+fullfilename);
			}
		});

	}
}
