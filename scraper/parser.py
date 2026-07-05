"""
parser.py

Parses the PLAIN TEXT you get by selecting-all and copying a case details
page (Ctrl+A, Ctrl+C, then paste into chat / a .txt file) into a Case object.

We use plain text instead of saved HTML because this eCourts site loads case
details via AJAX into the existing page's DOM -- the underlying HTML document
never changes, so Ctrl+S "Webpage, HTML only" keeps saving the original blank
search form rather than the populated case view. Copy-pasted text sidesteps
this entirely and has proven reliable.

Expected input looks like (real example this was built against):

    High Court of Orissa
    Case DetailsCase Type: RPFAM
    Filing Number: 195/2023Filing Date: 23-06-2023
    Registration Number: 195/2023Registration Date: 24-06-2023
    CNR Number: ODHC01-047452-2023
    Case Status
    First Hearing Date:
    Next Hearing Date: Next Date is not given
    Stage of Case: FOR ADMISSION
    Coram: 2836MR. JUSTICE K.R.MOHAPATRABench: Single BenchState: ORISSADistrict: BaudhJudicial: Civil Section...
    Petitioner and Advocate1) JAYEEBATI LUHA
        Advocate- BIBHUTI BHUSAN MISHRA,G.R.NAYAK
    2) JASABANTA KUMBHAR
    Respondent and Advocate1) GUPTESWAR KUMBHAR
        Advocate - DEBENDRA KUMAR SAHOO A.K.MOHAKUL
    Acts
    Under Act(s)	Under Section(s)
    Subordinate Court InformationCourt Number and Name: JUDGE, FAMILY COURT, BOUDH
    ...
    IA Details
    IA Number	Party	Date of Filing	Next Date	IA Status
    IA/238/2023
    Classification :	JAYEEBATI LUHA
    GUPTESWAR KUMBHAR
    23-06-2023	--	Pending
    History of Case Hearing
    Cause List Type	Judge	Business On Date	Hearing Date	Purpose of hearing
    Supplementary-Daily	MR. JUSTICE K.R.MOHAPATRA		01-08-2023	FOR ORDERS
    ...
    Orders
      Order Number	  Order on	  Judge	  Order Date	  Order Details
      1	 RPFAM/195/2023	  MR. JUSTICE K.R.MOHAPATRA	  01-08-2023	  View
    Category Details
    Category	FAMILY LAW MATTER ( 13 )
    Sub Category	ADOPTION & MAINTENANCE MATTERS ( 6 )
    OBJECTION
    Sr.No.	Scrutiny Date	OBJECTION	Compliance Date	Receipt Date
    1	24-06-2023	All Objections are Complied	24-06-2023	--
    Back
"""

import re
from models import Case, Party, Order, Hearing, IADetail


def _clean(s):
    return re.sub(r"\s+", " ", s).strip() if s else ""


def _split_lines(text):
    return [line for line in text.split("\n")]


def _section(text, start_label, end_labels):
    """
    Extract the text between start_label and the first occurrence of any of
    end_labels (or end of text if none found).
    """
    start_idx = text.find(start_label)
    if start_idx == -1:
        return ""
    start_idx += len(start_label)
    end_idx = len(text)
    for label in end_labels:
        idx = text.find(label, start_idx)
        if idx != -1:
            end_idx = min(end_idx, idx)
    return text[start_idx:end_idx]


