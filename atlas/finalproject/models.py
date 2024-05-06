from django.db import models
from django.contrib.auth.models import User

# Represents a game that a user has marked as a favourite. Each user-game pair must be unique.
class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_id = models.IntegerField()

    class Meta:
        app_label = 'finalproject'
        unique_together = ('user', 'game_id')

# Represents a collection of games created by a user.
class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

# Represents a game that is part of a user's collection, including its order in the collection.
class CollectionGame(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    game_id = models.IntegerField()
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

# Represents an upvote that a user has given to a collection. Each user-collection pair must be unique.
class CollectionUpvote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'collection')
