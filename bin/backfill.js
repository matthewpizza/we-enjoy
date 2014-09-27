var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	events = require('events'),
	emitter = new events.EventEmitter(),
	moment = require('moment'),
	DrSax = require('dr-sax'),
	drsax = new DrSax(),
	tumblr = require('tumblr.js'),
	config = require('../_tumblr.json'),
	client = tumblr.createClient(config),

	paths = {
		images: __dirname + '/../assets',
		posts: __dirname + '/../_posts'
	}
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

client.blogInfo('we-enjoy', function(error, response) {
	if (error) return console.log(error);
	emitter.emit('total', response.blog.posts);
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

emitter.once('total', function(total) {
	var options = {},
		stuff = [],
		broken = false,
		i = 0
	;

	while (total >= 0 && ! broken) {
		options = {
			limit: 20,
			offset: 20 * i
		};

		client.posts('we-enjoy', options, function(error, response) {
			if (error) {
				broken = true;
				return console.log(error);
			}
			emitter.emit('havePosts', response.posts);
		});

		total = total - 20;
		i++;
	}

});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

emitter.on('havePosts', function(posts) {

	posts.forEach(function(post, index, all) {
		var filename = moment(new Date(post.date)).format('YYYY-MM-DD-dddd').toLowerCase() + '.md'
		;

		fs.exists(paths.posts + '/' + filename, function(exists) {
			if (exists) return;

			emitter.emit('createPost', filename, post);
		});
	});

});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

emitter.on('createPost', function(filename, post) {

	var url, image;

	switch (post.type) {
		case 'text':
			save_post(post, filename, post.type, false);
		break;
		case 'photo':
			url = post.photos[0].original_size.url;
			image = image_filename(url);

			save_image(url, image);
			save_post(post, filename, post.type, image);
		break;
		case 'audio':
			save_post(post, filename, post.type, false);
		break;
		case 'video':
			if (typeof post.permalink_url !== 'undefined') {

				if (is_vimeo(post.permalink_url)) {
					url = vimeo_image(post.permalink_url);
					image = image_filename(url);
				}
				else if (is_youtube(post.permalink_url)) {
					url = youtube_image(post.permalink_url);

					if (url !== false) {
						image = youtube_filename(post.permalink_url);
					}
				}

			}
			else if (typeof post.thumbnail_url !== 'undefined') {
				url = post.thumbnail_url;
				image = image_filename(url);
			}
			else {
				url = false;
				image = false;
			}


			if (url && image) {
				save_image(url, image);
				save_post(post, filename, 'photo', image);
			}

			/*if ( ! url && ! image ) {
				save_post(post, filename, post.type, image);
			}
			else {
				save_image(url, image);
				save_post(post, filename, 'photo', image);
			}*/
		break;
	}

});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function save_post(post, filename, type, image) {

	var content = '',
		date = moment(new Date(post.date)),
		title = date.format('dddd, MMMM D, YYYY'),
		timestamp = date.format('YYYY-MM-DD HH:mm:ss'),
		formatted_content = post.type === 'text' ? drsax.write(post.body) : drsax.write(post.caption),
		source = false
	;

	source = typeof post.permalink_url !== 'undefined' ? post.permalink_url : source;
	source = ! source && typeof post.video_url !== 'undefined' ? post.video_url : source;
	source = ! source ? '' : source;

	content += '---\n';
	content += 'layout: ' + post.type + '\n';
	content += 'title: ' + title + '\n';
	content += 'date: ' + timestamp + '\n\n';
	content += 'photo: ' + image + '\n';
	content += 'alt:\n';
	content += 'source: ' + source + '\n';
	content += '---\n\n';
	content += remove_entities(formatted_content);

	fs.writeFile(paths.posts + '/' + filename, content, function (error) {
		if (error) return console.log(error);

		console.log(filename + ' was created.');
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function save_image(url, filename) {

	var remote = url.indexOf('https://') > -1 ? https : http;

	remote.get(url, function(response) {

		var imagedata = ''
		;

		response.setEncoding('binary');

		response.on('data', function(chunk) {
			imagedata += chunk;
		});

		response.on('end', function() {
			fs.writeFile(paths.images + '/_/' + filename, imagedata, 'binary', function(error){
				if (error) {
					console.log(filename);
					console.log(error);
					return;
				}

				console.log(filename + ' was saved.');
			});
		});

	}).on('error', function(error) {
		console.log(filename);
		console.log(error);
	});

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function image_filename(url) {
	return url.substring( url.lastIndexOf('/') + 1 );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function remove_entities(str) {
	var find = [
			'&#8220;',
			'&#8221;',
			'&#8216;',
			'&#8217;',
			'&#8230;',
			'&amp;'
		],
		replace = [
			'“',
			'”',
			'‘',
			'’',
			'…',
			'&'
		]
	;

	for (var i = 0; i < find.length; i++) {
		str = str.replace(find[i], replace[i]);
	}

	return str;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function vimeo_image(video) {

	var videoID = video.substring( video.lastIndexOf('/') + 1 )
	;

	return 'https://i.vimeocdn.com/video/' + videoID + '_1280x720.jpg';

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function is_vimeo(url) {
	return url.indexOf('vimeo.com') > -1;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function youtube_image(video) {

	var videoID = youtube_id(video);

	if (! videoID) {
		return false;
	}

	return 'https://img.youtube.com/vi/' + videoID + '/maxresdefault.jpg';

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function youtube_id(video) {

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
		match = video.match(regExp)
	;

	if (match && match[2].length == 11) {
		return match[2];
	}

	return false;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function is_youtube(url) {
	if ( url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1 ) {
		return true;
	}
	return false;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function youtube_filename(video) {
	return youtube_id(video) + '.jpg';
}