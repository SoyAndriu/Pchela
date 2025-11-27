from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from .models import Marca
from .serializers import MarcaSerializer

class MarcaViewSet(viewsets.ModelViewSet):
	queryset = Marca.objects.all()
	serializer_class = MarcaSerializer
	pagination_class = None  # Desactivar paginación para devolver todas las marcas
	filter_backends = [filters.SearchFilter]
	search_fields = ['nombre_marca']

	def destroy(self, request, *args, **kwargs):
		"""Prevenir eliminación de marca si tiene productos vinculados"""
		marca = self.get_object()
		
		# Verificar si hay productos vinculados
		productos_count = marca.productos.count()
		if productos_count > 0:
			return Response(
				{
					'detail': f'No se puede eliminar esta marca porque tiene {productos_count} producto(s) vinculado(s). Primero debes cambiar la marca de esos productos.'
				},
				status=status.HTTP_400_BAD_REQUEST
			)
		
		return super().destroy(request, *args, **kwargs)
