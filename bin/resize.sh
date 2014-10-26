#!/bin/bash

# function exists check
is_function() {
    declare -f -F $1 > /dev/null
    return $?
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
	echo $file
	# echo ${file##./}

	# copy to parent assets directory
	# cp $file ../$file

	# get image width
	# w=$( mdls "$file" | grep kMDItemPixelWidth | tail -n1 | cut -d= -f2 )

	# if larger than 500px wide
	# if (("$w" > 500)); then
		# sips is super lossy
		# sips --resampleWidth 500 ../$file
	# fi

	# resize to 500px with image magick
	# save to parent assets directory
	convert \
		$file \
		-gravity center \
		-background white \
		-coalesce \
		-resize 500x375\> \
		-extent 500x375 \
		../$file

	# if cli imageOptim is installed
	# https://github.com/JamieMason/ImageOptim-CLI
	if [ "$(type -t imageOptim)" = "file" ]; then
		find ../$file | imageOptim --quit
	else
		/Applications/ImageOptim.app/Contents/MacOS/ImageOptim ../$file
	fi
done

# restore
IFS=$SAVEIFS

cd ../..