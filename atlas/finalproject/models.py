from django.db import models
from django.contrib.auth.models import User

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_id = models.IntegerField()

    class Meta:
        app_label = 'finalproject'
        unique_together = ('user', 'game_id')


# Create your models here.
