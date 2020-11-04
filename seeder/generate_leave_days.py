import random

fd = open('full_time_caretaker.sql', 'r')
sqlFile = fd.read()
fd.close()

fullTimeCaretakerNames = []

# all SQL commands (split on ';')
sqlCommands = sqlFile.split(';')

for command in sqlCommands:
    try:
        splitString = '''insert into full_time_caretaker
    (username)
values
    ('''
        username = command.split(splitString)[1].split("'")[1]
        fullTimeCaretakerNames.append(username)
    except:
        print("exception")

# generate leave_days
	# username VARCHAR NOT NULL REFERENCES full_time_caretaker(username),
	# reason_for_leave VARCHAR NOT NULL,
	# start_date DATE NOT NULL,
	# end_date DATE NOT NULL,

possible_periods = [
    ("2020-01-01", "2020-01-31"),
    ("2020-06-29", "2020-07-01"),
    ("2020-12-01", "2020-12-31")
]

possible_reasons = [
    "sick",
    "vacation",
    "training"
]

f = open("leave_days.sql", "a")
for i in range(len(fullTimeCaretakerNames)):
    username = fullTimeCaretakerNames[i]
    period = i % 3
    startDate = possible_periods[period][0]
    endDate = possible_periods[period][1]
    reason = possible_reasons[random.randint(0,2)]
    f.write(f"INSERT INTO leave_days VALUES ('{username}', '{reason}','{startDate}', '{endDate}');\n")

f.close()
