from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.views import LogoutView

from . import views

urlpatterns = [
    #path('', TemplateView.as_view(template_name="user/step1.html")),
    #path('logout', LogoutView.as_view())
    path('', views.index),
    path('accounts/', include('allauth.urls')),
    path('logout/', views.logout_view, name='logout')
]
