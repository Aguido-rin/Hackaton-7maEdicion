import base64
from flask import render_template, jsonify, request
from . import main
from models import CentrosVotacion, Mesas, PartidosPoliticos
from extensions import db

# --- RUTAS WEB ACTUALIZADAS ---

@main.route("/")
def index():
    centros = CentrosVotacion.query.all()
    return render_template("index.html", centros=centros)


@main.route("/cronograma")
def cronograma():
    return render_template("parte1.html")


@main.route("/centro/<string:id>")
def detalle(id):
    centro = CentrosVotacion.query.filter_by(id_centro=id).first_or_404()
    mesas = Mesas.query.filter_by(id_centro=id).all()
    # Obtener TODOS los centros para mostrarlos en el mapa
    todos_centros = CentrosVotacion.query.all()
    return render_template("detalle.html", centro=centro, mesas=mesas, todos_centros=todos_centros)


# --- API PARA APP MÓVIL REACT NATIVE ---

@main.route("/api/centros")
def api_centros():
    data = [
        {
            "id": c.id_centro,
            "nombre": c.nombre,
            "lat": float(c.latitud) if c.latitud is not None else None,
            "lon": float(c.longitud) if c.longitud is not None else None,
            "direccion": c.direccion,
            "distrito": c.distrito
        }
        for c in CentrosVotacion.query.all()
    ]
    return jsonify(data)


@main.route("/api/mesas/<string:id>")
def api_mesas(id):
    mesas = Mesas.query.filter_by(id_centro=id).all()
    data = [
        {
            "id": m.id_mesa,
            "numero": m.numero_mesa,
            "aula": m.ubicacion_detalle,
            "piso": None,
            "lat": None,
            "lon": None
        }
        for m in mesas
    ]
    return jsonify(data)

# --- NUEVO ENDPOINT: API de Partidos Políticos ---
@main.route('/api/partidos')
def get_partidos():
    """
    Endpoint de API para obtener todos los partidos políticos
    y servirlos a la app de React Native.
    """
    try:
        partidos = PartidosPoliticos.query.all()
        lista_partidos_json = []
        
        for partido in partidos:
            logo_base64 = None
            if partido.logo_blob:
                logo_base64 = base64.b64encode(partido.logo_blob).decode('utf-8')

            lista_partidos_json.append({
                'id_partido': partido.id_partido,
                'jne_id_simbolo': partido.jne_id_simbolo,
                'nombre_partido': partido.nombre_partido,
                'siglas': partido.siglas,
                'fecha_inscripcion': partido.fecha_inscripcion.isoformat() if partido.fecha_inscripcion else None,
                'logo_base64': logo_base64, 
                'direccion_legal': partido.direccion_legal,
                'telefonos': partido.telefonos,
                'sitio_web': partido.sitio_web,
                'email_contacto': partido.email_contacto,
                'personero_titular': partido.personero_titular,
                'personero_alterno': partido.personero_alterno,
                'ideologia': partido.ideologia
            })
            
        return jsonify(lista_partidos_json)

    except Exception as e:
        print(f"Error en /api/partidos: {e}")
        return jsonify({"error": str(e)}), 500