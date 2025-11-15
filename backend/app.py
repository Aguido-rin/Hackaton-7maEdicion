from flask import Flask
from backend.config import Config
from backend.extensions import db
import backend.models as models

# Importar Blueprint
from main.routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar base de datos
    db.init_app(app)

    # Registrar Blueprint
    app.register_blueprint(main)

    # Crear tablas si no existen
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)