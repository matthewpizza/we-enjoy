#!/bin/bash

# welcome
echo "We Enjoy"

# where are we
pushd `dirname $0` > /dev/null
	DIR=$(dirname `pwd`)
popd > /dev/null

# filename, today, example 2013-11-13-wednesday
post_file="$DIR"/_posts/$(date +"%Y-%m-%d-%A").md

# lowercase string, date function returns first upper
post_file="$(tr [A-Z] [a-z] <<< "$post_file")"

# does the file already exist?
if [ -f $post_file ]
	then
	# yup
	echo "$post_file exists"
	subl $post_file
	exit
else
	# nope, create file
	touch $post_file || exit
	echo "created $post_file"
fi

title=$(date +"%A, %B %e, %Y")
date=$(date +"%Y-%m-%d %T")

cat <<EOF >> $post_file
---
layout: photo
title: $title
date: $date

photo:
alt:
source:
---
EOF

subl $post_file