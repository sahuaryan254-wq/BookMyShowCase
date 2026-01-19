import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyshowcase.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

email = 'sahuaryan254@gmail.com'
password = 'ary' # Trying a common guess or short pass
password_mysql = '1saryan' # Trying the mysql pass they gave

print("--- Testing Authentication ---")
print(f"Attempting to find user with email: {email}")

try:
    user = User.objects.get(email=email)
    print(f"User found: {user.username} (ID: {user.id})")
    print(f"Is active: {user.is_active}")
except User.DoesNotExist:
    print("User NOT found in DB!")
    exit()

# Try Authenticate with email
user_auth = authenticate(username=email, password=password_mysql)
if user_auth:
    print(f"SUCCESS: Authenticated with password '{password_mysql}'")
else:
    print(f"FAILED: Could not authenticate with password '{password_mysql}'")

# Try with username
user_auth_user = authenticate(username=user.username, password=password_mysql)
if user_auth_user:
    print(f"SUCCESS: Authenticated with username '{user.username}' and password '{password_mysql}'")
else:
    print(f"FAILED: Could not authenticate with username '{user.username}' and password '{password_mysql}'")
