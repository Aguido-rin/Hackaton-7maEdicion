from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Instancias de las extensiones sin inicializar
db = SQLAlchemy()
migrate = Migrate()