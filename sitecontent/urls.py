from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BannerViewSet,
    AboutPublic, AboutSectionViewSet,
    WhatWeDoItemViewSet, JourneyEntryViewSet, NewsList, NewsItemViewSet, ProgramListView, StoryList, 
)

router = DefaultRouter()
router.register("banners", BannerViewSet, basename="banners")
router.register("about/manage", AboutSectionViewSet, basename="about-manage")          # optional (staff)
router.register("about/what-we-do", WhatWeDoItemViewSet, basename="about-whatwedo")   # optional (staff)
router.register("about/journey", JourneyEntryViewSet, basename="about-journey")       # optional (staff)
router.register("news/manage", NewsItemViewSet, basename="news-manage")

urlpatterns = [
    path("", include(router.urls)),
    path("about/", AboutPublic.as_view(), name="about-public"),  # single public JSON
    path("news/", NewsList.as_view(), name="news-list"),
    path("programs/", ProgramListView.as_view(), name="programs-list"),
    path("stories/", StoryList.as_view(), name="stories-list"),
]
