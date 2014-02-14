#!/bin/bash

echo "Resize new images"

# cd original assets directory
cd assets/_

# find file modified today
for f in $(find . -type f -newermt $(date +"%Y-%m-%d") \( -iname \*.png -o -iname \*.jpg -o -iname \*.jpeg -o -iname \*.gif \)); do
	echo $f

	# copy to parent assets directory
	cp $f ../$f

	# get image width
	w=$( mdls "$f" | grep kMDItemPixelWidth | tail -n1 | cut -d= -f2 )

	echo $w

	# if larger than 500px wide
	if (("$w" > 500)); then
		# resize the copied file to 500px wide
		sips --resampleWidth 500 ../$f
	fi
	
	# if cli imageOptim is installed
	# https://github.com/JamieMason/ImageOptim-CLI
	# if [ "$(type -t imageOptim)" = "file" ]; then
		# imageOptim --jpeg-mini --image-alpha --quit --directory ../$f
	# fi
	open -a ImageOptim ../$f
done

cd ../..