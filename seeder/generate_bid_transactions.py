from random import randint

petOwnerNames = []

petNames = []

fulltimeCaretakerNames = []
partTimeCaretakerNames = []

good_reviews = [
    "Second time using this service. Dog happy. ",
    "We could not have selected better people to care for our pet, we had plenty of updates along the way and puppy had so much fun. We hope to use their services again soon! ",
    "very experienced with my dog. I have extended her work.",
    "They have done a great job! We can see that our puppy is very comfortable with them and they had a good time together :) ",
    "Very friendly and super helpful! Highly recommended!",
    "She was very friendly and nice!! Really love her service a lot give it a 10/10! would rebook it again in the future Thank you so much!",
    "Thanks for taking care of my pet!",
    "Really enjoyable experience:)",
    "She is very engaging with my dog and was able to minimise his anxiety. Will engage her again in future	",
    "Awesome! On time and went the extra mile. Thank you! "
]

average_reviews = [
    "The experience was OK. Would have been better if caretaker could be more gentle towards my pet.",
    "My pet was happy. But caretaker was a bit unresponsive on whatsapp.",
    "Caretaker was friendly but seemed to lack experience."
]

bad_reviews = [
    "Worst pet caretaker ever. I will not use this pet care service ever again.",
    "My pet was injured and they have not given a satisfactory explanation till now!!!",
    "Very rude attitude. Would not recommend anyone to choose this caretaker.",
    "I told the caretaker to feed my pet minced meat ONLY, but they fed him chocolate and now he is SICK:(",
    "No offense but you could have done a better job...",
    "Not the most professional caretaker. There is plenty of room for improvement.",
    "Not punctual. Unfriendly",
    "Very surprised how such an established organisation could hire such an unprofessional caretaker!",
    "Hmmmm guys please do NOT choose this person as the caretaker!",
    "My pet lost 5 pounds after just a few days. I cried the moment I saw how skinny he had become:("
]

