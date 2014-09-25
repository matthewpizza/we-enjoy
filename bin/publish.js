var fs = require('fs'),
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
	});
}
