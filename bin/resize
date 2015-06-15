#!/bin/bash

# resize image
resize_image() {
	# resize to 2:1 (max: 800x400px) with image magick
	# save to parent assets directory
	size_w='%[fx: w ]'
	size_h='%[fx: w/2 ]'
	offset_x='%[fx: 0 ]'
	offset_y='%[fx: (h/2)-(w/4) ]'
	viewport="${size_w}x${size_h}+${offset_x}+${offset_y}"

	convert \
		$1 \
		-set option:distort:viewport "$viewport" \
		-filter point \
		-distort SRT 0 \
		+repage \
		-resize 800x400\> \
		../$1
}

echo "Resize new images"
sleep 0.5

# where are we
pushd `dirname $0` > /dev/null
	DIR=`pwd`
popd > /dev/null

# cd original assets directory
cd "$DIR"/../assets/_

# Set $IFS variable for filenames with spaces
# http://www.cyberciti.biz/tips/handling-filenames-with-spaces-in-bash.html
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

# find file modified today
# --[cached|deleted|others|ignored|stage|unmerged|killed|modified]
for file in $(git ls-files --others . | grep -E ".gif|.png|.jpg|.jpeg"); do
	resized=false
	echo $file

	# if [[ $file == *.gif* ]] ; then
	# 	if [ `identify "$file" | wc -l` -gt 1 ] ; then
	# 		# copy to parent assets directory
	# 		cp $file ../$file
	# 		resized=true
	# 	fi
	# fi

	if [ "$resized" = false ] ; then
		resize_image $file
	fi

	# if cli imageOptim is installed
	# https://github.com/JamieMason/ImageOptim-CLI
	# if [ "$(type -t imageOptim)" = "file" ]; then
	# 	find ../$file | imageOptim --quit
	# else
	# 	/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../$file
	# fi

	# Async
	open -a ImageOptim ../$file
done

# restore
IFS=$SAVEIFS

cd ../..