from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PermisosEmpleado


class PermisosEmpleadoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    nombre_completo = serializers.SerializerMethodField()
    
    class Meta:
        model = PermisosEmpleado
        fields = [
            'id',
            'user',
            'username',
            'nombre_completo',
            'puede_ventas',
            'puede_productos',
            'puede_clientes',
            'puede_compras',
            'puede_proveedores',
            'puede_lotes',
            'puede_marcas',
            'puede_reportes',
            'puede_movimientos_caja',
            'creado',
            'actualizado',
        ]
        read_only_fields = ['id', 'creado', 'actualizado']
    
    def get_nombre_completo(self, obj):
        user = obj.user
        if hasattr(user, 'empleado_profile'):
            perfil = user.empleado_profile
            return f"{perfil.nombre} {perfil.apellido}"
        return user.get_full_name() or user.username


class PermisosSimpleSerializer(serializers.ModelSerializer):
    """Serializer simplificado solo con los permisos boolean, sin info del user"""
    class Meta:
        model = PermisosEmpleado
        fields = [
            'puede_ventas',
            'puede_productos',
            'puede_clientes',
            'puede_compras',
            'puede_proveedores',
            'puede_lotes',
            'puede_marcas',
            'puede_reportes',
            'puede_movimientos_caja',
        ]
