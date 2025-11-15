from flask import render_template, jsonify, request
from . import main
from models import CentroVotacion, Mesa
from extensions import db


@main.route("/")
def index():
    centros = CentroVotacion.query.all()
    return render_template("index.html", centros=centros)


@main.route("/cronograma")
def cronograma():
    return render_template("parte1.html")


@main.route("/centro/<int:id>")
def detalle(id):
    centro = CentroVotacion.query.get_or_404(id)
    mesas = Mesa.query.filter_by(centro_id=id).all()
    return render_template("detalle.html", centro=centro, mesas=mesas)


# API para app móvil React Native
@main.route("/api/centros")
def api_centros():
    data = [
        {
            "id": c.id,
            "nombre": c.nombre,
            "lat": c.lat,
            "lon": c.lon,
        }
        for c in CentroVotacion.query.all()
    ]
    return jsonify(data)


@main.route("/api/mesas/<int:id>")
def api_mesas(id):
    mesas = Mesa.query.filter_by(centro_id=id).all()
    data = [
        {
            "id": m.id,
            "numero": m.numero,
            "aula": m.aula,
            "piso": m.piso,
            "lat": m.lat,
            "lon": m.lon,
        }
        for m in mesas
    ]
    return jsonify(data)
