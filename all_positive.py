def all_positive(nums):
    for num in nums:
        if num<=0:
            return (False)
    return (True)
print(all_positive([1, 2, 3]) == True)
print(all_positive([1, -2, 3]) == False)
print(all_positive([-0]) == False)
print(all_positive([5]) == True)