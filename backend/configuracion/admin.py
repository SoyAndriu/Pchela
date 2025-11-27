from django.contrib import admin
from .models import (
    ConfiguracionInventario,
    ConfiguracionVentas,
    ConfiguracionCompras,
    ConfiguracionReportes,
    ConfiguracionNotificaciones,
    ConfiguracionSistema
)


@admin.register(ConfiguracionInventario)
class ConfiguracionInventarioAdmin(admin.ModelAdmin):
    list_display = ['stock_minimo_alerta', 'dias_alerta_vencimiento', 'permitir_stock_negativo']


@admin.register(ConfiguracionVentas)
class ConfiguracionVentasAdmin(admin.ModelAdmin):
    list_display = ['descuento_maximo', 'permitir_ventas_credito', 'limite_credito_default']


@admin.register(ConfiguracionCompras)
class ConfiguracionComprasAdmin(admin.ModelAdmin):
    list_display = ['aprobacion_requerida_monto', 'proveedor_requerido', 'dias_alerta_pago']


@admin.register(ConfiguracionReportes)
class ConfiguracionReportesAdmin(admin.ModelAdmin):
    list_display = ['periodo_reporte_default', 'incluir_graficos', 'top_productos_count']


@admin.register(ConfiguracionNotificaciones)
class ConfiguracionNotificacionesAdmin(admin.ModelAdmin):
    list_display = ['notificar_stock_bajo', 'notificar_productos_vencidos', 'notificar_pagos_pendientes']


@admin.register(ConfiguracionSistema)
class ConfiguracionSistemaAdmin(admin.ModelAdmin):
    list_display = ['nombre_empresa', 'moneda', 'zona_horaria']
