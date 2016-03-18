var fs = require('fs'),
	path = require('path'),
	moment = require('moment'),
	yaml = require('yaml-front-matter'),
	config = {
		twitter: require('../_twitter.json'),
		tumblr: require('../_tumblr.json')
	},
	tumblrjs = require('tumblr.js'),
	tumblr = tumblrjs.createClient(config.tumblr),

	title = moment().format('dddd, MMMM D, YYYY'),
	filename = moment().format('YYYY-MM-DD-dddd').toLowerCase() + '.md',
	permalink = 'http://we-enjoy.us/' + moment().format('YYYY/MM/DD/dddd/').toLowerCase(),

	paths = {
		images: path.normalize(__dirname + '/../assets'),
		posts: path.normalize(__dirname + '/../_posts')
	}
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

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
		tumblr: {
			caption: post.__content,
			format: 'markdown',
			tweet: 'off',
			data: paths.images + '/' + post.photo,
		}
	};

	fs.exists(paths.images + '/' + post.photo, function(exists) {
		if (! exists) return console.error(post.photo + ' doesn’t exist.');

		tumblr.photo('we-enjoy', options.tumblr, function(err, resp) {
			if (err) return console.log('(╯°□°）╯︵ ┻━┻  Tumblr \n' + err.message);
			console.log('ヽ(^o^)ノ Tumblr');
		});
	});
}
