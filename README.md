# 🐍 Snake Docker - Servicio Telemático Web Containerizado

Servicio web telemático profesional del clásico juego Snake, completamente containerizado con Docker y servido a través de Nginx. Implementado como proyecto de telemática siguiendo principios de desarrollo continuo y despliegue en producción.

## 📋 Descripción del Proyecto

Este proyecto implementa un servicio web escalable usando contenedores Docker, cumpliendo con los estándares de producción para servicios telemáticos. El servidor web está desplegado bajo el concepto de desarrollo continuo y automatización completa mediante Dockerfile y docker-compose.

## 🎮 Características

- **Interfaz Moderna**: Diseño atractivo con gradientes, animaciones y efectos visuales
- **Sistema de Puntuación**: Marcador en tiempo real con almacenamiento de récord personal
- **Niveles de Dificultad**: 4 modos (Fácil, Media, Difícil, Extrema)
- **Sistema de Niveles**: El juego se vuelve más rápido conforme avanzas
- **Controles Intuitivos**: Soporte para flechas del teclado y teclas WASD
- **Responsive Design**: Se adapta a diferentes tamaños de pantalla
- **Dockerizado**: Fácil despliegue con Docker y Docker Compose

## 🚀 Características Técnicas

- **Frontend**: HTML5, CSS3, JavaScript puro (Vanilla JS)
- **Canvas API**: Para renderizado optimizado del juego
- **Servidor Web**: Nginx Alpine (imagen ligera)
- **Containerización**: Docker con docker-compose
- **LocalStorage**: Para persistencia del récord personal

## 📋 Requisitos Previos

### Para Servidor de Producción (Linux)
- Sistema operativo Linux (Ubuntu 20.04+, Debian, CentOS, etc.)
- Docker Engine instalado (versión 20.10+)
- Docker Compose instalado (versión 1.29+)
- Git instalado
- Conexión a internet para descargar la imagen base
- Puerto 8080 disponible (o el que desees configurar)

## 🔧 Despliegue en Servidor de Producción (Linux)

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio desde GitHub
git clone https://github.com/TU-USUARIO/snake-docker.git

# Entrar al directorio del proyecto
cd snake-docker
```

### Paso 2: Construcción y Despliegue Automatizado

El proyecto incluye archivos de automatización completa. Ejecuta:

```bash
# Construir y desplegar el servicio en modo producción
docker-compose up -d --build
```

Este comando:
- ✅ Descarga la imagen base de nginx:alpine
- ✅ Construye la imagen del servicio automáticamente
- ✅ Despliega el contenedor en segundo plano
- ✅ Configura el servidor web en el puerto 8080

### Paso 3: Verificar el Despliegue

```bash
# Verificar que el contenedor está corriendo
docker ps

# Ver logs del servicio
docker-compose logs -f
```

### Paso 4: Acceder al Servicio

El servicio estará disponible en:
- **Localhost**: `http://localhost:8080`
- **Red local**: `http://IP-DEL-SERVIDOR:8080`
- **Producción**: `http://DOMINIO-O-IP-PUBLICA:8080`

### Gestión del Servicio en Producción

```bash
# Detener el servicio
docker-compose down

# Reiniciar el servicio
docker-compose restart

# Ver estado del contenedor
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Actualizar el servicio (después de git pull)
git pull origin main
docker-compose up -d --build --force-recreate
```

## 🔄 Despliegue Alternativo con Docker (Sin docker-compose)

Si prefieres usar Docker directamente:

```bash
# 1. Construir la imagen desde el Dockerfile
docker build -t snake-docker:latest .

# 2. Ejecutar el contenedor en producción
docker run -d \
  --name snake-docker-container \
  --restart unless-stopped \
  -p 8080:80 \
  snake-docker:latest

# 3. Verificar el despliegue
docker logs snake-docker-container

# 4. Gestión del contenedor
docker stop snake-docker-container      # Detener
docker start snake-docker-container     # Iniciar
docker restart snake-docker-container   # Reiniciar
docker rm snake-docker-container        # Eliminar (primero detener)
```

## 🔒 Consideraciones de Seguridad para Producción

- El servicio corre en el puerto 8080 por defecto (puede cambiarse)
- Nginx incluye headers de seguridad básicos (X-Frame-Options, X-XSS-Protection)
- Para producción pública, se recomienda:
  - Usar un proxy inverso (nginx/Apache) con SSL/TLS
  - Configurar firewall para limitar acceso
  - Implementar rate limiting

## ⚙️ Escalabilidad del Servicio

El servicio puede escalarse fácilmente:

```bash
# Escalar a múltiples instancias
docker-compose up -d --scale snake-docker=3

# Con balanceador de carga (requiere configuración adicional)
# Se puede usar nginx como load balancer o Docker Swarm
```

## 🎯 Cómo Usar el Servicio

### Controles del Juego
- **Flechas del Teclado** (↑ ↓ ← →): Mover la serpiente
- **Teclas WASD**: Controles alternativos
- **Barra Espaciadora**: Iniciar juego o Pausar/Reanudar

### Objetivo
- Come la comida roja para crecer y ganar puntos
- Evita chocar con las paredes
- No te muerdas a ti mismo
- Alcanza la puntuación más alta posible

