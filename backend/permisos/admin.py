from django.contrib import admin
from .models import PermisosEmpleado


@admin.register(PermisosEmpleado)
class PermisosEmpleadoAdmin(admin.ModelAdmin):
    list_display = ['user', 'puede_ventas', 'puede_productos', 'puede_clientes', 'puede_reportes']
    list_filter = ['puede_ventas', 'puede_productos', 'puede_clientes', 'puede_reportes']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Permisos de Acceso', {
            'fields': (
                'puede_ventas',
                'puede_productos',
                'puede_clientes',
                'puede_compras',
                'puede_proveedores',
                'puede_lotes',
                'puede_marcas',
                'puede_reportes',
                'puede_movimientos_caja',
            )
        }),
        ('Información', {
            'fields': ('creado', 'actualizado'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['creado', 'actualizado']
