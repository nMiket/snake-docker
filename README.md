# 🐍 Snake Docker

Juego Snake clásico servido a través de Docker y Nginx.

**Examen docker telematica**  
**Por:** Andres Felipe Martinez Taborda

![Vista del juego](imagenes%20funcionamiento/Vista%20del%20juego%20en%20localhost.jpg)

## 🚀 Cómo ejecutar el proyecto

Ejecuta estos comandos en tu terminal de Linux:

```bash
sudo git clone https://github.com/nMiket/snake-docker.git
cd snake-docker
sudo docker build -t snake-docker:latest .
sudo docker run -d -p 80:80 snake-docker:latest
```

![Comandos de ejecución](imagenes%20funcionamiento/Comandos%20de%20ejecucion.jpg)

Luego abre tu navegador en: **http://localhost**

---

## 📦 ¿Qué hace cada archivo?

### Dockerfile
El `Dockerfile` contiene las instrucciones para construir la imagen Docker:
- Usa `nginx:alpine` como imagen base (servidor web ligero)
- Copia los archivos del juego (`index.html`, `style.css`, `game.js`) al servidor
- Copia la configuración personalizada de Nginx
- Expone el puerto 80 para acceder al juego

### docker-compose.yml
El `docker-compose.yml` automatiza todo el proceso:
- Construye la imagen automáticamente
- Crea y ejecuta el contenedor
- Mapea el puerto 80 del contenedor al puerto 80 de tu máquina
- Configura reinicio automático si el contenedor falla

**Para usar docker-compose en lugar de los comandos manuales:**
```bash
git clone https://github.com/nMiket/snake-docker.git
cd snake-docker
sudo docker-compose up -d
```

### nginx.conf
Nginx es el servidor web que sirve los archivos del juego. La configuración incluye:
- Compresión Gzip para archivos más ligeros
- Configuración de caché para mejor rendimiento
- Headers de seguridad básicos

---

## � Cómo jugar

### Controles
- **Flechas del teclado** (↑ ↓ ← →) o **WASD**: Mover la serpiente
- **Barra Espaciadora**: Iniciar/Pausar el juego

### Objetivo
- Come la comida roja para crecer y ganar puntos
- Evita chocar con las paredes y contigo mismo
- Supera tu récord personal

### Niveles de Dificultad
- 🟢 **Fácil**: Velocidad lenta
- 🟡 **Media**: Velocidad moderada
- 🔴 **Difícil**: Velocidad rápida
- 💀 **Extrema**: Velocidad muy rápida

El juego guarda automáticamente tu récord más alto en el navegador.

---

## 🛠️ Comandos útiles

```bash
# Ver contenedores en ejecución
sudo docker ps

# Ver logs del contenedor
sudo docker logs <container_id>

# Detener el contenedor
sudo docker stop <container_id>

# Eliminar el contenedor
sudo docker rm <container_id>
```

---

## 📁 Estructura del proyecto

```
snake-docker/
├── index.html          # Interfaz del juego
├── style.css           # Estilos y animaciones
├── game.js             # Lógica del juego
├── Dockerfile          # Instrucciones para construir la imagen
├── nginx.conf          # Configuración del servidor Nginx
├── docker-compose.yml  # Automatización del despliegue
└── README.md          # Este archivo
```

---

**Tecnologías**: Docker • Nginx • HTML5 • CSS3 • JavaScript

