from flask import Flask
from config import Config
from extensions import db
import models 

# Importar Blueprint
from main import main 

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