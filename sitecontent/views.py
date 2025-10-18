from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Banner, AboutSection, WhatWeDoItem, JourneyEntry, Program, Story, ContactMessage, ContactInfo
from .serializers import (
    BannerSerializer, AboutSectionSerializer,
    WhatWeDoItemSerializer, JourneyEntrySerializer, ProgramSerializer, StorySerializer, ContactMessageSerializer, ContactInfoSerializer
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
    parser_classes = [MultiPartParser, FormParser]
class StoryList(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Story.objects.filter(is_active=True).order_by("order", "id")
    

# POST from frontend contact form
class ContactMessageCreate(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

# GET for frontend contact info (email, phone, etc.)
class ContactInfoView(generics.RetrieveAPIView):
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return ContactInfo.objects.first()  # one record only