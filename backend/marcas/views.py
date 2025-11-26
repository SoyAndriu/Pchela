from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from .models import Marca
from .serializers import MarcaSerializer

class MarcaViewSet(viewsets.ModelViewSet):
	queryset = Marca.objects.all()
	serializer_class = MarcaSerializer
	pagination_class = None  # Desactivar paginación para devolver todas las marcas
	filter_backends = [filters.SearchFilter]
	search_fields = ['nombre_marca']
