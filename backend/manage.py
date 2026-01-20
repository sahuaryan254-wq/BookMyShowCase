#!/usr/bin/env python
"Django's command-line utility for administrative tasks."
import os
import sys
try:
    # Optional: only required when running with MySQL (USE_MYSQL=1).
    import pymysql  # type: ignore

    pymysql.install_as_MySQLdb()
    import MySQLdb  # type: ignore

    MySQLdb.version_info = (2, 2, 2, 'final', 0)
    MySQLdb.version = '2.2.2'
except Exception:
    # SQLite-by-default setup should work without PyMySQL installed.
    pass

def main():
    "Run administrative tasks."
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyshowcase.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
