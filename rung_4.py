"""A small locker assignment example."""


def assign_locker(lockers, number, name):
    """Assign a free locker to a non-empty name; return whether it worked."""
    name = name.strip()
    if number in lockers or not name:
        return False
    lockers[number] = name
    return True


def release_locker(lockers, number):
    """Make an assigned locker available; return whether it was assigned."""
    if number not in lockers:
        return False
    del lockers[number]
    return True


def main():
    lockers = {7: "Sam"}

    if not assign_locker(lockers, 7, "Ann"):
        print("refused, 7 is already there")

    if assign_locker(lockers, 8, "Ann"):
        print("assigned locker 8 to Ann")

    print(lockers)


if __name__ == "__main__":
    main()
