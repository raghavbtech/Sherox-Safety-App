from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))

class VehicleScan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    safescore = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class EmergencyAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20))
    source = db.Column(db.String(20))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class SafetyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), nullable=False)
    contact_name = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)


class TrustedContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    number = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<SafetyContact {self.contact_name} - {self.contact_number}>"
    



# models.py
class SafeRouteData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    crime_score = db.Column(db.Float, default=0.0)  # Higher means unsafe
    lighting_score = db.Column(db.Float, default=0.0)  # Higher means safer