possible_periods = [
    # jan
    ("2020-01-02 09:00", "2020-01-04 18:00"),
    ("2020-01-05 09:00", "2020-01-10 18:00"),
    ("2020-01-11 09:00", "2020-01-13 18:00"),
    ("2020-01-14 10:15", "2020-01-16 18:00"),
    ("2020-01-16 09:00", "2020-01-17 20:00"),
    ("2020-01-19 08:00", "2020-01-21 18:10"),
    ("2020-01-25 09:00", "2020-01-29 18:00"),
    # feb
    ("2020-02-02 09:00", "2020-02-04 18:00"),
    ("2020-02-05 11:00", "2020-02-10 21:00"),
    ("2020-02-11 11:00", "2020-02-13 17:00"),
    ("2020-02-14 09:00", "2020-02-16 18:00"),
    ("2020-02-16 08:30", "2020-02-17 19:00"),
    ("2020-02-19 08:00", "2020-02-21 18:00"),
    ("2020-02-25 09:00", "2020-02-28 18:20"),
    # mar
    ("2020-03-02 09:00", "2020-03-04 18:00"),
    ("2020-03-05 10:00", "2020-03-10 19:30"),
    ("2020-03-11 10:00", "2020-03-13 20:00"),
    ("2020-03-15 09:00", "2020-03-16 19:50"),
    ("2020-03-16 15:00", "2020-03-17 18:40"),
    ("2020-03-19 14:10", "2020-03-21 17:10"),
    ("2020-03-25 10:30", "2020-03-28 18:00"),
    # apr
    ("2020-04-02 10:00", "2020-04-04 18:20"),
    ("2020-04-05 09:00", "2020-04-10 19:00"),
    ("2020-04-11 11:00", "2020-04-13 16:30"),
    ("2020-04-14 11:00", "2020-04-16 17:40"),
    ("2020-04-16 09:00", "2020-04-17 18:20"),
    ("2020-04-19 13:00", "2020-04-21 19:10"),
    ("2020-04-25 09:00", "2020-04-28 18:00"),
    # may
    ("2020-05-02 10:10", "2020-05-04 16:00"),
    ("2020-05-05 09:00", "2020-05-10 18:10"),
    ("2020-05-11 11:50", "2020-05-13 17:50"),
    ("2020-05-14 11:00", "2020-05-16 17:00"),
    ("2020-05-16 09:40", "2020-05-17 18:20"),
    ("2020-05-19 08:30", "2020-05-21 19:10"),
    ("2020-05-25 09:00", "2020-05-28 18:10"),
    # jun
    ("2020-06-02 09:00", "2020-06-04 16:00"),
    ("2020-06-05 10:00", "2020-06-10 18:00"),
    ("2020-06-12 09:20", "2020-06-13 17:10"),
    ("2020-06-14 10:00", "2020-06-16 18:00"),
    ("2020-06-16 09:15", "2020-06-17 19:30"),
    ("2020-06-19 10:00", "2020-06-21 20:00"),
    ("2020-06-25 09:10", "2020-06-28 21:30"),
    # july
    ("2020-07-02 09:00", "2020-07-04 18:00"),
    ("2020-07-05 09:00", "2020-07-10 18:00"),
    ("2020-07-11 09:00", "2020-07-13 18:00"),
    ("2020-07-14 09:00", "2020-07-16 18:00"),
    ("2020-07-16 09:00", "2020-07-17 18:00"),
    ("2020-07-19 09:00", "2020-07-21 18:00"),
    ("2020-07-25 09:00", "2020-07-28 18:00"),
    # aug
    ("2020-08-02 08:00", "2020-08-04 17:00"),
    ("2020-08-05 09:50", "2020-08-10 18:00"),
    ("2020-08-11 08:00", "2020-08-13 19:00"),
    ("2020-08-14 09:30", "2020-08-16 19:00"),
    ("2020-08-16 10:00", "2020-08-17 18:20"),
    ("2020-08-19 09:20", "2020-08-21 20:20"),
    ("2020-08-25 11:20", "2020-08-28 18:00"),
    # sep
    ("2020-09-02 09:00", "2020-09-04 10:00"),
    ("2020-09-05 10:00", "2020-09-10 18:30"),
    ("2020-09-11 09:00", "2020-09-13 13:00"),
    ("2020-09-14 11:00", "2020-09-16 14:40"),
    ("2020-09-16 09:00", "2020-09-17 18:50"),
    ("2020-09-19 11:50", "2020-09-21 16:10"),
    ("2020-09-25 09:00", "2020-09-28 18:00"),
    # oct
    ("2020-10-02 13:00", "2020-10-04 15:00"),
    ("2020-10-05 08:00", "2020-10-10 18:45"),
    ("2020-10-11 07:10", "2020-10-13 15:00"),
    ("2020-10-14 09:00", "2020-10-16 18:00"),
    ("2020-10-16 07:00", "2020-10-17 16:20"),
    ("2020-10-19 09:10", "2020-10-21 18:00"),
    ("2020-10-25 09:00", "2020-10-28 19:20"),
    # nov
    ("2020-11-02 13:00", "2020-11-04 15:00"),
    ("2020-11-05 08:00", "2020-11-10 18:45"),
    ("2020-11-11 07:10", "2020-11-13 15:00"),
    ("2020-11-14 09:00", "2020-11-16 18:00"),
    ("2020-11-16 07:00", "2020-11-17 16:20"),
    ("2020-11-19 09:10", "2020-11-21 18:00"),
    ("2020-11-25 09:00", "2020-11-28 19:20"),
    # dec
    ("2020-12-02 13:00", "2020-12-04 15:00"),
    ("2020-12-05 08:00", "2020-12-10 18:45"),
    ("2020-12-11 07:10", "2020-12-13 15:00"),
    ("2020-12-14 09:00", "2020-12-16 18:00"),
    ("2020-12-16 07:00", "2020-12-17 16:20"),
    ("2020-12-19 09:10", "2020-12-21 18:00"),
    ("2020-12-25 09:00", "2020-12-28 19:20"),
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


fd = open('pets.sql', 'r')
sqlFile = fd.read()
fd.close()

# all SQL commands (split on ';')
sqlCommands = sqlFile.split(';')

for command in sqlCommands:
    try:
        splitString = "INSERT INTO pet VALUES ("
        pusername = command.split(splitString)[1].split("'")[1]
        petOwnerNames.append(pusername)
        petName = command.split(splitString)[1].split("'")[3]
        petNames.append(petName)
    except:
        print("exception")

f = open("bid_transactions.sql", "a")
# from part time caretakers
for i in range(0, 200):
    pusername = petOwnerNames[i]
    petName = petNames[i]
    cusername = partTimeCaretakerNames[i]
    month = i % 12
    period = possible_periods[month * 7 + randint(0, 6)]
    start = period[0]
    end = period[1]
    biddingTime = ""
    paymentTime = ""
    if month > 9:
        biddingTime = "2020-11-03"
        paymentTime = "2020-11-03"
    else:
        biddingTime = start
        paymentTime = start
    amount = randint(100, 1000)
    methods = ["Cash", "Credit Card", "PayLah!", "GrabPay"]
    paymentMethod = methods[randint(0, 3)]
    transfers = ["Pet Owner deliver", "Care Taker pick up", "Transfer through the physical building of PCS"]
    startTransferMethod = transfers[randint(0, 2)]
    endTransferMethod = transfers[randint(0, 2)]
    isSuccessful = "true"
    reviewTime = ""
    review = ""
    rating = 0
    if month > 9:
        reviewTime = "null"
        review = "null"
        rating = "null"
    else:
        reviewTime = "'" + end + "'"
        rating = randint(1, 5)
        if rating > 3:
            review = "'" + good_reviews[randint(0, len(good_reviews) - 1)] + "'"
        elif rating == 3:
            review = "'" + average_reviews[randint(0, len(average_reviews) - 1)] + "'"
        else:
            review = "'" + bad_reviews[randint(0, len(bad_reviews) - 1)] + "'"

    f.write(f"INSERT INTO bid_transaction VALUES ('{pusername}', '{petName}','{cusername}', '{biddingTime}', '{start}', '{end}', '{paymentTime}', {amount}, '{paymentMethod}', '{startTransferMethod}', '{endTransferMethod}', {isSuccessful}, {reviewTime}, {review}, {rating});\n")

# from full time caretakers
for i in range(200, len(petOwnerNames)):
    pusername = petOwnerNames[i]
    petName = petNames[i]
    cusername = fulltimeCaretakerNames[i - 200]
    leave = i % 3
    period = ""
    if leave == 0:
        period = possible_periods[randint(7, 83)]
    elif leave == 1:
        period = possible_periods[randint(0, 83)]
    else:
        period = possible_periods[randint(0, 76)]

    start = period[0]
    end = period[1]
    biddingTime = ""
    paymentTime = ""
    if month > 9:
        biddingTime = "2020-11-03"
        paymentTime = "2020-11-03"
    else:
        biddingTime = start
        paymentTime = start
    amount = randint(100, 1000)
    methods = ["Cash", "Credit Card", "PayLah!", "GrabPay"]
    paymentMethod = methods[randint(0, 3)]
    transfers = ["Pet Owner deliver", "Care Taker pick up", "Transfer through the physical building of PCS"]
    startTransferMethod = transfers[randint(0, 2)]
    endTransferMethod = transfers[randint(0, 2)]
    isSuccessful = "true"
    reviewTime = ""
    review = ""
    rating = 0
    if month > 9:
        reviewTime = "null"
        review = "null"
        rating = "null"
    else:
        reviewTime = "'" + end + "'"
        rating = randint(1, 5)
        if rating > 3:
            review = "'" + good_reviews[randint(0, len(good_reviews) - 1)] + "'"
        elif rating == 3:
            review = "'" + average_reviews[randint(0, len(average_reviews) - 1)] + "'"
        else:
            review = "'" + bad_reviews[randint(0, len(bad_reviews) - 1)] + "'"

    f.write(f"INSERT INTO bid_transaction VALUES ('{pusername}', '{petName}','{cusername}', '{biddingTime}', '{start}', '{end}', '{paymentTime}', {amount}, '{paymentMethod}', '{startTransferMethod}', '{endTransferMethod}', {isSuccessful}, {reviewTime}, {review}, {rating});\n")

f.close()

    


# INSERT INTO animal_type VALUES ('big dog');
# INSERT INTO animal_type VALUES ('bird');
# INSERT INTO animal_type VALUES ('cat');
# INSERT INTO animal_type VALUES ('rodent');
# INSERT INTO animal_type VALUES ('rabbit');
# INSERT INTO animal_type VALUES ('small dog');