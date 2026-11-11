word="python"
c=""
d=""
count=0
while True:
  a=input("pick a letter")
  if len(a)!=1 or a in d:
    print ("type a single letter or dont type repeated letter")
  else:
    if a.islower():
      if a in word:
        c=c+a
        print ("you guess it right",c)
        d=d+a
      else:
        print("wrong guess")
        count=count+1
        d=d+a
    else:
      print ("dont type numbers,capital letter or symbolds like !")
  if len(c)==len(word):
    print ("you win ")
    break
  if count==3:
    print ("you lose")
    break