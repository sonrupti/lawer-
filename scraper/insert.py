from database import supabase


def insert_lawyer(data):
    try:
        response = (
            supabase.table("lawyers")
            .insert(data)
            .execute()
        )
        return response.data

    except Exception as e:
        print("Lawyer Insert Error:", e)


def insert_case(data):
    try:
        response = (
            supabase.table("cases")
            .insert(data)
            .execute()
        )
        return response.data

    except Exception as e:
        print("Case Insert Error:", e)
        return None


def insert_hearing(data):
    try:
        response = (
            supabase.table("hearings")
            .insert(data)
            .execute()
        )
        return response.data

    except Exception as e:
        print("Hearing Insert Error:", e)


def insert_lawyer(data):
    try:
        response = supabase.table("lawyers").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Lawyer Insert Error: {e}")
        return None