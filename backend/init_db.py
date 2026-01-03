import mysql.connector

def create_database():
    try:
        # Connect to MySQL server (no database selected)
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Localhost_123"
        )
        
        mycursor = mydb.cursor()
        
        # Create database if it doesn't exist
        mycursor.execute("CREATE DATABASE IF NOT EXISTS travel_app_db")
        print("Database 'travel_app_db' created or already exists.")
        
        mycursor.close()
        mydb.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

if __name__ == "__main__":
    create_database()
