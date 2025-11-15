from flask import Blueprint, render_template, request, jsonify
from models import CentroVotacion, Mesa
from extensions import db

mapa = Blueprint("mapa", __name__)

@mapa.route("/")
def mapa_index():
    return render_template("mapa.html")


# API para filtrar centros
@mapa.route("/api/centros")
def api_centros():
    distrito = request.args.get("distrito")
    dni = request.args.get("dni")
    nombre = request.args.get("nombre")

    query = CentroVotacion.query

    if distrito:
        query = query.filter_by(distrito=distrito)

    if nombre:
        query = query.filter(CentroVotacion.nombre.like(f"%{nombre}%"))

    if dni:
        query = query.join(Mesa).filter(Mesa.dni_responsable == dni)

    centros = query.all()

    result = [
        {
            "id": c.id,
            "nombre": c.nombre,
            "distrito": c.distrito,
            "lat": c.lat,
            "lng": c.lng
        }
        for c in centros
    ]

    return jsonify(result)
