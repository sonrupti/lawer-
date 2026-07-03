from scraper import scrape
from parser import parse_case

html = scrape()

data = parse_case(html)

print(data)