count=0
while True:
    password=input("Password:").lower()
    if password=="python":
        print ("welcome")
        break
    count= count+1
    if count==3:
        print ("locked")
        break