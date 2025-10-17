from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Banner, AboutSection, WhatWeDoItem, JourneyEntry
from .serializers import (
    BannerSerializer, AboutSectionSerializer,
    WhatWeDoItemSerializer, JourneyEntrySerializer
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
