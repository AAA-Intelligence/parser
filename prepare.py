import math
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


src = []
tgt = []

with open('export/chat.txt', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i % 2 == 0:
            src.append(normalize(line))
        else:
            tgt.append(normalize(line))

i = math.floor(len(src) * 0.8)
src_train = src[:i]
src_val = src[i:]
tgt_train = tgt[:i]
tgt_val = tgt[i:]

write_data(src_train, 'src-train')
write_data(src_val, 'src-val')
write_data(tgt_train, 'tgt-train')
write_data(tgt_val, 'tgt-val')
