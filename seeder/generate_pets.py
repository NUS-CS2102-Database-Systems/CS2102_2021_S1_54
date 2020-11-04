from random import randint

petOwnerNames = []

fd = open('pet_owners.sql', 'r')
sqlFile = fd.read()
fd.close()

# all SQL commands (split on ';')
sqlCommands = sqlFile.split(';')

for command in sqlCommands:
    try:
        splitString = '''insert into pet_owner
    (username, credit_card_number, credit_card_full_name, credit_card_expiry_date)
values
    ('''
        username = command.split(splitString)[1].split("'")[1]
        petOwnerNames.append(username)
    except:
        print("exception")

possiblePetNames = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"]
possibleCategories = ["big dog", "bird", "cat", "rodent", "rabbit", "small dog"]
possibleGenders = ['M', 'M', 'M', 'F', 'F', 'F', 'O']
possibleMedHist = ["none", "stomach irritation", "allergy to dust", "allergy to milk", "none", "none", "none", "none"]
possibleSpecialReq = ["none", "none", "none", "minced meat only", "no chocolate", "no milk", "must play outdoors for 2 hours", "cannot interact with opposite gender", "cannot drink too much water", "has to drink more water", "no noisy environment"]

# CREATE TABLE pet (
# 	username VARCHAR NOT NULL REFERENCES pet_owner(username) ON DELETE cascade,
# 	pet_name VARCHAR NOT NULL,
# 	birth_date DATE NOT NULL,
# 	breed VARCHAR NOT NULL,
# 	type_of_animal VARCHAR NOT NULL REFERENCES animal_type(type_name),
# 	gender VARCHAR NOT NULL, 
# 	med_hist VARCHAR NOT NULL,
# 	special_req VARCHAR NOT NULL,
# 	PRIMARY KEY (username, pet_name)
# );

f = open("pets.sql", "a")
for i in range(len(petOwnerNames)):
    username = petOwnerNames[i]
    petName = possiblePetNames[randint(0, len(possiblePetNames) - 1)]
    birthDate = f'2019-{randint(1, 12)}-{randint(1, 28)}'
    breed = f'Breed no. {randint(1, 20)}'
    animalType = possibleCategories[randint(0, len(possibleCategories) - 1)]
    gender = possibleGenders[randint(0, 2)]
    medHist = possibleMedHist[randint(0, len(possibleMedHist) - 1)]
    specialReq = possibleSpecialReq[randint(0, len(possibleSpecialReq) - 1)]

    f.write(f"INSERT INTO pet VALUES ('{username}', '{petName}','{birthDate}', '{breed}', '{animalType}', '{gender}', '{medHist}', '{specialReq}');\n")

f.close()