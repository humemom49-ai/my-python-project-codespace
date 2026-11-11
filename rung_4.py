def show_word(word,guessed):
    c=""
    for words in word:
        if words in guessed:            
            c= c+words
            c= c+" "
        else:
            c=c+"_"
            c=c+" "
    print (c.strip())
while True:
    z=input("type")
    if z=="quit":
        break
d=show_word("apple", z)
print(d)