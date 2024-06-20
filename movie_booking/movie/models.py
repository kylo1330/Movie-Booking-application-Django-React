from django.core.validators import validate_email
from django.db import models
from django.contrib.auth.models import User

class Movie_auth(models.Model):
    email = models.CharField(max_length=100, validators=[validate_email])
    password = models.CharField(max_length=50)




  

   