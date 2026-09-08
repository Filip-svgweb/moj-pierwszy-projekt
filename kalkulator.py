print("================================")
print("         KALKULATOR")
print("================================")

while True:

    a_input = input("Podaj pierwszą liczbę: ").strip().lower()

    if a_input == "q":
        print()
        print("Do zobaczenia! 👋")
        break

    try:
        a = float(a_input)
    except ValueError:
        print("❌ To nie jest liczba!")
        continue

    b_input = input("Podaj drugą liczbę: ").strip().lower()

    if b_input == "q":
        print()
        print("Do zobaczenia! 👋")
        break

    try:
        b = float(b_input)
    except ValueError:
        print("❌ To nie jest liczba!")
        continue

    print()
    print("Wybierz działanie:")
    print("+  Dodawanie")
    print("-  Odejmowanie")
    print("*  Mnożenie")
    print("/  Dzielenie")
    print("q  Wyjście")
    print()

    dzialanie = input("Twoje działanie: ").strip().lower()

    if dzialanie == "q":
        print()
        print("Do zobaczenia! 👋")
        break

    if dzialanie == "+":
        wynik = a + b
        print("Wynik:", wynik)

    elif dzialanie == "-":
        wynik = a - b
        print("Wynik:", wynik)

    elif dzialanie == "*":
        wynik = a * b
        print("Wynik:", wynik)

    elif dzialanie == "/":
        if b == 0:
            print("❌ Nie można dzielić przez zero!")
        else:
            wynik = a / b
            print("Wynik:", wynik)

    else:
        print("❌ Nieprawidłowe działanie!")

    print()
    print("--------------------------------")
    print()