from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Banner, AboutSection, WhatWeDoItem, JourneyEntry, Program, Story, ContactMessage, ContactInfo, EventCategory, Event, EventPhoto
from .serializers import (
    BannerSerializer, AboutSectionSerializer,
    WhatWeDoItemSerializer, JourneyEntrySerializer, ProgramSerializer, StorySerializer, ContactMessageSerializer, ContactInfoSerializer,
    EventCategorySerializer, EventSerializer, EventPhotoSerializer
)
from .permissions import ReadOnlyOrStaffWrite

# --- Banner CRUD (public GET; staff can write) ---
class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.filter(is_active=True).order_by("order","id")
    serializer_class = BannerSerializer
    permission_classes = [ReadOnlyOrStaffWrite]
    parser_classes = [MultiPartParser, FormParser]

    # allow staff to see all when managing
    def get_queryset(self):
        if self.request.user.is_staff and self.request.method != "GET":
            return Banner.objects.all().order_by("order","id")
        return super().get_queryset()


# --- About Section ---
# 1) Public endpoint: returns the single active AboutSection with nested lists
class AboutPublic(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        obj = AboutSection.objects.filter(is_active=True).order_by("-id").first()
        if not obj:
            return Response({})
        return Response(AboutSectionSerializer(obj).data)

# 2) Admin/manage endpoints (optional, for your custom dashboard)
class AboutSectionViewSet(viewsets.ModelViewSet):
    queryset = AboutSection.objects.all().order_by("-id")
    serializer_class = AboutSectionSerializer
    permission_classes = [ReadOnlyOrStaffWrite]
    parser_classes = [MultiPartParser, FormParser]

class WhatWeDoItemViewSet(viewsets.ModelViewSet):
    queryset = WhatWeDoItem.objects.all().order_by("order","id")
    serializer_class = WhatWeDoItemSerializer
    permission_classes = [ReadOnlyOrStaffWrite]

class JourneyEntryViewSet(viewsets.ModelViewSet):
    queryset = JourneyEntry.objects.all().order_by("order","id")
    serializer_class = JourneyEntrySerializer
    permission_classes = [ReadOnlyOrStaffWrite]


from rest_framework import generics, viewsets, permissions
from .models import NewsItem
from .serializers import NewsItemSerializer

# Public list (homepage or news section)
class NewsList(generics.ListAPIView):
    queryset = NewsItem.objects.filter(is_active=True).order_by("order")
    serializer_class = NewsItemSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]
# Admin manage (CRUD)
class NewsItemViewSet(viewsets.ModelViewSet):
    queryset = NewsItem.objects.all()
    serializer_class = NewsItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProgramListView(generics.ListAPIView):
    queryset = Program.objects.filter(is_active=True).order_by("order", "id")
    serializer_class = ProgramSerializer
    permission_classes = [permissions.AllowAny]

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all().order_by("order", "id")
    serializer_class = ProgramSerializer
    permission_classes = [permissions.IsAuthenticated]  # consistent with News manage
    parser_classes = [MultiPartParser, FormParser]
    
class StoryList(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Story.objects.filter(is_active=True).order_by("order", "id")
    
class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all().order_by("order", "id")
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]  # or ReadOnlyOrStaffWrite
    parser_classes = [MultiPartParser, FormParser]
    
# POST from frontend contact form
class ContactMessageListCreate(generics.ListCreateAPIView):
    """
    GET  /api/contact/   -> list messages (admins only)
    POST /api/contact/   -> create a message (public)
    """
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer

    # Different permissions per method
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    
class ContactInfoView(generics.RetrieveAPIView):
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return ContactInfo.objects.first()  # one record only
    
class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all().order_by("id")
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]


#--- Event Categories and Events ---

# Public: categories with their active events and photos
class EventCategoriesPublic(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EventCategorySerializer

    def get_queryset(self):
        # Only active categories → only active events → only active photos (handled by serializer data)
        # Keep it simple here: return active categories; nested relations are read-only
        return EventCategory.objects.filter(is_active=True).order_by("order", "name")

# Public: flat list of active events (useful for filtering by year or category on frontend)
class EventsPublic(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EventSerializer

    def get_queryset(self):
        qs = Event.objects.filter(is_active=True).order_by("order", "year", "title")
        cat = self.request.query_params.get("category")
        year = self.request.query_params.get("year")
        if cat:
            qs = qs.filter(category__slug=cat) | qs.filter(category__id__iexact=cat)
        if year:
            qs = qs.filter(year=year)
        return qs

# Manage (JWT required)
class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.all().order_by("order", "name")
    serializer_class = EventCategorySerializer
    parser_classes = [FormParser, MultiPartParser, JSONParser]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("order", "year", "title")
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser, JSONParser]

class EventPhotoViewSet(viewsets.ModelViewSet):
    queryset = EventPhoto.objects.all().order_by("order", "id")
    serializer_class = EventPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser, JSONParser]
    
class EventPublicDetail(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EventSerializer
    queryset = Event.objects.filter(is_active=True) 