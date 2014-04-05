#!/bin/bash

# Github
commit_message=$(date +"%A, %B %e, %Y")
git add -A
git commit -am "$commit_message"
git pull
git push origin master

# Tumblr