# main/routes.py
from flask import render_template, jsonify, request
from . import main
from models import (
    CentroVotacion,
    Mesa,
    Eleccion,
    AgrupacionPolitica,
    PlanGobierno,
    PlanSector,
    Candidato,
    Postulacion,
)

# =========================
# VISTAS HTML (WEB)
# =========================

@main.route("/")
def index():
    centros = CentroVotacion.query.all()
    return render_template("index.html", centros=centros)


@main.route("/centro/<int:id>")
def detalle(id):
    centro = CentroVotacion.query.get_or_404(id)
    mesas = Mesa.query.filter_by(centro_id=id).all()
    return render_template("detalle.html", centro=centro, mesas=mesas)


# =========================
# API GEOLOCALIZACIÓN (PTO 3)
# =========================

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


# =========================
# API PUNTO 2: ELECCIONES Y AGRUPACIONES
# =========================

@main.route("/api/elecciones", methods=["GET"])
def api_elecciones():
    elecciones = Eleccion.query.all()
    # asumiendo que Eleccion tiene .to_dict()
    return jsonify([e.to_dict() for e in elecciones])


@main.route("/api/agrupaciones", methods=["GET"])
def api_agrupaciones():
    id_eleccion = request.args.get("id_eleccion", type=int)
    query = AgrupacionPolitica.query
    if id_eleccion:
        query = query.filter_by(id_eleccion=id_eleccion)

    agrupaciones = query.all()
    return jsonify([a.to_dict() for a in agrupaciones])


@main.route("/api/agrupaciones/<int:agrupacion_id>", methods=["GET"])
def api_detalle_agrupacion(agrupacion_id):
    a = AgrupacionPolitica.query.get(agrupacion_id)
    if not a:
        return jsonify({"error": "Agrupación no encontrada"}), 404

    plan = PlanGobierno.query.filter_by(id_agrupacion=agrupacion_id).first()
    data = a.to_dict()
    data["plan_gobierno"] = plan.to_dict(include_sectores=False) if plan else None

    return jsonify(data)


@main.route("/api/agrupaciones/<int:agrupacion_id>/plan", methods=["GET"])
def api_plan_agrupacion(agrupacion_id):
    plan = PlanGobierno.query.filter_by(id_agrupacion=agrupacion_id).first()
    if not plan:
        return jsonify({"error": "La agrupación no tiene plan registrado"}), 404

    return jsonify(plan.to_dict(include_sectores=True))


@main.route("/api/agrupaciones/<int:agrupacion_id>/plan/<string:sector>", methods=["GET"])
def api_plan_por_sector(agrupacion_id, sector):
    plan = PlanGobierno.query.filter_by(id_agrupacion=agrupacion_id).first()
    if not plan:
        return jsonify({"error": "La agrupación no tiene plan registrado"}), 404

    s = PlanSector.query.filter(
        PlanSector.id_plan == plan.id,
        PlanSector.sector.ilike(sector)
    ).first()
    if not s:
        return jsonify({"error": "Sector no encontrado en el plan"}), 404

    return jsonify(s.to_dict())


# =========================
# API PUNTO 2: CANDIDATOS
# =========================

@main.route("/api/candidatos", methods=["GET"])
def api_candidatos():
    region = request.args.get("region")
    cargo = request.args.get("cargo")
    id_agrupacion = request.args.get("id_agrupacion", type=int)

    query = Candidato.query

    if region:
        query = query.filter(Candidato.region.ilike(region))
    if id_agrupacion:
        query = query.filter_by(id_agrupacion=id_agrupacion)

    candidatos = query.all()

    if cargo:
        ids_con_cargo = {
            p.id_candidato
            for p in Postulacion.query.filter(Postulacion.cargo.ilike(cargo)).all()
        }
        candidatos = [c for c in candidatos if c.id in ids_con_cargo]

    # asumiendo que Candidato tiene .to_card_dict()
    return jsonify([c.to_card_dict() for c in candidatos])


@main.route("/api/candidatos/<int:candidato_id>", methods=["GET"])
def api_detalle_candidato(candidato_id):
    c = Candidato.query.get(candidato_id)
    if not c:
        return jsonify({"error": "Candidato no encontrado"}), 404

    # asumiendo que Candidato tiene .to_detail_dict()
    data = c.to_detail_dict()

    # Si es candidato presidencial, adjuntamos plan de su agrupación
    post = c.postulaciones[0] if c.postulaciones else None
    if post and post.cargo.lower() == "presidente":
        plan = PlanGobierno.query.filter_by(id_agrupacion=c.id_agrupacion).first()
        if plan:
            data["plan_gobierno"] = plan.to_dict(include_sectores=True)

    return jsonify(data)
# Vistas front de candidatos
@main.route("/candidatos")
def candidatos_view():
    return render_template("candidatos.html")


@main.route("/candidatos/<int:candidato_id>")
def candidato_detalle_view(candidato_id):
    return render_template("candidato_detalle.html", candidato_id=candidato_id)
