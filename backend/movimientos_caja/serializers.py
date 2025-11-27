from rest_framework import serializers
from .models import Caja, MovimientoDeCaja
from tipo_movimientos.models import TipoMovimiento
from tipo_pago.models import TipoPago


class CajaEventSerializer(serializers.Serializer):
    """Serializer para eventos de apertura/cierre de caja"""
    id = serializers.IntegerField()
    tipo = serializers.CharField()  # 'apertura' o 'cierre'
    fecha = serializers.DateTimeField()
    empleado_nombre = serializers.CharField()
    monto = serializers.DecimalField(max_digits=10, decimal_places=2)
    descripcion = serializers.CharField()
    numero_caja = serializers.CharField()


class CajaSerializer(serializers.ModelSerializer):
    saldo_actual = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    saldo_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    saldo_efectivo = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Caja
        fields = [
            'id', 'empleado_apertura', 'fecha_apertura', 'monto_inicial',
            'empleado_cierre', 'fecha_cierre', 'estado',
            'closing_counted_amount', 'closing_system_amount', 'difference_amount',
            'notas', 'saldo_actual', 'saldo_total', 'saldo_efectivo'
        ]
        read_only_fields = ['id', 'fecha_apertura', 'empleado_cierre', 'fecha_cierre', 'estado', 'saldo_actual']


class MovimientoDeCajaSerializer(serializers.ModelSerializer):
    id_tipo_pago_nombre = serializers.SerializerMethodField(read_only=True)
    empleado_nombre = serializers.SerializerMethodField(read_only=True)
    medio_pago_display = serializers.SerializerMethodField(read_only=True)
    afecta_caja = serializers.SerializerMethodField(read_only=True)
    # Campos de usabilidad (Opción A): aceptar strings en creación
    tipo_movimiento = serializers.CharField(write_only=True, required=False)
    medio_pago = serializers.CharField(write_only=True, required=False)
    # Alias camelCase que puede enviar el front
    tipoMovimiento = serializers.CharField(write_only=True, required=False)
    medioPago = serializers.CharField(write_only=True, required=False)
    refType = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    refId = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    # Evitar ChoiceField estricto en 'origen' para permitir normalización
    origen = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    # Declarar FKs explícitas como no requeridas
    id_tipo_movimiento = serializers.PrimaryKeyRelatedField(queryset=TipoMovimiento.objects.all(), required=False, allow_null=True)
    id_tipo_pago = serializers.PrimaryKeyRelatedField(queryset=TipoPago.objects.all(), required=False, allow_null=True)
    class Meta:
        model = MovimientoDeCaja
        fields = [
            'id', 'caja', 'fecha_movimiento', 'hora', 'created_at', 'monto', 'descripcion',
            'empleado', 'empleado_nombre', 'created_by', 'id_tipo_movimiento', 'id_tipo_pago', 
            'id_tipo_pago_nombre', 'medio_pago_display',
            'tipo', 'origen', 'ref_type', 'ref_id', 'ajuste_sign', 'status', 'reversed_of', 'reversado_por',
            'afecta_caja', 'tipo_movimiento', 'medio_pago', 'tipoMovimiento', 'medioPago', 'refType', 'refId'
        ]
        read_only_fields = ['id', 'fecha_movimiento', 'hora', 'created_at', 'status', 'reversed_of', 'reversado_por', 'created_by']
        extra_kwargs = {
            'id_tipo_movimiento': {'required': False},
            'id_tipo_pago': {'required': False},
            'caja': {'required': False},
        }

    def get_id_tipo_pago_nombre(self, obj):
        try:
            return obj.id_tipo_pago.nombre_tipo_pago.upper() if obj.id_tipo_pago else None
        except Exception:
            return None

    def get_empleado_nombre(self, obj):
        try:
            if obj.empleado:
                return f"{obj.empleado.nombre} {obj.empleado.apellido}".strip()
            return None
        except Exception:
            return None
    
    def get_medio_pago_display(self, obj):
        try:
            return obj.id_tipo_pago.nombre_tipo_pago if obj.id_tipo_pago else None
        except Exception:
            return None

    def get_afecta_caja(self, obj):
        nombre = self.get_id_tipo_pago_nombre(obj)
        return True if nombre == 'EFECTIVO' else False

    def validate_monto(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("monto debe ser > 0")
        return value

    def validate_origen(self, value):
        if value in (None, ""):
            return value
        val = str(value).upper()
        allowed = {"VENTA", "COMPRA", "DEVOLUCION", "APERTURA", "CIERRE", "MANUAL", "AJUSTE_MANUAL"}
        if val not in allowed:
            raise serializers.ValidationError(f"origen inválido: {value}")
        return val

    def create(self, validated_data):
        # Remover campos write_only/alias que no existen en el modelo
        for k in [
            'tipo_movimiento', 'medio_pago', 'tipoMovimiento', 'medioPago', 'refType', 'refId'
        ]:
            validated_data.pop(k, None)
        return super().create(validated_data)
