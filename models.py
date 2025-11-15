# =========================
# GEOLOCALIZACIÓN (PUNTO 3)
# =========================
from extensions import db

class CentroVotacion(db.Model):
    __tablename__ = "centro_votacion"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)

    mesas = db.relationship("Mesa", backref="centro", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "lat": self.lat,
            "lon": self.lon,
        }


class Mesa(db.Model):
    __tablename__ = "mesa"

    id = db.Column(db.Integer, primary_key=True)
    centro_id = db.Column(
        db.Integer,
        db.ForeignKey("centro_votacion.id"),
        nullable=False
    )
    numero = db.Column(db.String(20), nullable=False)
    aula = db.Column(db.String(100))
    piso = db.Column(db.String(20))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "centro_id": self.centro_id,
            "numero": self.numero,
            "aula": self.aula,
            "piso": self.piso,
            "lat": self.lat,
            "lon": self.lon,
        }


# =========================
# PUNTO 2: INFO POLÍTICA
# =========================

class Eleccion(db.Model):
    __tablename__ = "elecciones"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)   # EG 2026
    tipo = db.Column(db.String(50), nullable=False)      # general, regional...
    anio = db.Column(db.Integer, nullable=False)

    agrupaciones = db.relationship("AgrupacionPolitica", backref="eleccion", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "anio": self.anio,
        }


class AgrupacionPolitica(db.Model):
    __tablename__ = "agrupaciones_politicas"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    sigla = db.Column(db.String(50), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)      # partido, alianza…
    id_eleccion = db.Column(db.Integer, db.ForeignKey("elecciones.id"), nullable=False)

    planes = db.relationship("PlanGobierno", backref="agrupacion", lazy=True)
    candidatos = db.relationship("Candidato", backref="agrupacion", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "sigla": self.sigla,
            "tipo": self.tipo,
            "id_eleccion": self.id_eleccion,
        }


class PlanGobierno(db.Model):
    __tablename__ = "planes_gobierno"

    id = db.Column(db.Integer, primary_key=True)
    id_agrupacion = db.Column(db.Integer,
                              db.ForeignKey("agrupaciones_politicas.id"),
                              nullable=False)
    id_eleccion = db.Column(db.Integer,
                            db.ForeignKey("elecciones.id"),
                            nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    url_pdf = db.Column(db.String(500), nullable=False)

    sectores = db.relationship("PlanSector", backref="plan", lazy=True)

    def to_dict(self, include_sectores=False):
        data = {
            "id": self.id,
            "id_agrupacion": self.id_agrupacion,
            "id_eleccion": self.id_eleccion,
            "titulo": self.titulo,
            "url_pdf": self.url_pdf,
        }
        if include_sectores:
            data["sectores"] = [s.to_dict() for s in self.sectores]
        return data


class PlanSector(db.Model):
    __tablename__ = "planes_sectores"

    id = db.Column(db.Integer, primary_key=True)
    id_plan = db.Column(db.Integer, db.ForeignKey("planes_gobierno.id"), nullable=False)
    sector = db.Column(db.String(100), nullable=False)   # Salud, Educación…
    resumen = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "id_plan": self.id_plan,
            "sector": self.sector,
            "resumen": self.resumen,
        }


class Candidato(db.Model):
    __tablename__ = "candidatos"

    id = db.Column(db.Integer, primary_key=True)
    nombres = db.Column(db.String(150), nullable=False)
    apellidos = db.Column(db.String(150), nullable=False)
    profesion = db.Column(db.String(150), nullable=False)
    region = db.Column(db.String(100), nullable=False)  # Lima, Cusco, Nacional…
    id_agrupacion = db.Column(db.Integer,
                              db.ForeignKey("agrupaciones_politicas.id"),
                              nullable=False)
    hoja_vida_url = db.Column(db.String(500), nullable=False)

    postulaciones = db.relationship("Postulacion", backref="candidato", lazy=True)

    def to_card_dict(self, incluir_cargo=True):
        post = self.postulaciones[0] if self.postulaciones and incluir_cargo else None
        return {
            "id": self.id,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "profesion": self.profesion,
            "region": self.region,
            "agrupacion": self.agrupacion.nombre if self.agrupacion else None,
            "cargo": post.cargo if post else None,
        }

    def to_detail_dict(self):
        post = self.postulaciones[0] if self.postulaciones else None
        data = {
            "id": self.id,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "profesion": self.profesion,
            "region": self.region,
            "agrupacion": self.agrupacion.nombre if self.agrupacion else None,
            "hoja_vida_url": self.hoja_vida_url,
            "postulacion": {
                "cargo": post.cargo if post else None,
                "ambito": post.ambito if post else None,
                "numero": post.numero if post else None,
            } if post else None,
        }
        return data


class Postulacion(db.Model):
    __tablename__ = "postulaciones"

    id = db.Column(db.Integer, primary_key=True)
    id_candidato = db.Column(db.Integer, db.ForeignKey("candidatos.id"), nullable=False)
    id_eleccion = db.Column(db.Integer, db.ForeignKey("elecciones.id"), nullable=False)
    cargo = db.Column(db.String(100), nullable=False)   # Presidente, Congresista…
    ambito = db.Column(db.String(50), nullable=False)   # nacional / regional
    numero = db.Column(db.Integer, nullable=True)