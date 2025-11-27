from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConfiguracionInventarioViewSet,
    ConfiguracionVentasViewSet,
    ConfiguracionComprasViewSet,
    ConfiguracionReportesViewSet,
    ConfiguracionNotificacionesViewSet,
    ConfiguracionSistemaViewSet
)

router = DefaultRouter()
router.register(r'inventario', ConfiguracionInventarioViewSet, basename='config-inventario')
router.register(r'ventas', ConfiguracionVentasViewSet, basename='config-ventas')
router.register(r'compras', ConfiguracionComprasViewSet, basename='config-compras')
router.register(r'reportes', ConfiguracionReportesViewSet, basename='config-reportes')
router.register(r'notificaciones', ConfiguracionNotificacionesViewSet, basename='config-notificaciones')
router.register(r'sistema', ConfiguracionSistemaViewSet, basename='config-sistema')

urlpatterns = [
    path('', include(router.urls)),
]
