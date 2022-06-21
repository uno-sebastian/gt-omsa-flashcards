import os
import re
import sys

def print_entry(question, answer, answer_type):
    entry = '    {'
    entry += '"Frage":"' + question + '"'
    entry += ', "Antwort":"' + answer + '"'
    if answer_type != None:
        entry += ', "answer_class":"' + answer_type + '"'
    entry += '},'

    print(entry)


infile_name = "words.csv"

#print("genders = [\n")

with open(infile_name) as infile:

    while True:
        line = infile.readline()
        if not line:
            break

        line = line.strip()

        # remove any fields after the first
        line = re.sub(r'[\t.,].*', '', line)

        if '(pl)' in line or '(pl.)' in line:
            continue;

        gender = None;
        if line.startswith('der '):
            gender = 'masc'
        elif line.startswith('die '):
            gender = 'fem'
        elif line.startswith('das '):
            gender = 'neut'

        if gender != None:
            print_entry(line[4:], line, gender)

#print("];")
