#!/bin/bash

for file in *.markdown; do
	mv "$file" "`basename $file .markdown`.md"
done