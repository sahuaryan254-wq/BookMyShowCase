import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='1saryan',
        port=3306
    )
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS bookmyshowcase")
    connection.commit()
    print("Database 'bookmyshowcase' created successfully")
except Exception as e:
    print(f"Error creating database: {e}")
finally:
    connection.close()
