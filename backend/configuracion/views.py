from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import (
    ConfiguracionInventario,
    ConfiguracionVentas,
    ConfiguracionCompras,
    ConfiguracionReportes,
    ConfiguracionNotificaciones,
    ConfiguracionSistema
)
from .serializers import (
    ConfiguracionInventarioSerializer,
    ConfiguracionVentasSerializer,
    ConfiguracionComprasSerializer,
    ConfiguracionReportesSerializer,
    ConfiguracionNotificacionesSerializer,
    ConfiguracionSistemaSerializer
)


class ConfiguracionInventarioViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionInventario.objects.all()
    serializer_class = ConfiguracionInventarioSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración de inventario (singleton)"""
        config, created = ConfiguracionInventario.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración de inventario"""
        config, created = ConfiguracionInventario.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConfiguracionVentasViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionVentas.objects.all()
    serializer_class = ConfiguracionVentasSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración de ventas (singleton)"""
        config, created = ConfiguracionVentas.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración de ventas"""
        config, created = ConfiguracionVentas.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConfiguracionComprasViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionCompras.objects.all()
    serializer_class = ConfiguracionComprasSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración de compras (singleton)"""
        config, created = ConfiguracionCompras.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración de compras"""
        config, created = ConfiguracionCompras.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConfiguracionReportesViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionReportes.objects.all()
    serializer_class = ConfiguracionReportesSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración de reportes (singleton)"""
        config, created = ConfiguracionReportes.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración de reportes"""
        config, created = ConfiguracionReportes.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConfiguracionNotificacionesViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionNotificaciones.objects.all()
    serializer_class = ConfiguracionNotificacionesSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración de notificaciones (singleton)"""
        config, created = ConfiguracionNotificaciones.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración de notificaciones"""
        config, created = ConfiguracionNotificaciones.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConfiguracionSistemaViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionSistema.objects.all()
    serializer_class = ConfiguracionSistemaSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def obtener(self, request):
        """Obtiene o crea la configuración del sistema (singleton)"""
        config, created = ConfiguracionSistema.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def actualizar(self, request):
        """Actualiza la configuración del sistema"""
        config, created = ConfiguracionSistema.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
