import os
try:
    import pymysql
    pymysql.install_as_MySQLdb()
    import MySQLdb
    MySQLdb.version_info = (2, 2, 2, 'final', 0)
    MySQLdb.version = '2.2.2'
except ImportError:
    pass


from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyshowcase.settings')

application = get_wsgi_application()
