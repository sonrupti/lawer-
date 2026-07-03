from database import supabase

response = supabase.table("courts").select("*").execute()

print(response.data)