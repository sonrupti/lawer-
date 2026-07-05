from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Lawyer:
    name: str
    side: str = ""  # "petitioner" or "respondent"


@dataclass
class Party:
    name: str
    advocates: List[str] = field(default_factory=list)


@dataclass
class Judge:
    name: str


@dataclass
class Order:
    order_number: str = ""
    order_on: str = ""
    judge: str = ""
    order_date: str = ""
    pdf_url: str = ""


@dataclass
class Hearing:
    cause_list_type: str = ""
    judge: str = ""
    business_on_date: str = ""
    hearing_date: str = ""
    purpose: str = ""


@dataclass
class IADetail:
    ia_number: str = ""
    party: str = ""
    date_of_filing: str = ""
    next_date: str = ""
    ia_status: str = ""


@dataclass
class Case:

    case_number: str = ""       # e.g. RPFAM/195/2023 (case_type/filing_number/year)
    case_type: str = ""
    filing_number: str = ""
    filing_date: str = ""
    registration_number: str = ""
    registration_date: str = ""
    cnr_number: str = ""
    filing_year: str = ""

    first_hearing_date: str = ""
    next_hearing_date: str = ""
    stage_of_case: str = ""

    coram: str = ""
    bench: str = ""
    state: str = ""
    district: str = ""
    judicial: str = ""

    category: str = ""
    sub_category: str = ""

    court: str = "Orissa High Court"
    status: str = ""

    petitioners: List[Party] = field(default_factory=list)
    respondents: List[Party] = field(default_factory=list)

    acts: List[dict] = field(default_factory=list)          # [{"act": "...", "section": "..."}]
    ia_details: List[IADetail] = field(default_factory=list)
    hearings: List[Hearing] = field(default_factory=list)
    orders: List[Order] = field(default_factory=list)
    objections: List[dict] = field(default_factory=list)     # [{"scrutiny_date":..., "objection":..., ...}]

    judges: List[Judge] = field(default_factory=list)
    lawyers: List[Lawyer] = field(default_factory=list)