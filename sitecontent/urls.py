# sitecontent/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    # public read endpoints
    AboutPublic,
    NewsList,
    ProgramListView,
    StoryList,
    ContactInfoView,

    # admin/manage viewsets
    BannerViewSet,
    AboutSectionViewSet,
    WhatWeDoItemViewSet,
    JourneyEntryViewSet,
    NewsItemViewSet,
    ProgramViewSet,
    StoryViewSet,
    ContactInfoViewSet,

    # contact messages (admin GET + public POST on same URL)
    ContactMessageListCreate,
)

router = DefaultRouter()

# --- manage (admin) routes ---
router.register("banners", BannerViewSet, basename="banners")
router.register("about/manage", AboutSectionViewSet, basename="about-manage")
router.register("about/what-we-do", WhatWeDoItemViewSet, basename="about-whatwedo")
router.register("about/journey", JourneyEntryViewSet, basename="about-journey")

router.register("news/manage", NewsItemViewSet, basename="news-manage")
router.register("programs/manage", ProgramViewSet, basename="programs-manage")
router.register("stories/manage", StoryViewSet, basename="stories-manage")

router.register("contact-info/manage", ContactInfoViewSet, basename="contactinfo-manage")

urlpatterns = [
    # router-based manage endpoints
    path("", include(router.urls)),

    # public read endpoints
    path("about/", AboutPublic.as_view(), name="about-public"),
    path("news/", NewsList.as_view(), name="news-public"),
    path("programs/", ProgramListView.as_view(), name="programs-public"),
    path("stories/", StoryList.as_view(), name="stories-public"),
    path("contact-info/", ContactInfoView.as_view(), name="contactinfo-public"),

    # contact messages: GET (admins) + POST (public) on the SAME URL
    path("contact/", ContactMessageListCreate.as_view(), name="contact-list-create"),
]
