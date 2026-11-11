def show_word(word,guessed):
    c=""
    if guessed!="":
        for i in guessed:
            for a in word: 
                if a==i:            
                    c= c+i
            if a!=i:
                c=c+"_"
    else:
        for e in word:
            c=c+"_"
    if word=="":
        return ('""')
    else:
        return c
d=show_word("apple","ale")
print(d)