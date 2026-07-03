import re


def clean_name(name):

    if not name:
        return ""

    name = name.upper()

    remove = [
        "MR.",
        "MRS.",
        "MS.",
        "SMT.",
        "SHRI",
        "SRI",
    ]

    for r in remove:
        name = name.replace(r, "")

    name = re.sub(r"\s+", " ", name)

    return name.strip()