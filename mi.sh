#!/usr/bin/env bash
ARRAY_CLLECTIONS_NAME=()

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 48 49 50 ;
	do 
		ARRAY_CLLECTIONS_NAME+=("R${i}")
	done

ARRAY_CLLECTIONS_NAME+=("all-questions")
ARRAY_CLLECTIONS_NAME+=("auth")
ARRAY_CLLECTIONS_NAME+=("exam-results")
ARRAY_CLLECTIONS_NAME+=("categories")
ARRAY_CLLECTIONS_NAME+=("results")

for name in "${ARRAY_CLLECTIONS_NAME[@]}" ;
	do
		printf "$(mongoimport -d at_test -c $name --type json --file ./db/$name.json)"
	done