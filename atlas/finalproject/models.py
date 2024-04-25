from django.db import models
from django.contrib.auth.models import User

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_id = models.IntegerField()

    class Meta:
        app_label = 'finalproject'
        unique_together = ('user', 'game_id')


class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

class CollectionGame(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    game_id = models.IntegerField()
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']



# Create your models here.
