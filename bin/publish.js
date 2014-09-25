var fs = require('fs'),
	exec = require('child_process').exec,
	moment = require('moment'),
	yaml = require('yaml-front-matter'),
	tumblr = require('tumblr.js'),
	config = require('../_tumblr.json'),
	client = tumblr.createClient(config),

	paths = {
		images: __dirname + '/../assets',
		posts: __dirname + '/../_posts'
	}
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var filename = moment().format('YYYY-MM-DD-dddd').toLowerCase() + '.md'
;

fs.exists(paths.posts + '/' + filename, function(exists) {
	if (! exists) return console.error(filename + ' doesn’t exist.');

	fs.readFile(paths.posts + '/' + filename, 'utf-8', function(err, data) {
		if (err) return console.error(err);

		publish_post( yaml.loadFront(data) );
	});
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function publish_post( post ) {
	var options = {
		caption: post.__content,
		format: 'markdown',
		tweet: moment().format('dddd, MMMM D, YYYY'),
		data: paths.images + '/' + post.photo,
	};

	fs.exists(paths.images + '/' + post.photo, function(exists) {
		if (! exists) return console.error(post.photo + ' doesn’t exist.');

		client.photo('we-enjoy', options, function(err, resp) {
			if (err) console.log(err.message);
		});

		push_changes();
	});
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function push_changes() {
	var commit_message = moment().format('dddd, MMMM D, YYYY')
	;

	console.log(commit_message);

	exec('cd ../', function(error, stdout, stderr) {
		if (error) return console.log(error);
		if (stdout) return console.log(stdout);
		if (stderr) return console.log(stderr);
	});
	exec('git add -A', function(error, stdout, stderr) {
		if (error) return console.log(error);
		if (stdout) return console.log(stdout);
		if (stderr) return console.log(stderr);
	});
	exec('git commit -am "' + commit_message + '"', function(error, stdout, stderr) {
		if (error) return console.log(error);
		if (stdout) return console.log(stdout);
		if (stderr) return console.log(stderr);
	});
	exec('git pull', function(error, stdout, stderr) {
		if (error) return console.log(error);
		if (stdout) return console.log(stdout);
		if (stderr) return console.log(stderr);
	});
	exec('git push origin master', function(error, stdout, stderr) {
		if (error) return console.log(error);
		if (stdout) return console.log(stdout);
		if (stderr) return console.log(stderr);
	});
}