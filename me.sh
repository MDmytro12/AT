#!/usr/bin/env bash

echo "$(mkdir db)";

ARRAY_OF_NAMES=("auth" "results" "exam-results" "categories" "all-questions");

for ((i=1;i<=39;i++)) ;
	do 
		ARRAY_OF_NAMES+=("R${i}")	
	done

ARRAY_OF_NAMES+=("R48")
ARRAY_OF_NAMES+=("R49")
ARRAY_OF_NAMES+=("R50")

for name in "${ARRAY_OF_NAMES[@]}";
	do
		echo "$(mongoexport --db=at --collection=${name} --out=./db/${name}.json)" 
	done