def parse_case(text: str) -> Case:
    case = Case()
    text = text.replace("\r\n", "\n")

    # ---- Case Details ----
    m = re.search(r"Case Type\s*:\s*(\S+)", text)
    if m:
        case.case_type = m.group(1)

    m = re.search(r"Filing Number\s*:\s*(\S+).*?Filing Date\s*:\s*([\d-]+)", text)
    if m:
        case.filing_number, case.filing_date = m.group(1), m.group(2)

    m = re.search(r"Registration Number\s*:\s*(\S+).*?Registration Date\s*:\s*([\d-]+)", text)
    if m:
        case.registration_number, case.registration_date = m.group(1), m.group(2)

    m = re.search(r"CNR Number\s*:\s*(\S+)", text)
    if m:
        case.cnr_number = m.group(1)

    if case.case_type and case.filing_number:
        case.case_number = f"{case.case_type}/{case.filing_number}"
        ym = re.search(r"(\d{4})$", case.filing_number)
        if ym:
            case.filing_year = ym.group(1)

    # ---- Case Status ----
    m = re.search(r"First Hearing Date\s*:[ \t]*(.*)", text)
    if m:
        case.first_hearing_date = _clean(m.group(1))

    m = re.search(r"Next Hearing Date\s*:[ \t]*(.*)", text)
    if m:
        case.next_hearing_date = _clean(m.group(1))

    m = re.search(r"Stage of Case\s*:[ \t]*(.*)", text)
    if m:
        case.stage_of_case = _clean(m.group(1))
        case.status = case.stage_of_case

    m = re.search(r"Coram\s*:\s*(.*?)Bench\s*:", text)
    if m:
        case.coram = _clean(m.group(1))

    for label, attr in [("Bench", "bench"), ("State", "state"),
                         ("District", "district"), ("Judicial", "judicial")]:
        mm = re.search(label + r"\s*:\s*(.*?)(?=(?:Bench|State|District|Judicial|Not Before Me|Last Page)\s*:|\n|$)", text)
        if mm:
            setattr(case, attr, _clean(mm.group(1)))

    # ---- Petitioner and Advocate ----
    pet_block = _section(text, "Petitioner and Advocate", ["Respondent and Advocate"])
    case.petitioners = _parse_party_block(pet_block)

    # ---- Respondent and Advocate ----
    resp_block = _section(text, "Respondent and Advocate", ["Acts", "Subordinate Court"])
    case.respondents = _parse_party_block(resp_block)

    # ---- Acts ----
    acts_block = _section(text, "Under Act(s)", ["Subordinate Court", "IA Details"])
    for line in _split_lines(acts_block):
        parts = [p.strip() for p in line.split("\t") if p.strip()]
        if len(parts) >= 2 and "Under Section" not in parts[0]:
            case.acts.append({"act": parts[0], "section": parts[1]})

    # ---- IA Details ----
    ia_block = _section(text, "IA Details", ["History of Case Hearing"])
    ia_lines = [l for l in _split_lines(ia_block) if l.strip()]
    current_ia = None
    for line in ia_lines:
        if line.startswith("IA Number") or ("Party" in line and "IA Status" in line):
            continue
        ia_match = re.match(r"^(IA/\S+)", line)
        if ia_match:
            if current_ia:
                case.ia_details.append(current_ia)
            current_ia = IADetail(ia_number=ia_match.group(1))
        elif current_ia is not None:
            parts = [p.strip() for p in line.split("\t") if p.strip()]
            if len(parts) >= 3:
                current_ia.date_of_filing = parts[-3]
                current_ia.next_date = parts[-2]
                current_ia.ia_status = parts[-1]
            elif "Classification" not in line:
                current_ia.party = (current_ia.party + " " + _clean(line)).strip()
    if current_ia:
        case.ia_details.append(current_ia)

    # ---- History of Case Hearing ----
    hearing_block = _section(text, "History of Case Hearing", ["Orders"])
    for line in _split_lines(hearing_block):
        parts = [p.strip() for p in line.split("\t") if p.strip()]
        if len(parts) >= 4 and "Cause List Type" not in parts[0]:
            case.hearings.append(Hearing(
                cause_list_type=parts[0],
                judge=parts[1],
                business_on_date=parts[2] if len(parts) == 5 else "",
                hearing_date=parts[-2],
                purpose=parts[-1],
            ))

    # ---- Orders ----
    orders_block = _section(text, "Order Details", ["Category Details"])
    for line in _split_lines(orders_block):
        parts = [p.strip() for p in line.split("\t") if p.strip()]
        if len(parts) >= 4 and parts[0].isdigit():
            case.orders.append(Order(
                order_number=parts[0],
                order_on=parts[1],
                judge=parts[2],
                order_date=parts[3],
            ))

    # ---- Category Details ----
    m = re.search(r"Category\t(.+)", text)
    if m:
        case.category = _clean(m.group(1))
    m = re.search(r"Sub Category\t(.+)", text)
    if m:
        case.sub_category = _clean(m.group(1))

    # ---- Objections ----
    obj_block = _section(text, "OBJECTION\n", ["Back"])
    for line in _split_lines(obj_block):
        parts = [p.strip() for p in line.split("\t") if p.strip()]
        if len(parts) >= 5 and parts[0].isdigit():
            case.objections.append({
                "sr_no": parts[0],
                "scrutiny_date": parts[1],
                "objection": parts[2],
                "compliance_date": parts[3],
                "receipt_date": parts[4],
            })

    return case


def _parse_party_block(block: str):
    parties = []
    lines = [l for l in _split_lines(block) if l.strip()]
    current = None
    for line in lines:
        m = re.match(r"^\s*(\d+)\)\s*(.+)", line)
        if m:
            if current is not None:
                parties.append(current)
            current = Party(name=_clean(m.group(2)))
        elif re.match(r"^\s*Advocate", line, re.IGNORECASE) and current is not None:
            adv_text = re.sub(r"^\s*Advocate\s*-?\s*", "", line, flags=re.IGNORECASE)
            current.advocates = [a.strip() for a in re.split(r",", adv_text) if a.strip()]
    if current is not None:
        parties.append(current)
    return parties