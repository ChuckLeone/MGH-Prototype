#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//
var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

function generate_version(base_string, target_env) {
	var date = new Date();
	// the first replace removes .123Z from the end of the timestamp
	// the second removes dashes, colons and the letters
	// so we get a clean numeric build date that is traceable
	var build_number = date.toJSON().replace(/\.\w+$/, '').replace(/[-:.A-Z]/g, '');
	return base_string + '-' + build_number + '-' + target_env;
}

var target = "dev";
if (process.env.TARGET) {
    target = process.env.TARGET;
}

if (rootdir) {
    var ourconfigfile = path.join(rootdir, "ionic.project");
    var configobj = JSON.parse(fs.readFileSync(ourconfigfile, 'utf8'));
	var version = generate_version(configobj.base_version, target);

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
                "/\\*REP\\*/ VERSION /\\*REP\\*/",
                version);
        } else {
            //console.log("missing: "+fullfilename);
        }
    });

}
