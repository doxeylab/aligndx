import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin

UPLOAD_FOLDER = 'tmp'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

UPLOAD_FOLDER = 'tmp'

app = Flask(__name__, static_url_path='', static_folder='public', template_folder='public')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
cors = CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def fileUpload():
    target=UPLOAD_FOLDER
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    response='success'
    return response

@app.route("/files", methods=['GET'])
def list_files():
    """Endpoint to list files on the server."""
    files = []
    for filename in os.listdir(UPLOAD_FOLDER):
        files.append(filename)
    print(files)
    return jsonify(files)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)