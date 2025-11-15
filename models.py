from extensions import db


class CentroVotacion(db.Model):
    __tablename__ = "centro_votacion"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)

    mesas = db.relationship("Mesa", backref="centro", lazy=True)


class Mesa(db.Model):
    __tablename__ = "mesa"

    id = db.Column(db.Integer, primary_key=True)
    centro_id = db.Column(db.Integer, db.ForeignKey("centro_votacion.id"))
    numero = db.Column(db.String(20), nullable=False)
    aula = db.Column(db.String(100))
    piso = db.Column(db.String(20))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
