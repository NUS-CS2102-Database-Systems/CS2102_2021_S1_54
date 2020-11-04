fd = open('part_time_caretaker.sql', 'r')
sqlFile = fd.read()
fd.close()

partTimeCaretakerNames = []

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

# generate availabilites
	# username VARCHAR REFERENCES part_time_caretaker(username),
	# start_date DATE NOT NULL,
    # end_date DATE NOT NULL,
	# number_of_pets_allowed INTEGER NOT NULL ,

possible_periods = [
    ("2020-01-01", "2020-01-31"),
    ("2020-02-01", "2020-02-29"),
    ("2020-03-01", "2020-03-31"),
    ("2020-04-01", "2020-04-30"),
    ("2020-05-01", "2020-05-31"),
    ("2020-06-01", "2020-06-30"),
    ("2020-07-01", "2020-07-31"),
    ("2020-08-01", "2020-08-31"),
    ("2020-09-01", "2020-09-30"),
    ("2020-10-01", "2020-10-31"),
    ("2020-11-01", "2020-11-30"),
    ("2020-12-01", "2020-12-31")
]

f = open("availabilities.sql", "a")
for i in range(len(partTimeCaretakerNames)):
    username = partTimeCaretakerNames[i]
    month = i % 12
    startDate = possible_periods[month][0]
    endDate = possible_periods[month][1]
    f.write(f"INSERT INTO availabilities VALUES ('{username}', '{startDate}', '{endDate}', 2);\n")

f.close()
