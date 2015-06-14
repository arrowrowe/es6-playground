#!/usr/bin/env bash
COLOR_DEFAULT='\033[1;34m'
COLOR_FILE='\033[0;37m'
COLOR_NO='\033[0m'

sourceFile=$1
outputFile=out/$sourceFile

echo ${COLOR_DEFAULT}Transpiling ${COLOR_FILE}${sourceFile}${COLOR_DEFAULT} to ${COLOR_FILE}${outputFile}${COLOR_DEFAULT}...
traceur $sourceFile --out $outputFile
echo Transpiled.

echo Calling Node...
echo =======================${COLOR_NO}
node try.js $outputFile
echo ${COLOR_DEFAULT}=======================
echo End.

