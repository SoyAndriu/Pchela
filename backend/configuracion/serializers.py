from rest_framework import serializers
from .models import (
    ConfiguracionInventario,
    ConfiguracionVentas,
    ConfiguracionCompras,
    ConfiguracionReportes,
    ConfiguracionNotificaciones,
    ConfiguracionSistema
)


class ConfiguracionInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionInventario
        fields = '__all__'


class ConfiguracionVentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionVentas
        fields = '__all__'


class ConfiguracionComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionCompras
        fields = '__all__'


class ConfiguracionReportesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionReportes
        fields = '__all__'


class ConfiguracionNotificacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionNotificaciones
        fields = '__all__'


class ConfiguracionSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionSistema
        fields = '__all__'
