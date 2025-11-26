from django.core.management.base import BaseCommand
from core.models import EmpleadoProfile


class Command(BaseCommand):
    help = 'Sincroniza el estado activo de EmpleadoProfile con User.is_active'

    def handle(self, *args, **options):
        empleados = EmpleadoProfile.objects.select_related('user').all()
        sincronizados = 0
        
        for empleado in empleados:
            if empleado.user.is_active != empleado.activo:
                empleado.user.is_active = empleado.activo
                empleado.user.save(update_fields=['is_active'])
                sincronizados += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Sincronizado: {empleado.nombre} {empleado.apellido} - '
                        f'activo={empleado.activo}'
                    )
                )
        
        if sincronizados == 0:
            self.stdout.write(self.style.SUCCESS('Todos los empleados ya están sincronizados'))
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Total sincronizados: {sincronizados} de {empleados.count()}'
                )
            )
