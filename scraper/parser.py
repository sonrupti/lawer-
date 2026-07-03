from bs4 import BeautifulSoup


def parse_case(html):

    soup = BeautifulSoup(html, "lxml")

    print(soup.title)

    return {}