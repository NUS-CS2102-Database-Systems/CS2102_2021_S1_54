from random import randint

fulltimeCaretakerNames = []
partTimeCaretakerNames = []

animal_type = [
    'big dog',
    'bird',
    'cat',
    'rodent',
    'rabbit',
    'small dog'
]

fd = open('full_time_caretaker.sql', 'r')
sqlFile = fd.read()
fd.close()

# all SQL commands (split on ';')
sqlCommands = sqlFile.split(';')

for command in sqlCommands:
    try:
        splitString = '''insert into full_time_caretaker
    (username)
values
    ('''
        username = command.split(splitString)[1].split("'")[1]
        fulltimeCaretakerNames.append(username)
    except:
        print("exception")


fd = open('part_time_caretaker.sql', 'r')
sqlFile = fd.read()
fd.close()
# all SQL commands (split on ';')
sqlCommands = sqlFile.split(';')

for command in sqlCommands:
    try:
        splitString = '''insert into part_time_caretaker
    (username)
values
    ('''
        username = command.split(splitString)[1].split("'")[1]
        partTimeCaretakerNames.append(username)
    except:
        print("exception")


f = open("can_take_care.sql", "a")
# from part time caretakers
for i in range(0, len(fulltimeCaretakerNames)):
    username = fulltimeCaretakerNames[i]
    numberOfPetTypes = randint(0, len(animal_type))
    availablePetTypesIndex = [0, 1, 2, 3, 4, 5]

    for j in range(0, numberOfPetTypes):
        selectedIndex = availablePetTypesIndex[randint(0, len(availablePetTypesIndex)-1)]
        type_name = animal_type[selectedIndex]
        availablePetTypesIndex.remove(selectedIndex)

        f.write(f"INSERT INTO can_take_care VALUES ('{username}', '{type_name}');\n")

# from full time caretakers
for i in range(0, len(partTimeCaretakerNames)):
    username = partTimeCaretakerNames[i]
    numberOfPetTypes = randint(0, len(animal_type))
    availablePetTypesIndex = [0, 1, 2, 3, 4, 5]

    for j in range(0, numberOfPetTypes):
        selectedIndex = availablePetTypesIndex[randint(0, len(availablePetTypesIndex)-1)]
        type_name = animal_type[selectedIndex]
        availablePetTypesIndex.remove(selectedIndex)

        f.write(f"INSERT INTO can_take_care VALUES ('{username}', '{type_name}');\n")
    
f.close()


# INSERT INTO animal_type VALUES ('big dog');
# INSERT INTO animal_type VALUES ('bird');
# INSERT INTO animal_type VALUES ('cat');
# INSERT INTO animal_type VALUES ('rodent');
# INSERT INTO animal_type VALUES ('rabbit');
# INSERT INTO animal_type VALUES ('small dog');