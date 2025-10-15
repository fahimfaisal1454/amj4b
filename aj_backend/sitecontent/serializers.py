from rest_framework import serializers
from .models import (
    BannerSlide, AboutSection, Program, ImpactStat, Story, News, ContactMessage, ContactInfo
)

class BannerSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannerSlide
        fields = "__all__"

class BannerSlideAdminSerializer(serializers.ModelSerializer):
    # ensure proper coercion from multipart strings
    is_active = serializers.BooleanField(required=False)
    order = serializers.IntegerField(required=False)

    class Meta:
        model = BannerSlide
        fields = "__all__"

    def validate_cta_href(self, v):
        # Allow anchors (#about), relative (/news), or full URLs; reject spaces
        if v and " " in v:
            raise serializers.ValidationError("CTA link must not contain spaces")
        return v

class AboutSectionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AboutSection
        fields = ["id", "badge_text", "heading", "body", "image", "image_url", "updated_at"]
        extra_kwargs = {
            # If you prefer returning only URLs and not base64/files, you can set:
            "image": {"write_only": True, "required": False}
        }

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None

class ProjectSerializer(serializers.ModelSerializer):
    """
    Public serializer for 'projects' (uses Program model behind the scenes).
    """
    class Meta:
        model = Program
        fields = ["id", "title", "slug", "summary", "icon", "image", "is_active", "order"]

class ProjectAdminSerializer(serializers.ModelSerializer):
    """
    Admin serializer for 'projects' CRUD (still Program model).
    """
    image = serializers.ImageField(required=False, allow_null=True)
    icon = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Program
        fields = ["id", "title", "slug", "summary", "icon", "image", "is_active", "order"]
        
        
class ImpactStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStat
        fields = "__all__"

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = "__all__"

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = "__all__"

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ["email", "phone", "address", "hours", "updated_at"]