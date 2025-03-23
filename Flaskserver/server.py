from flask import Flask, render_template, request, jsonify, Response, send_file, abort, send_from_directory
from flask_cors import CORS
from recordingController import RecordingController
from database_extractor import DatabaseExtractor
from yoloBufferGenerator import YOLOBufferGenerator
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains by default

CONFIG_FILE = 'config.json'
# Define constants
BASE_DIRECTORY = 'C:/nginx/database'
controller = RecordingController(BASE_DIRECTORY)
db_extractor = DatabaseExtractor(BASE_DIRECTORY)

@app.route('/start_recording', methods=['POST'])
def start_recording():
    data = request.json
    userId = data.get('userId')
    cameraID = data.get('cameraID')
    
    if not userId or not cameraID:
        return jsonify({"error": "userId and cameraID parameters are required"}), 400
    
    result = controller.start_recording(userId, cameraID)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    data = request.json
    userId = data.get('userId')
    cameraID = data.get('cameraID')
    
    if not userId or not cameraID:
        return jsonify({"error": "userId and cameraID parameters are required"}), 400
    
    result = controller.stop_recording(userId, cameraID)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/get_database', methods=['GET'])
def get_database():
    """Returns the entire database JSON."""
    result = db_extractor.load_json('db.json')
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/get_user_data/<userId>', methods=['GET'])
def get_user_data(userId):
    """Returns data for a specific user."""
    result = db_extractor.load_user_data(userId)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/filter_database', methods=['GET'])
def filter_database():
    """Filters database according to query parameters."""
    userId = request.args.get('userId')
    cameraID = request.args.get('cameraID')
    date = request.args.get('date')
    recording_name = request.args.get('recording_name')
    detection_name = request.args.get('detection_name')
    url_contains = request.args.get('url_contains')
    size_min = request.args.get('size_min', type=float)
    size_max = request.args.get('size_max', type=float)

    filtered_data = db_extractor.filter_data(
        userId=userId,
        cameraID=cameraID,
        date=date,
        recording_name=recording_name,
        detection_name=detection_name,
        url_contains=url_contains,
        size_min=size_min,
        size_max=size_max
    )
    
    return jsonify(filtered_data)

@app.route('/delete_stream', methods=['DELETE'])
def delete_stream():
    data = request.json
    userId = data.get('userId')
    cameraID = data.get('cameraID')
    stream_type = data.get('stream_type')
    stream_name = data.get('stream_name')
    print(data)
    if not userId or not cameraID or not stream_type or not stream_name:
        return jsonify({"error": "userId, cameraID, stream_type, and stream_name parameters are required"}), 400
    
    if stream_type not in ['detection', 'recordings']:
        return jsonify({"error": "Invalid stream_type. Must be 'detection' or 'recordings'"}), 400

    result = controller.delete_stream(userId, cameraID, stream_type, stream_name)
    if "error" in result:
        print("erroro")
        return jsonify(result), 500
    return jsonify(result), 200

@app.route('/update-config', methods=['POST'])
def update_config():
    try:
        new_config = request.json
        with open(CONFIG_FILE, 'w') as f:
            json.dump(new_config, f, indent=4)
        return jsonify({"message": "Configuration mise à jour avec succès."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
