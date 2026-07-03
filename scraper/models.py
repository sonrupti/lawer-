from dataclasses import dataclass
from typing import List


@dataclass
class Lawyer:
    name: str
    side: str = ""


@dataclass
class Judge:
    name: str


@dataclass
class Order:
    order_date: str
    order_title: str
    pdf_url: str


@dataclass
class Hearing:
    hearing_date: str
    stage: str


@dataclass
class Case:

    case_number: str
    case_type: str
    filing_year: str

    petitioner: str
    respondent: str

    status: str

    court: str = "Orissa High Court"

    judges: List[Judge] = None
    lawyers: List[Lawyer] = None
    hearings: List[Hearing] = None
    orders: List[Order] = None