from flask import render_template
from . import main
from models import CentroVotacion

@main.route("/")
def index():
    centros = CentroVotacion.query.all()
    return render_template("index.html", centros=centros)
