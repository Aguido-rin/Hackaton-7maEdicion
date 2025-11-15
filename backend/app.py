from flask import Flask
from config import Config
from extensions import db
from flask_migrate import Migrate   # <-- IMPORTANTE
import models  # <-- Se importa SIN alias para que Migrate detecte todos los modelos
import socket

# Importar Blueprint
from main.routes import main


def get_local_ip():
    """
    Detecta automáticamente la IP local de la máquina
    basándose en la red a la que está conectada.
    """
    try:
        # Crear socket para determinar la IP local
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Conectarse a un servidor remoto (no necesita estar disponible)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception as e:
        print(f"Error al detectar IP: {e}")
        return "127.0.0.1"


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB
    db.init_app(app)

    # Inicializar Flask-Migrate (ahora sí tienes comandos flask db)
    migrate = Migrate(app, db)

    # Registrar Blueprint
    app.register_blueprint(main)

    return app


# Se expone la app para flask --app
app = create_app()

if __name__ == "__main__":
    local_ip = get_local_ip()
    port = 5000
    
    print("\n" + "="*70)
    print("🚀 SERVIDOR FLASK INICIADO")
    print("="*70)
    print(f"📍 IP Local Detectada: {local_ip}")
    print(f"🔌 Puerto: {port}")
    print(f"\n✅ Acceso en tu red: http://{local_ip}:{port}")
    print(f"✅ Acceso local: http://localhost:{port}")
    print(f"✅ API de Centros: http://{local_ip}:{port}/api/centros")
    print(f"✅ API de Partidos: http://{local_ip}:{port}/api/partidos")
    print("="*70 + "\n")
    
    # Ejecutar en 0.0.0.0 para escuchar en todas las interfaces de red
    app.run(host="0.0.0.0", port=port, debug=True)
