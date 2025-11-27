from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import PermisosEmpleado
from .serializers import PermisosEmpleadoSerializer, PermisosSimpleSerializer


class PermisosEmpleadoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de permisos de empleados.
    Solo accesible por gerentes.
    """
    queryset = PermisosEmpleado.objects.all()
    serializer_class = PermisosEmpleadoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Solo mostrar permisos de empleados (usuarios en grupo empleado)
        user = self.request.user
        
        # Si es gerente, mostrar todos los permisos de empleados
        if user.groups.filter(name='gerente').exists():
            # Filtrar solo usuarios que están en el grupo empleado
            empleados_ids = User.objects.filter(groups__name='empleado').values_list('id', flat=True)
            return PermisosEmpleado.objects.filter(user_id__in=empleados_ids)
        
        # Si es empleado, solo ver sus propios permisos
        return PermisosEmpleado.objects.filter(user=user)
    
    def create(self, request, *args, **kwargs):
        # Verificar que es gerente
        if not request.user.groups.filter(name='gerente').exists():
            return Response(
                {'detail': 'No tiene permisos para crear permisos de empleados.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Verificar que es gerente
        if not request.user.groups.filter(name='gerente').exists():
            return Response(
                {'detail': 'No tiene permisos para modificar permisos de empleados.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Verificar que es gerente
        if not request.user.groups.filter(name='gerente').exists():
            return Response(
                {'detail': 'No tiene permisos para eliminar permisos de empleados.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], url_path='mis-permisos')
    def mis_permisos(self, request):
        """
        Endpoint para que cualquier empleado obtenga sus propios permisos.
        GET /api/permisos/mis-permisos/
        """
        user = request.user
        
        # Si es gerente, devolver todos los permisos como True
        if user.groups.filter(name='gerente').exists():
            return Response({
                'puede_ventas': True,
                'puede_productos': True,
                'puede_clientes': True,
                'puede_compras': True,
                'puede_proveedores': True,
                'puede_lotes': True,
                'puede_marcas': True,
                'puede_reportes': True,
                'puede_movimientos_caja': True,
                'es_gerente': True,
            })
        
        # Si es empleado, buscar sus permisos (crear si no existen)
        permisos, created = PermisosEmpleado.objects.get_or_create(
            user=user,
            defaults={
                'puede_ventas': True,  # Por defecto, solo ventas
                'puede_productos': False,
                'puede_clientes': False,
                'puede_compras': False,
                'puede_proveedores': False,
                'puede_lotes': False,
                'puede_marcas': False,
                'puede_reportes': False,
                'puede_movimientos_caja': False,
            }
        )
        
        serializer = PermisosSimpleSerializer(permisos)
        data = serializer.data
        data['es_gerente'] = False
        return Response(data)
