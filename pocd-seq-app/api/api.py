import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
 
ALLOWED_EXTENSIONS = set(['fastq', 'fastq.gz'])
UPLOAD_FOLDER = 'tmp'

app = Flask(__name__, static_url_path='', static_folder='public', template_folder='public')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
cors = CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    identifers = filename.split('.') 
    if identifers[1].lower() in ALLOWED_EXTENSIONS: 
        return True
    else:
        return False 
 
@app.route('/upload', methods=['POST','GET'])
def fileUpload():
    target=UPLOAD_FOLDER
    file = request.files['file']  
    filename = secure_filename(file.filename)
    print(filename)
    if file and allowed_file(filename):
        destination="/".join([target, filename])
        file.save(destination)
        response='success'
        return response
    else:  
        return "Not Valid"

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