# core/settings.py
from pathlib import Path
from datetime import timedelta
import os

# -------------------------------------------------------------
# BASE DIRECTORY
# -------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------------------------------------
# SECURITY SETTINGS
# -------------------------------------------------------------
SECRET_KEY = "django-insecure-change-this-before-production"
DEBUG = True  # For local dev. Set to False in production.

ALLOWED_HOSTS = [
    "36.50.41.161",
    "amarjashore.org.bd",
    "www.amarjashore.org.bd",
    "127.0.0.1",
    "localhost",
]

# -------------------------------------------------------------
# APPLICATIONS
# -------------------------------------------------------------
INSTALLED_APPS = [
    # Django core
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Local apps
    "sitecontent",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",

    # CORS middleware (must be before CommonMiddleware)
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# -------------------------------------------------------------
# DATABASE (SQLite for development)
# -------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# -------------------------------------------------------------
# PASSWORD VALIDATORS
# -------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------------------------------------------
# INTERNATIONALIZATION
# -------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Dhaka"
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------
# STATIC & MEDIA FILES
# -------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -------------------------------------------------------------
# DJANGO REST FRAMEWORK
# -------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Public read-only by default; protected writes handled in views
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# JWT token lifetimes (reasonable defaults)
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}

# -------------------------------------------------------------
# CORS CONFIG
# -------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "https://amarjashore.org.bd",
    "https://www.amarjashore.org.bd",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True

# -------------------------------------------------------------
# CSRF CONFIG
# -------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://amarjashore.org.bd",
    "https://www.amarjashore.org.bd",
    "http://36.50.41.161",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# -------------------------------------------------------------
# SECURITY HEADERS
# -------------------------------------------------------------
SECURE_SSL_REDIRECT = False          # True after HTTPS enabled
SESSION_COOKIE_SECURE = False        # True after HTTPS
CSRF_COOKIE_SECURE = False           # True after HTTPS
SECURE_HSTS_SECONDS = 0              # Increase after HTTPS setup
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
