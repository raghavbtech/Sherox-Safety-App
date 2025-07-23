from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from models import db, User, VehicleScan, EmergencyAlert, SafetyContact,TrustedContact
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from utils.sms_sender import send_sms
from utils.sms_sender import send_sms
from models import SafetyContact  # assuming this is the name of the table
# app.py
from flask import request
from geopy.distance import geodesic





app = Flask(__name__)
CORS(app)

# 🔧 Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sherox.db'
app.config['SECRET_KEY'] = 'sherox-secret'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🔧 Init DB
db.init_app(app)
with app.app_context():
    db.create_all()

# ✅ Signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# ✅ Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {'name': user.name, 'email': user.email}
    }), 200

# ✅ Log Vehicle Scan
@app.route("/api/log-scan", methods=["POST"])
def log_vehicle_scan():
    data = request.get_json()
    scan = VehicleScan(
        plate_number=data.get("plate_number"),
        lat=data.get("location_lat"),
        lng=data.get("location_lng"),
        safescore=data.get("safescore")
    )
    db.session.add(scan)
    db.session.commit()
    return jsonify({"message": "Scan logged"}), 200

# ✅ Emergency Alert
@app.route('/api/emergency-alert', methods=['POST'])
def emergency_alert():
    data = request.json
    user_email = data.get("user")
    plate_number = data.get("plateNumber", "N/A")
    safescore = data.get("safescore", "N/A")
    source = data.get("source", "manual")
    location = data.get("location", {})

    # Format emergency message
    msg = (
        f"🚨 Emergency Triggered via SheRox!\n"
        f"User: {user_email}\n"
        f"Plate: {plate_number}\n"
        f"Score: {safescore}\n"
        f"Source: {source}\n"
        f"Location: {location.get('lat')}, {location.get('lng')}"
    )

    try:
        # Fetch user's trusted contacts
        contacts = SafetyContact.query.filter_by(user_email=user_email).all()
        for c in contacts:
            send_sms(c.contact_number, msg)

        return jsonify({"status": "Emergency SMS sent to Safety Circle"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Safety Circle (Add/Get Contacts)
@app.route("/api/safety-circle", methods=["GET", "POST"])
def safety_circle():
    user = request.args.get("user")  # email
    if request.method == "POST":
        number = request.json.get("contact")
        contact = SafetyContact(user_email=user, contact_number=number)
        db.session.add(contact)
        db.session.commit()
        return jsonify({"message": "Contact added"}), 200

    elif request.method == "GET":
        contacts = SafetyContact.query.filter_by(user_email=user).all()
        return jsonify([c.contact_number for c in contacts]), 200
    
@app.route('/api/test-sms', methods=['POST'])
def test_sms():
    data = request.json
    phone = data.get("phone")
    message = data.get("message", "🚨 This is a test emergency SMS from SheRox.")
    
    if not phone:
        return jsonify({'error': 'Phone number is required'}), 400

    try:
        result = send_sms(phone, message)
        return jsonify({'status': 'SMS sent', 'response': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    user_email = request.args.get("user_email")
    if not user_email:
        return jsonify({"error": "Missing user email"}), 400

    contacts = TrustedContact.query.filter_by(user_email=user_email).all()
    data = [{"id": c.id, "name": c.name, "number": c.number} for c in contacts]
    return jsonify(data), 200


@app.route('/api/contacts', methods=['POST'])
def add_contact():
    data = request.json

    # Validation checks
    if not data.get("contact_number") or not data.get("contact_number").isdigit() or len(data["contact_number"]) != 10:
        return jsonify({"error": "Invalid phone number"}), 400

    if not data.get("contact_name"):
        return jsonify({"error": "Contact name required"}), 400

    if not data.get("user_email"):
        return jsonify({"error": "User email missing"}), 400

    # Limit to 5 contacts
    existing_count = TrustedContact.query.filter_by(user_email=data["user_email"]).count()
    if existing_count >= 5:
        return jsonify({"error": "Max 5 trusted contacts allowed"}), 400

    # Create and insert contact
    new_contact = TrustedContact(
        user_email=data['user_email'],
        name=data['contact_name'],
        number=data['contact_number']
    )
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"message": "Contact added"}), 201


@app.route('/api/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    data = request.get_json()
    user_email = data.get("user_email")

    contact = TrustedContact.query.filter_by(id=id, user_email=user_email).first()
    if not contact:
        return jsonify({"message": "Contact not found"}), 404

    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact deleted"}), 200

@app.route("/api/contacts/send-sos", methods=["POST"])
def send_sos():
    data = request.json
    user_email = data.get("user_email")
    message = data.get("message", "🚨 SOS Alert from Sherox!")
    plate_number = data.get("plate_number", "Not Captured")
    message += f"\nVehicle: {plate_number}"

    contacts = TrustedContact.query.filter_by(user_email=user_email).all()
    numbers = ",".join([c.number for c in contacts])  # use .number, not contact_number
    print(numbers)

    if not numbers:
        return jsonify({"error": "No contacts found"}), 404
    response = send_sms(numbers, message)
    return jsonify({"status": "SMS sent", "details": response})

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS



# Replace with your actual Google Maps API Key
GOOGLE_MAPS_API_KEY = "AIzaSyDqq5Z8m3RQ12kAD_nOdzNSR7C32Nklr20"

def get_traffic_level(origin, destination):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{origin['lat']},{origin['lng']}",
        "destination": f"{destination['lat']},{destination['lng']}",
        "departure_time": "now",
        "traffic_model": "best_guess",
        "key": GOOGLE_MAPS_API_KEY
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()

        duration_in_traffic = data["routes"][0]["legs"][0]["duration_in_traffic"]["value"]
        normal_duration = data["routes"][0]["legs"][0]["duration"]["value"]

        ratio = duration_in_traffic / normal_duration

        if ratio > 1.4:
            return "MODERATE"   # Heavy traffic → people, delays, but not dangerous
        elif ratio > 1.1:
            return "LOW"        # Mild congestion → more space
        else:
            return "HIGH"       # Empty roads → potentially risky

# Then:
# HIGH     → 9
# MODERATE → 6
# LOW      → 2

    except Exception as e:
        print("Traffic API error:", e)
        return "UNKNOWN"

def compute_safe_score_from_traffic(level):
    if level == "HIGH":
        return 9
    elif level == "MODERATE":
        return 6
    elif level == "LOW":
        return 2
    else:
        return "N/A"

@app.route("/api/route/safest", methods=["POST"])
def get_safe_score():
    data = request.json
    source = data.get("origin")  # expects {"lat": ..., "lng": ...}
    destination = data.get("destination")

    if not source or not destination:
        return jsonify({"error": "Missing source or destination"}), 400

    traffic_level = get_traffic_level(source, destination)
    score = compute_safe_score_from_traffic(traffic_level)

    return jsonify({
        "safety_score": score,
        "traffic_level": traffic_level
    }), 200




with app.app_context():
    db.create_all()



import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

