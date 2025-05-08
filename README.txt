# Broker de Mensajes - Práctica 4 (Arquitectura Software)

Este proyecto implementa un sistema MOM (Message-Oriented Middleware) tipo RabbitMQ desde cero, usando Java. Soporta funcionalidades básicas y avanzadas como colas, productores, consumidores, durabilidad, fair dispatch, ACKs y gestión de colas.

## Estructura del proyecto

- `Broker.java`: Gestor principal que registra colas, publica mensajes y distribuye a consumidores.
- `Cola.java`: Representa una cola con soporte de mensajes persistentes, fair dispatch y timeout.
- `Mensaje.java`: Objeto contenedor para mensajes.
- `Productor.java`: Cliente que publica mensajes.
- `Consumidor.java`: Cliente que recibe mensajes mediante callbacks.
- `Main.java`: Escenario de pruebas. Incluye distintas versiones para probar funcionalidades específicas.

## Funcionalidades implementadas

✅ Declaración de colas  
✅ Publicación y consumo de mensajes  
✅ Callback en consumidores  
✅ Distribución round robin entre consumidores  
✅ Fair dispatch: no se entrega a consumidores ocupados  
✅ Mensajes expirados tras 5 minutos si no se consumen  
✅ Persistencia en disco por cola  
✅ Recuperación de mensajes tras reinicio (durabilidad)  
✅ Listado y eliminación de colas  
✅ ACK para confirmar procesamiento correcto  
✅ Manejo de publicaciones en colas inexistentes (descartadas)

## Cómo probar

### 1. Ejecutar `Main.java` para publicar mensajes

Ejecuta el programa y publica mensajes en colas como "eventos", "logs", o "errores". Puedes simular errores, múltiples consumidores, y publicar en colas inexistentes.

### 2. Comprobar durabilidad

- Ejecuta el `Main.java` de prueba de durabilidad (solo declara cola y escucha).
- Observa cómo se recuperan los mensajes automáticamente desde disco.

### 3. Ver archivos persistentes

Los archivos `.txt` como `cola_eventos.txt` se generan en el directorio del proyecto.

## Autores: Miguel Sabroso Sanz y Daniel Salas Sayas
Universidad de Zaragoza - Arquitectura Software (Curso 2024/25)