import traceback

try:
    raise ValueError
    tb = "No errors"
except ValueError:
    tb = traceback.format_exc()
finally:
    # print(tb)
    pass