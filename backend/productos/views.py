from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
	queryset = Categoria.objects.all().order_by('nombre')
	serializer_class = CategoriaSerializer
	permission_classes = [permissions.IsAuthenticated]
	pagination_class = None  # Desactivar paginación para devolver todas las categorías

	def destroy(self, request, *args, **kwargs):
		"""Prevenir eliminación de categoría si tiene productos vinculados"""
		categoria = self.get_object()
		
		# Verificar si hay productos vinculados
		productos_count = categoria.productos.count()
		if productos_count > 0:
			return Response(
				{
					'detail': f'No se puede eliminar esta categoría porque tiene {productos_count} producto(s) vinculado(s). Primero debes cambiar la categoría de esos productos.'
				},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		return super().destroy(request, *args, **kwargs)
