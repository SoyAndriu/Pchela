from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PermisosEmpleadoViewSet

router = DefaultRouter()
router.register(r'permisos', PermisosEmpleadoViewSet, basename='permisos')

urlpatterns = [
    path('', include(router.urls)),
]
