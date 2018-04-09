#!/bin/sh

set -e
node ./parser.js $@
python prepare.py