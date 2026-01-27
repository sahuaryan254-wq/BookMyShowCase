import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='devki@1234',
        port=3306
    )
    with connection.cursor() as cursor:
        cursor.execute("DROP DATABASE IF EXISTS bookmyshowcase")
        cursor.execute("CREATE DATABASE bookmyshowcase")
    connection.commit()
    print("Database 'bookmyshowcase' reset successfully")
except Exception as e:
    print(f"Error resetting database: {e}")
finally:
    connection.close()
