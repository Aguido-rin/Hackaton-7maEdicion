import base64
from flask import Blueprint, render_template, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import PartidosPoliticos, CentrosVotacion, Usuarios, Mesas
from extensions import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """Ruta principal (web)."""
    centros_query = CentrosVotacion.query.all()
    centros = [
        {
            "id_centro": c.id_centro,
            "nombre": c.nombre,
            "distrito": c.distrito,
            "latitud": float(c.latitud) if c.latitud is not None else None,
            "longitud": float(c.longitud) if c.longitud is not None else None,
            "ubicacion_detalle": c.mesas[0].ubicacion_detalle if c.mesas else None
        }
        for c in centros_query
    ]
    return render_template('index.html', centros=centros)

# --- INICIO: API PARA LA APP MÓVIL ---

@main.route('/api/partidos')
def get_partidos():
    """
    Endpoint de API para obtener todos los partidos políticos
    y servirlos a la app de React Native.
    """
    try:
        # Consultar la base de datos usando el modelo PartidosPoliticos
        partidos = PartidosPoliticos.query.all()
        
        lista_partidos_json = []
        for partido in partidos:
            
            # Codificar el logo BLOB a base64 para enviarlo como string en el JSON
            # La app móvil puede decodificar esto para mostrar la imagen.
            logo_base64 = None
            if partido.logo_blob:
                # 'utf-8' es el encoding del string base64, no de la imagen
                logo_base64 = base64.b64encode(partido.logo_blob).decode('utf-8')

            lista_partidos_json.append({
                'id_partido': partido.id_partido,
                'jne_id_simbolo': partido.jne_id_simbolo,
                'nombre_partido': partido.nombre_partido,
                'siglas': partido.siglas,
                'fecha_inscripcion': partido.fecha_inscripcion.isoformat() if partido.fecha_inscripcion else None,
                
                # Devuelve el logo como un string base64
                'logo_base64': logo_base64, 
                
                'direccion_legal': partido.direccion_legal,
                'telefonos': partido.telefonos,
                'sitio_web': partido.sitio_web,
                'email_contacto': partido.email_contacto,
                'personero_titular': partido.personero_titular,
                'personero_alterno': partido.personero_alterno,
                'ideologia': partido.ideologia
            })
            
        # Devolver la lista de partidos como una respuesta JSON
        return jsonify(lista_partidos_json)

    except Exception as e:
        print(f"Error en /api/partidos: {e}")
        # Devolver un error 500 en formato JSON si algo falla
        return jsonify({"error": str(e)}), 500


# --- AUTENTICACIÓN: registro e inicio de sesión (API móvil) ---
@main.route('/api/register', methods=['POST'])
def api_register():
    """Registrar un nuevo usuario desde la app móvil.
    Espera JSON: {"dni": "12345678", "password": "abc123", "email": "opcional@x.com", "id_mesa": 1, "rol": "Elector"}
    """
    try:
        data = request.get_json() or {}
        dni = (data.get('dni') or '').strip()
        password = data.get('password')
        email = (data.get('email') or None)
        id_mesa = data.get('id_mesa')
        rol = data.get('rol') or 'Elector'

        if not dni or not password:
            return jsonify({'error': 'dni and password are required'}), 400

        # Verificar existencia por DNI o email
        if Usuarios.query.filter_by(dni=dni).first():
            return jsonify({'error': 'DNI already registered'}), 409
        if email and Usuarios.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        # Si se provee id_mesa, validar que exista
        if id_mesa is not None:
            mesa = Mesas.query.get(id_mesa)
            if mesa is None:
                return jsonify({'error': 'Mesa not found'}), 400

        # Hashear contraseña
        pw_hash = generate_password_hash(password)

        nuevo = Usuarios(
            dni=dni,
            email=email,
            password_hash=pw_hash,
            id_mesa=id_mesa,
            rol=rol
        )
        db.session.add(nuevo)
        db.session.commit()

        return jsonify({
            'id_usuario': nuevo.id_usuario,
            'dni': nuevo.dni,
            'email': nuevo.email,
            'rol': nuevo.rol,
            'id_mesa': nuevo.id_mesa
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error en /api/register: {e}")
        return jsonify({'error': str(e)}), 500


@main.route('/api/login', methods=['POST'])
def api_login():
    """Iniciar sesión. Acepta JSON con `dni` o `email` y `password`.
    Responde con datos básicos del usuario si la autenticación es correcta.
    """
    try:
        data = request.get_json() or {}
        dni = data.get('dni')
        email = data.get('email')
        password = data.get('password')

        if not password or (not dni and not email):
            return jsonify({'error': 'Provide dni or email and password'}), 400

        user = None
        if dni:
            user = Usuarios.query.filter_by(dni=dni).first()
        elif email:
            user = Usuarios.query.filter_by(email=email).first()

        if not user or not user.password_hash:
            return jsonify({'error': 'Invalid credentials'}), 401

        if not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Responder con la info del usuario (sin password)
        return jsonify({
            'success': True,
            'id_usuario': user.id_usuario,
            'dni': user.dni,
            'email': user.email,
            'rol': user.rol,
            'id_mesa': user.id_mesa
        })

    except Exception as e:
        print(f"Error en /api/login: {e}")
        return jsonify({'error': str(e)}), 500

# --- FIN: API PARA LA APP MÓVIL ---

# ... (puedes añadir tus otras rutas web aquí si es necesario)

@main.route('/parte1')
def parte1():
    return render_template('parte1.html')

@main.route('/parte3')
def parte3():
    return render_template('parte3.html')

@main.route('/parte4')
def parte4():
    return render_template('parte4.html')

@main.route('/candidatos')
def candidatos_view():
    return render_template('candidatos.html')
