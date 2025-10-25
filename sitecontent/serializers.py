from rest_framework import serializers
from .models import Banner, AboutSection, WhatWeDoItem, JourneyEntry, Program,  Story, ContactMessage, ContactInfo, EventCategory, Event, EventPhoto

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = "__all__"

class WhatWeDoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatWeDoItem
        fields = ("id","title","description","order","is_active")

class JourneyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyEntry
        fields = ("id","year","text","order","is_active")

class AboutSectionSerializer(serializers.ModelSerializer):
    # include the dynamic lists
    whatwedo_items = WhatWeDoItemSerializer(many=True, read_only=True)
    journey_entries = JourneyEntrySerializer(many=True, read_only=True)

    class Meta:
        model = AboutSection
        fields = "__all__"

from rest_framework import serializers
from .models import NewsItem

class NewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsItem
        fields = "__all__"

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"
        
class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = "__all__"
        

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = "__all__"
        
#---------------------------------------------------------

class EventPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPhoto
        fields = "__all__"

class EventSerializer(serializers.ModelSerializer):
    photos = EventPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = "__all__"

class EventCategorySerializer(serializers.ModelSerializer):
    # For public response with nested events (each with nested photos)
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = EventCategory
        fields = "__all__"