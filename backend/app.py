from flask import Flask
from config import Config
from extensions import db
from flask_migrate import Migrate   # <-- IMPORTANTE
import models  # <-- Se importa SIN alias para que Migrate detecte todos los modelos

# Importar Blueprint
from main.routes import main


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
    app.run(debug=True)
