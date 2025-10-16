from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from sitecontent.views import (
    # Public
    BannerViewSet, AboutView, ProjectViewSet, ImpactStatViewSet,
    StoryViewSet, NewsViewSet, ContactCreateView, ContactInfoView,
    # Admin
    BannerAdminViewSet, ProjectAdminViewSet, StoryAdminViewSet,
    NewsAdminViewSet, ContactAdminViewSet, ContactInfoAdminView,
    AboutAdminView,   # ✅ add this import
)

# -------- Public API router (/api/...) --------
public_router = DefaultRouter()
public_router.register(r"banner", BannerViewSet, basename="banner")
public_router.register(r"projects", ProjectViewSet, basename="projects")
# Optional BC alias if any code still calls /api/programs/
public_router.register(r"programs", ProjectViewSet, basename="programs")
public_router.register(r"impact", ImpactStatViewSet, basename="impact")
public_router.register(r"stories", StoryViewSet, basename="stories")
public_router.register(r"news", NewsViewSet, basename="news")

# -------- Admin API router (/api/admin/...) --------
admin_router = DefaultRouter()
admin_router.register(r"banners", BannerAdminViewSet, basename="admin-banners")
admin_router.register(r"projects", ProjectAdminViewSet, basename="admin-projects")
# Optional BC alias if any dashboard code still calls /api/admin/programs/
admin_router.register(r"programs", ProjectAdminViewSet, basename="admin-programs")
admin_router.register(r"stories", StoryAdminViewSet, basename="admin-stories")
admin_router.register(r"news", NewsAdminViewSet, basename="admin-news")
admin_router.register(r"contacts", ContactAdminViewSet, basename="admin-contacts")

urlpatterns = [
    path("admin/", admin.site.urls),

    # --- Admin routes FIRST ---
    path("api/admin/", include(admin_router.urls)),
    path("api/admin/about/", AboutAdminView.as_view(), name="admin-about"),          # ✅ added
    path("api/admin/contact-info/", ContactInfoAdminView.as_view(), name="admin-contact-info"),

    # --- Public routes AFTER ---
    path("api/", include(public_router.urls)),
    path("api/about/", AboutView.as_view(), name="about"),
    path("api/contact/", ContactCreateView.as_view(), name="contact"),
    path("api/contact-info/", ContactInfoView.as_view(), name="contact-info"),

    # --- JWT Auth endpoints ---
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh_alias"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
