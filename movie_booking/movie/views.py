from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required, user_passes_test

from movie.forms import LoginModelForm

# Views for user registration and login
def signup_page(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')  # Redirect to home page after successful login
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

# View for logging out
@login_required(login_url='/login/')
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('login')
    return render(request, 'logout.html')

# Custom user check for about us page access control
def user_check(user):
    return user.username.endswith('@example.com')

@login_required(login_url='/login/')
@user_passes_test(user_check, login_url='/login/')
def about_us(request):
    return render(request, 'about-us.html')

# View for movie form
def movie(request):
    if request.method == 'POST':
        form = LoginModelForm(request.POST)
        if form.is_valid():
            mov = form.save()
            return render(request, 'form-data.html', {
                'message': 'Data saved to db',
                'movie': mov
            })
    else:
        form = LoginModelForm()
    return render(request, 'index.html', {'form': form})
