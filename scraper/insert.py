from database import supabase
from normalize import clean_name


def insert_lawyer(name):

    name = clean_name(name)

    existing = (
        supabase.table("lawyers")
        .select("*")
        .eq("name", name)
        .execute()
    )

    if existing.data:
        return existing.data[0]["id"]

    row = (
        supabase.table("lawyers")
        .insert({
            "name": name
        })
        .execute()
    )

    return row.data[0]["id"]