import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='1saryan',
        database='bookmyshowcase',
        port=3306
    )
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print("Tables in 'bookmyshowcase':")
        for table in tables:
            print(f"- {table[0]}")
except Exception as e:
    print(f"Error listing tables: {e}")
finally:
    connection.close()
