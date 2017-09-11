var fs = require('fs');
var path = require('path');
var moment = require('moment');
var yaml = require('yaml-front-matter');
var tumblr = require('tumblr.js').createClient(require('../_tumblr.json'));

var filename = `${moment().format('YYYY-MM-DD-dddd').toLowerCase()}.md`;
var projectRoot = path.resolve(__dirname, '..');
var paths = {
  images: path.normalize(`${projectRoot}/assets`),
  posts : path.normalize(`${projectRoot}/_posts`)
};

fs.exists(`${paths.posts}/${filename}`, function (exists) {
  if (!exists) {
    return console.error(`${filename} doesn’t exist.`);
  }

  fs.readFile(`${paths.posts}/${filename}`, 'utf-8', function (err, data) {
    if (err) {
      return console.error(err);
    }

    publish(yaml.loadFront(data));
  });
});

function publish(post) {
  fs.exists(`${paths.images}/${post.photo}`, function (exists) {
    if (!exists) {
      return console.error(`${post.photo} doesn’t exist.`);
    }

    tumblr.photo('we-enjoy', {
      caption: post.__content,
      format: 'markdown',
      tweet: 'off',
      data: `${paths.images}/${post.photo}`,
    }, function (err, resp) {
      if (err) {
        return console.error(`(╯°□°）╯︵ ┻━┻  Tumblr \n ${err.message}`);
      }

      console.log('ヽ(^o^)ノ Tumblr');
    });
  });
}
