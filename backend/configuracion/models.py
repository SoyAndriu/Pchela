from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class ConfiguracionInventario(models.Model):
    """Configuración de alertas y gestión de inventario"""
    stock_minimo_alerta = models.IntegerField(
        default=10,
        validators=[MinValueValidator(0)],
        help_text="Cantidad mínima de productos antes de alertar"
    )
    dias_alerta_vencimiento = models.IntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        help_text="Días antes del vencimiento para mostrar alerta"
    )
    permitir_stock_negativo = models.BooleanField(
        default=False,
        help_text="Permitir ventas cuando no hay stock suficiente"
    )
    actualizar_precios_automatico = models.BooleanField(
        default=False,
        help_text="Actualizar precios de venta automáticamente según costo + margen"
    )
    margen_ganancia_default = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=30.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Margen de ganancia por defecto (%)"
    )
    
    class Meta:
        verbose_name = "Configuración de Inventario"
        verbose_name_plural = "Configuración de Inventario"
    
    def __str__(self):
        return "Configuración de Inventario"


class ConfiguracionVentas(models.Model):
    """Configuración de políticas de ventas"""
    descuento_maximo = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=20.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Descuento máximo permitido (%)"
    )
    permitir_ventas_credito = models.BooleanField(
        default=True,
        help_text="Permitir ventas a crédito (cuenta corriente)"
    )
    limite_credito_default = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=10000.00,
        validators=[MinValueValidator(0)],
        help_text="Límite de cuenta corriente por defecto para nuevos clientes"
    )
    dias_credito_default = models.IntegerField(
        default=30,
        validators=[MinValueValidator(1)],
        help_text="Días de crédito por defecto"
    )
    permitir_precios_personalizados = models.BooleanField(
        default=False,
        help_text="Permitir modificar precios durante la venta"
    )
    
    class Meta:
        verbose_name = "Configuración de Ventas"
        verbose_name_plural = "Configuración de Ventas"
    
    def __str__(self):
        return "Configuración de Ventas"


class ConfiguracionCompras(models.Model):
    """Configuración de políticas de compras"""
    aprobacion_requerida_monto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50000.00,
        validators=[MinValueValidator(0)],
        help_text="Monto mínimo para requerir aprobación"
    )
    proveedor_requerido = models.BooleanField(
        default=True,
        help_text="Requerir proveedor al registrar compra"
    )
    dias_alerta_pago = models.IntegerField(
        default=7,
        validators=[MinValueValidator(1)],
        help_text="Días antes del vencimiento para alertar pago pendiente"
    )
    permitir_compra_producto_inactivo = models.BooleanField(
        default=False,
        help_text="Permitir comprar productos marcados como inactivos"
    )
    
    class Meta:
        verbose_name = "Configuración de Compras"
        verbose_name_plural = "Configuración de Compras"
    
    def __str__(self):
        return "Configuración de Compras"


class ConfiguracionReportes(models.Model):
    """Configuración de reportes y análisis"""
    PERIODO_CHOICES = [
        ('diario', 'Diario'),
        ('semanal', 'Semanal'),
        ('mensual', 'Mensual'),
    ]
    
    periodo_reporte_default = models.CharField(
        max_length=10,
        choices=PERIODO_CHOICES,
        default='mensual',
        help_text="Período por defecto para generar reportes"
    )
    incluir_graficos = models.BooleanField(
        default=True,
        help_text="Incluir gráficos en reportes exportados"
    )
    top_productos_count = models.IntegerField(
        default=10,
        validators=[MinValueValidator(1)],
        help_text="Cantidad de productos a mostrar en 'Top Productos'"
    )
    enviar_reporte_email = models.BooleanField(
        default=False,
        help_text="Enviar reporte automático por email"
    )
    email_destinatarios = models.TextField(
        blank=True,
        help_text="Emails separados por comas para envío de reportes"
    )
    
    class Meta:
        verbose_name = "Configuración de Reportes"
        verbose_name_plural = "Configuración de Reportes"
    
    def __str__(self):
        return "Configuración de Reportes"


class ConfiguracionNotificaciones(models.Model):
    """Configuración de alertas y notificaciones"""
    notificar_stock_bajo = models.BooleanField(
        default=True,
        help_text="Notificar cuando el stock esté bajo"
    )
    notificar_productos_vencidos = models.BooleanField(
        default=True,
        help_text="Notificar productos próximos a vencer"
    )
    notificar_pagos_pendientes = models.BooleanField(
        default=True,
        help_text="Notificar pagos pendientes a proveedores"
    )
    notificar_creditos_vencidos = models.BooleanField(
        default=True,
        help_text="Notificar créditos de clientes vencidos"
    )
    notificar_nueva_venta = models.BooleanField(
        default=False,
        help_text="Notificar cada nueva venta registrada"
    )
    notificar_cierre_caja = models.BooleanField(
        default=True,
        help_text="Notificar al cerrar caja con diferencias"
    )
    
    class Meta:
        verbose_name = "Configuración de Notificaciones"
        verbose_name_plural = "Configuración de Notificaciones"
    
    def __str__(self):
        return "Configuración de Notificaciones"


class ConfiguracionSistema(models.Model):
    """Configuración general del sistema"""
    nombre_empresa = models.CharField(
        max_length=200,
        default="Pchela Belén",
        help_text="Nombre de la empresa"
    )
    rut_empresa = models.CharField(
        max_length=20,
        blank=True,
        help_text="RUT/NIT de la empresa"
    )
    direccion = models.CharField(
        max_length=300,
        blank=True,
        help_text="Dirección de la empresa"
    )
    telefono = models.CharField(
        max_length=50,
        blank=True,
        help_text="Teléfono de contacto"
    )
    email_contacto = models.EmailField(
        blank=True,
        help_text="Email de contacto"
    )
    moneda = models.CharField(
        max_length=3,
        default="ARS",
        help_text="Código de moneda (ARS, USD, etc.)"
    )
    zona_horaria = models.CharField(
        max_length=50,
        default="America/Argentina/Buenos_Aires",
        help_text="Zona horaria del sistema"
    )
    formato_fecha = models.CharField(
        max_length=20,
        default="DD/MM/YYYY",
        help_text="Formato de visualización de fechas"
    )
    idioma = models.CharField(
        max_length=5,
        default="es",
        help_text="Idioma del sistema"
    )
    
    class Meta:
        verbose_name = "Configuración del Sistema"
        verbose_name_plural = "Configuración del Sistema"
    
    def __str__(self):
        return "Configuración del Sistema"
