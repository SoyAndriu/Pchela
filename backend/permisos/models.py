from django.db import models
from django.contrib.auth.models import User


class PermisosEmpleado(models.Model):
    """
    Permisos granulares para empleados. 
    Define qué secciones del sistema puede acceder cada empleado.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='permisos_empleado',
        verbose_name='Usuario'
    )
    
    # Permisos por sección
    puede_ventas = models.BooleanField(
        default=True, 
        verbose_name='Acceso a Ventas',
        help_text='Permite acceder al módulo de ventas y realizar operaciones de venta'
    )
    puede_productos = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Productos',
        help_text='Permite ver y gestionar el catálogo de productos'
    )
    puede_clientes = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Clientes',
        help_text='Permite ver y gestionar información de clientes'
    )
    puede_compras = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Compras',
        help_text='Permite gestionar compras a proveedores'
    )
    puede_proveedores = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Proveedores',
        help_text='Permite ver y gestionar proveedores'
    )
    puede_lotes = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Lotes',
        help_text='Permite gestionar lotes de productos'
    )
    puede_marcas = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Marcas',
        help_text='Permite gestionar marcas de productos'
    )
    puede_reportes = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Reportes',
        help_text='Permite ver reportes y estadísticas del negocio'
    )
    puede_movimientos_caja = models.BooleanField(
        default=False, 
        verbose_name='Acceso a Movimientos de Caja',
        help_text='Permite ver y registrar movimientos de caja'
    )
    
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Permiso de Empleado'
        verbose_name_plural = 'Permisos de Empleados'
        ordering = ['user__username']

    def __str__(self):
        return f"Permisos de {self.user.username}"
