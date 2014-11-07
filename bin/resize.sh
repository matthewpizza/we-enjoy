#!/bin/bash

# resize image
resize_image() {
	# resize to 500px with image magick
	# save to parent assets directory
	convert \
		$1 \
		-gravity center \
		-background white \
		-coalesce \
		-resize '500>x375>' \
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

	if [[ $file == *.gif* ]] ; then
		if [ `identify "$file" | wc -l` -gt 1 ] ; then
			# copy to parent assets directory
			cp $file ../$file
			resized=true
		fi
	fi

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