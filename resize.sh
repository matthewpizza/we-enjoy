#!/bin/bash

# cd original assets directory
cd assets/_

# find file modified today
for f in $(find . -type f -newermt $(date +"%Y-%m-%d")); do
	echo $f

	# copy to parent assets directory
	cp $f ../$f

	# resize the copied file to 500px wide
	sips --resampleWidth 500 ../$f
	
	# if cli imageOptim is installed
	# https://github.com/JamieMason/ImageOptim-CLI
	# if [ "$(type -t imageOptim)" = "file" ]; then
	# 	imageOptim --jpeg-mini --image-alpha --quit --directory ../$f
	# fi
	open -a ImageOptim ../$f
done

cd ../..