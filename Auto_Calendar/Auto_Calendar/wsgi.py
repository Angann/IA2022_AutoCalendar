"""
WSGI config for Auto_Calendar project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import sys
from whitenoise.django import DjangoWhiteNoise


from django.core.wsgi import get_wsgi_application

path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Auto_Calendar.settings')

application = get_wsgi_application()
application = DjangoWhiteNoise(application)

