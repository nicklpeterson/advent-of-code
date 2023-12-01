#!/bin/sh
source .env

YEAR=""
DAY=""

usage() { 
    echo "Usage: $0 [--year, -y <year>] [--day, -d <day>]" 1>&2; 
    exit 1; 
}

# transform long options to short ones
for arg in "$@"; do
  shift
  case "$arg" in
    '--year') set -- "$@" '-y'   ;;
    '--day')  set -- "$@" '-d'   ;;
    *)        set -- "$@" "$arg" ;;
  esac
done

# parse short options
OPTIND=1
while getopts 'y:d:' opt; do
    case $opt in
        y) YEAR=$OPTARG ;;
        d) DAY=$OPTARG     ;;
        *) usage           ;;
    esac
done

# remove options from positional parameters
shift $(expr $OPTIND - 1)
 
# exit if args are empty
if [ -z "${YEAR}" ] || 
   [ -z "${DAY}" ]
then 
    usage
fi

INPUT=$(curl --cookie "session=${ADVENT_OF_CODE_SESSION}" "https://adventofcode.com/${YEAR}/day/${DAY}/input")

# echo $INPUT
node $YEAR/$DAY.js $INPUT