class Config:
    SECRET_KEY = "dev"

    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:admin@localhost/comitia_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
