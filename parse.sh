#!/bin/sh

set -e
mkdir -p chat-data
node ./parser.js "$1" "$2" "$3"
python prepare.py
onmt-build-vocab --size 50000 --save_vocab chat-data/src-vocab.txt chat-data/src-train.txt
onmt-build-vocab --size 50000 --save_vocab chat-data/tgt-vocab.txt chat-data/tgt-train.txt
