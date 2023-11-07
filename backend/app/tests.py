import math


def calc():
    res = [70, 68, 67]
    Tm = 4
    T0 = 8

    l = len(res)

    # F.1
    s = 0
    for el in res:
        s += 10**(0.1*el)
    LpAeqTm = 10*math.log10(s/len(res))
    print(f"{LpAeqTm=}")

    # F.2
    Lex_8h = 10*math.log10((Tm/T0)*10**(0.1*LpAeqTm))
    print(f"{Lex_8h=}")

    # F.3
    C1am = (Tm/T0)*10**(0.1*(LpAeqTm - Lex_8h))
    print(f"{C1am=}")
    # F.4
    C1bm = 4.34*(C1am/Tm)
    print(f"{C1bm=}")

    # F.5
    sL = 0
    for el in res:
        sL += (el - LpAeqTm)**2
    U1am = math.sqrt((1/(l*(l-1)))*sL)
    print(f"{U1am=}")

    U1bm = 0
    print(f"{U1bm=}")

    U2 = 0.7

    U3 = 1
    print(f"{U3=}")

    U2_Lex_8h = C1am**2*(U1am**2 + U2**2 + U3**2) + (C1bm*U1bm)**2
    print(f"{U2_Lex_8h=}")


if __name__ == "__main__":
    calc()
