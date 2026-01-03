import mysql.connector

def update_schema():
    print("Attempting to update database schema...")
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Localhost_123", # Password from server.py
            database="travel_app_db"
        )
        cursor = conn.cursor()
        
        # 1. Add plan_details column
        try:
            print("Adding 'plan_details' column to 'trip' table...")
            cursor.execute("ALTER TABLE trip ADD COLUMN plan_details TEXT")
            print("Success: 'plan_details' column added.")
        except mysql.connector.Error as err:
            if err.errno == 1060: # Duplicate column name
                print("Info: 'plan_details' column already exists.")
            elif err.errno == 1146: # Table doesn't exist, maybe it's named 'trips'?
                print("Table 'trip' not found, trying 'trips'...")
                try:
                    cursor.execute("ALTER TABLE trips ADD COLUMN plan_details TEXT")
                    print("Success: 'plan_details' column added to 'trips'.")
                except mysql.connector.Error as err2:
                     print(f"Error updating 'trips': {err2}")
            else:
                print(f"Error adding column: {err}")

        conn.commit()
        conn.close()
        print("Schema update process finished.")

    except Exception as e:
        print(f"Failed to connect to MySQL: {e}")

if __name__ == "__main__":
    update_schema()
