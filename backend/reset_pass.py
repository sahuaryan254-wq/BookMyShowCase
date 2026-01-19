import os
import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb
MySQLdb.version_info = (2, 2, 2, 'final', 0)
MySQLdb.version = '2.2.2'
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyshowcase.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'sahuaryan254@gmail.com'
new_pass = '1saryan'

try:
    user = User.objects.get(email=email)
    user.set_password(new_pass)
    user.save()
    print(f"SUCCESS: Password for {user.username} ({email}) reset to '{new_pass}'")
except User.DoesNotExist:
    print("User not found")
