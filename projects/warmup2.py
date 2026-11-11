def show_word(word,guessed):
    c=""
    for a in word:
        for b in guessed:
            if a==b:
                c= c+a
            else:
                c= c+"_"
    # if guessed=="":
    #     for i in word:
    #         c=c+"_"
    # if word=="":
    #     print ('""')
    return (c)
d=show_word("apple","pe")
print (d)
z="abc"
print (len(z))