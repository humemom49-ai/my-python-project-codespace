notes={}
def load_notes(notes):# load notes with loop and reading mode and also use try except for missing file
    try:
        with open("notes.txt","r")as f:
            for line in f:
                line=line.strip()
                line = line.split(",",1)
                line[0]=(int(line[0]))
                for pair in [line]:
                    notes[pair[0]] = pair[1]
    except FileNotFoundError:
        print ("no file named notes.txt")
        pass
            
def notes_add(notes):# ask for notes
    try:
        a=int(input("type a whole number"))
        if a>0 and a not in notes:
            b=input("what notes you want to add")
            b=b.strip()
            b=b.lower()
            if b !="":
                notes[a]=b
            else:
                print ("type notes not just spaces")
        else:
            print ("it is refused")
    except ValueError:
        print ("use whole numbers")
def see_all(notes):# shows us all notes
    if notes=={}:
        print ("no notes")
    else:
        for key,value in notes.items():
            print ("key is:",key," and Value is:",value)
def search(notes): # ask for word to find notes you want
    flag=False
    note=input("which note you want to find")
    note=note.lower()
    note=note.strip()
    note=note.strip(".,!?")
    if note !="":
        for a,b in notes.items():
            c= b.strip(".,!?")
            if note  in c:
                print (a,b)
                flag=True
    else:
        print("note input is only spaces")
        return
    if not flag:
        print ("no notes there")  
def save(notes):# use loop to write
    with open("notes.txt","w")as f:
        for number,note in notes.items():
            f.write(str(number)+","+note+"\n")
load_notes(notes)
while True:# loop ask until quit
    command=input("choose add,search,see all or quit to exit").strip().lower()# ask for command
    if command=="quit":# ask for quit comand
        save(notes)
        break
    elif command=="add": #run notes_add function
        notes_add(notes)
    elif command=="search":# run search function
        search(notes)
    elif command=="see all":# run see all function
        see_all(notes)
    else:
        print ("unknown command")# print unknown command