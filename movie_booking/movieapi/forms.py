from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user
    
    
from django import forms
from movieapi.models import Book,Event


class EventForm(forms.ModelForm):  # Ensure it's a ModelForm, not a regular Form
    class Meta:
        model = Event
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        show_date = cleaned_data.get("show_date")
        end_date = cleaned_data.get("end_date")
        if show_date and end_date:
            if show_date > end_date:
                raise forms.ValidationError("End date must be after show date.")


class bookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = '__all__'