### Niveles de Dificultad
- 🟢 **Fácil**: Velocidad lenta, ideal para principiantes
- 🟡 **Media**: Velocidad moderada, equilibrio perfecto
- 🔴 **Difícil**: Velocidad alta, para jugadores experimentados
- 💀 **Extrema**: Velocidad máxima, solo para expertos

## 📁 Estructura del Proyecto

```
snake-docker/
├── index.html          # Interfaz HTML5 del servicio web
├── style.css           # Estilos CSS3 y animaciones
├── game.js             # Lógica JavaScript del cliente
├── Dockerfile          # Automatización de construcción de imagen
├── nginx.conf          # Configuración del servidor web Nginx
├── docker-compose.yml  # Orquestación y despliegue automatizado
└── README.md          # Documentación completa del proyecto
```

## 🏗️ Arquitectura del Servicio

```
┌─────────────────────────────────────┐
│  Cliente (Navegador Web)            │
│  http://servidor:8080               │
└──────────────┬──────────────────────┘
               │ HTTP Request
               ▼
┌─────────────────────────────────────┐
│  Snake-Docker Container             │
│  ┌───────────────────────────────┐  │
│  │  Nginx Web Server (Alpine)    │  │
│  │  - Sirve archivos estáticos   │  │
│  │  - Compresión Gzip           │  │
│  │  - Headers de seguridad       │  │
│  │  Puerto interno: 80           │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Archivos del Servicio        │  │
│  │  - index.html                 │  │
│  │  - style.css                  │  │
│  │  - game.js                    │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Puerto mapeado: 8080
               ▼
        Red del Servidor
```

## 🔍 Detalles Técnicos

### Docker
- **Imagen Base**: nginx:alpine (solo ~24MB)
- **Puerto Expuesto**: 80 (mapeado a 8080 en el host)
- **Volúmenes**: No se requieren, archivos copiados en tiempo de build

### Nginx
- **Compresión Gzip**: Habilitada para mejor rendimiento
- **Caché**: Configurado para archivos estáticos
- **Headers de Seguridad**: Protección básica incluida

### JavaScript
- **Canvas 2D**: Para renderizado del juego
- **LocalStorage**: Para guardar el récord personal
- **Sin dependencias**: JavaScript puro, sin frameworks

## 🌐 Acceso desde Otros Dispositivos

Para acceder al juego desde otros dispositivos en tu red local:

1. Encuentra tu IP local:
```bash
ipconfig  # En Windows
ifconfig  # En Linux/Mac
```

2. Accede desde otro dispositivo usando:
```
http://[TU_IP_LOCAL]:8080
```

## 🛠️ Personalización

### Cambiar el puerto
Edita `docker-compose.yml` y cambia el mapeo de puertos:
```yaml
ports:
  - "3000:80"  # Cambia 3000 por el puerto que prefieras
```

### Modificar colores
Edita `game.js` en la sección `COLORS`:
```javascript
const COLORS = {
    background: '#1a1a2e',
    snake: { head: '#38ef7d', body: '#11998e' },
    food: '#ff6b6b',
    // ... más colores
};
```

## 🐛 Solución de Problemas

### El contenedor no inicia
```bash
# Ver logs del contenedor
docker logs snake-game-container

# O con docker-compose
docker-compose logs
```

### Puerto 8080 ya está en uso
Cambia el puerto en `docker-compose.yml` a uno disponible (ej: 8081, 3000, etc.)

### El juego no se ve correctamente
- Limpia la caché del navegador (Ctrl + F5)
- Verifica que el contenedor esté corriendo: `docker ps`

## 📝 Comandos Útiles

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir la imagen
docker-compose up -d --build --force-recreate

# Entrar al contenedor
docker exec -it snake-game-container sh

# Ver uso de recursos
docker stats snake-game-container
```

## 🎓 Proyecto de Telemática

### Objetivos Cumplidos

✅ **Diseño de Servicio Telemático**: Servicio web escalable y funcional  
✅ **Implementación con Contenedores**: Docker + Nginx en producción  
✅ **Desarrollo Continuo**: Repositorio GitHub con automatización completa  
✅ **Documentación Completa**: README.MD con instrucciones de despliegue  
✅ **Automatización**: Dockerfile y docker-compose para construcción automática  
✅ **Servidor Web**: Nginx como servidor de producción  
✅ **Escalable**: Arquitectura lista para escalar horizontalmente  

### Propósito Académico

Este proyecto demuestra competencias en:
- Diseño e implementación de servicios telemáticos
- Containerización de aplicaciones web
- Despliegue en servidores de producción
- Automatización de procesos de construcción
- Gestión de servicios web escalables
- Desarrollo frontend con tecnologías estándar
- Prácticas DevOps y desarrollo continuo

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.

## 👨‍💻 Información del Proyecto

- **Curso**: Telemática
- **Tipo**: Servicio Web Containerizado
- **Tecnologías**: Docker, Nginx, HTML5, CSS3, JavaScript
- **Repositorio**: GitHub

## 👨‍💻 Desarrollo

Desarrollado con ❤️ como proyecto de demostración de telemática.


---

## 🎉 ¡Servicio Listo para Producción!

El servicio está completamente funcional y listo para ser desplegado en cualquier servidor Linux con Docker.

**Comandos rápidos para producción:**
```bash
git clone https://github.com/TU-USUARIO/snake-docker.git
cd snake-docker
docker-compose up -d --build
```

Accede al servicio en: `http://IP-SERVIDOR:8080`

¡Disfruta del servicio telemático! 🐍�🐳

