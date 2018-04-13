mkdir -p chat-data
node .\parser.js $args[0] $args[1] $args[2]
python .\prepare.py
onmt-build-vocab --size 50000 --save_vocab chat-data\src-vocab.txt chat-data\src-train.txt
onmt-build-vocab --size 50000 --save_vocab chat-data\tgt-vocab.txt chat-data\tgt-train.txt
