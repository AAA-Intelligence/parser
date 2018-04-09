import math
import random
from os import path
import nltk
import emoji

print('Downloading PUNKT model...')
nltk.download('punkt')

print('Normalizing and splitting data...')

color_emojis = [
    '🏻',
    '🏼',
    '🏽',
    '🏾',
    '🏿'
]


def normalize_emojis(text):
    return ''.join([c if c not in emoji.UNICODE_EMOJI or c in color_emojis else ' ' + c for c in text]).replace('  ', ' ')


def normalize(text):
    return ' '.join(nltk.word_tokenize(normalize_emojis(text), language='german'))


def write_data(data, name):
    with open(path.join('export', name + '.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(data))


src_train = []
tgt_train = []

with open('export/chat.txt', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i % 2 == 0:
            src_train.append(normalize(line))
        else:
            tgt_train.append(normalize(line))

i_max = len(src_train)
src_val = []
tgt_val = []

for _ in range(math.floor(i_max * 0.2)):
    i = random.randint(0, i_max)
    src_val.append(src_train[i])
    del src_train[i]
    tgt_val.append(tgt_train[i])
    del tgt_train[i]
    i_max -= 1

write_data(src_train, 'src-train')
write_data(src_val, 'src-val')
write_data(tgt_train, 'tgt-train')
write_data(tgt_val, 'tgt-val')
