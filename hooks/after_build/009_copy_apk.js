#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

if(rootdir) {
	var file = path.join(rootdir, "config.xml");
	var data = fs.readFileSync(file, 'utf8');
	var version = data.match("[0-9]+\.[0-9]+\.[0-9]+-[0-9]+-dev|integration|staging")[0];
	var final_apk_name = "MyGovHub-" + version + ".apk";
	var apk_name = "CordovaApp-debug.apk";
	var built_apk = path.join(rootdir, "platforms/android/ant-build/", apk_name);
	var copy_apk = path.join(rootdir, "platforms/android/ant-build/", final_apk_name);
	fs.createReadStream(built_apk).pipe(fs.createWriteStream(copy_apk));
}
