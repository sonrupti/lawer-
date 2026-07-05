from parser import parse_case
import dataclasses, json

with open("Case Status _ Search by Advocate Name.html", encoding="utf-8") as f:
    html = f.read()

case = parse_case(html)
print(json.dumps(dataclasses.asdict(case), indent=2))