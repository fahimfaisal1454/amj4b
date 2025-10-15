from rest_framework import viewsets, permissions, generics, status, parsers, mixins
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from .models import (
    BannerSlide, AboutSection, Program, ImpactStat, Story, News,  ContactMessage, ContactInfo
)
from .serializers import (
    BannerSlideSerializer, AboutSectionSerializer,  ImpactStatSerializer,
    StorySerializer, NewsSerializer,  BannerSlideAdminSerializer,  ProjectSerializer, ProjectAdminSerializer, ContactMessageSerializer, ContactInfoSerializer, 
)

# Home/Banner
class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BannerSlide.objects.filter(is_active=True).order_by("order", "id")
    serializer_class = BannerSlideSerializer
    permission_classes = [permissions.AllowAny]

class BannerAdminViewSet(viewsets.ModelViewSet):
    """
    /api/admin/banners/  -> list, create
    /api/admin/banners/{id}/ -> retrieve, update/partial_update, delete
    """
    queryset = BannerSlide.objects.all().order_by("order", "id")
    serializer_class = BannerSlideAdminSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]    

# About (single)
def get_single_about():
    about, _ = AboutSection.objects.get_or_create(pk=1)
    return about

class AboutView(APIView):
    """Public GET for About section"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        a = get_single_about()
        ser = AboutSectionSerializer(a, context={"request": request})
        # minimal shape for frontend
        data = ser.data
        return Response({
            "badge_text": data["badge_text"],
            "heading": data["heading"],
            "body": data["body"],
            "image_url": data["image_url"],  # <-- URL for the frontend <img src=... />
        })

class AboutAdminView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # <-- accept file uploads

    def get(self, request):
        about = get_single_about()
        ser = AboutSectionSerializer(about, context={"request": request})
        return Response(ser.data)

    def put(self, request):
        about = get_single_about()
        ser = AboutSectionSerializer(about, data=request.data, partial=True, context={"request": request})
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=status.HTTP_200_OK)
# Programs
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
  """
  Public list of projects (backed by Program table).
  """
  queryset = Program.objects.filter(is_active=True).order_by("order", "id")
  serializer_class = ProjectSerializer
  permission_classes = [permissions.AllowAny]


class ProjectAdminViewSet(viewsets.ModelViewSet):
  """
  /api/admin/projects/  -> CRUD for dashboard
  """
  queryset = Program.objects.all().order_by("order", "id")  # still using Program model
  serializer_class = ProjectAdminSerializer
  permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
  parser_classes = [MultiPartParser, FormParser, JSONParser]
    
# Impact stats
class ImpactStatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ImpactStat.objects.all().order_by("order", "id")
    serializer_class = ImpactStatSerializer
    permission_classes = [permissions.AllowAny]

# Stories
class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Story.objects.filter(is_active=True).order_by("order", "id")
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]


class StoryAdminViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for stories used by the dashboard at /dashboard/stories.
    Supports image upload, ordering, activate/deactivate, etc.
    """
    queryset = Story.objects.all().order_by("order", "-id")
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
# News (list + detail)
class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.filter(published=True)
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
class NewsAdminViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by("-date", "-created_at")
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
# Contact

class ContactCreateView(generics.CreateAPIView):
    """
    POST /api/contact/
    Handles public contact form submissions.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

class ContactInfoView(APIView):
    """
    GET /api/contact-info/
    Returns singleton contact info for the site.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        obj, _ = ContactInfo.objects.get_or_create(pk=1)
        return Response(ContactInfoSerializer(obj).data, status=status.HTTP_200_OK)


# ---------- Admin: contact messages (list/retrieve/delete) ----------
class ContactAdminViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.DestroyModelMixin,
                          viewsets.GenericViewSet):
    """
    /api/admin/contacts/  (GET list)
    /api/admin/contacts/{id}/ (GET retrieve, DELETE)
    """
    queryset = ContactMessage.objects.all().order_by("-created_at", "-id")
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# ---------- Admin: contact info (get/put) ----------
class ContactInfoAdminView(APIView):
    """
    GET /api/admin/contact-info/
    PUT /api/admin/contact-info/   { email, phone, address, hours }
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def _get(self):
        obj, _ = ContactInfo.objects.get_or_create(pk=1)
        return obj

    def get(self, request):
        return Response(ContactInfoSerializer(self._get()).data, status=status.HTTP_200_OK)

    def put(self, request):
        obj = self._get()
        ser = ContactInfoSerializer(obj, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=status.HTTP_200_OK)