from django.shortcuts import render
from django.contrib.auth import logout
from django.http import HttpResponseRedirect

# Create your views here.
def index(request):
    return render(request, "user/index.html")

def logout_view(request):
    logout(request)
    return render(request, "user/step1.html")

def redirect_view(request):
    return HttpResponseRedirect('user')



