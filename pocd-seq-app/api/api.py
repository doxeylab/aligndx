import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import runsalmon 
 
ALLOWED_EXTENSIONS = set(['fastq', 'fastq.gz'])
path = '/home/nomo/research/pocd/pocd-seq-app/api'
UPLOAD_FOLDER = os.path.join(path, 'uploads')

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app = Flask(__name__, static_url_path='', static_folder='public', template_folder='public')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
cors = CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/',methods=['GET'])
def root():
    return "Welcome to the root api endpoint \n use /upload to upload files, use /files to check if it was uploaded"

# def allowed_file(filename):
#     identifers = filename.split('.') 
#     if identifers[1].lower() in ALLOWED_EXTENSIONS: 
#         return True
#     else:
#         return False 
 
@app.route('/upload', methods=['POST'])
def fileUpload():
    # get list of files, if there are more than 1
    files = request.files.getlist("file") 
    for file in files:  
        # if file and allowed_file(file.filename): 
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))  
    return 'file uploaded successfully' 
    # target=UPLOAD_FOLDER
    # file = request.files['file']  
    # filename = secure_filename(file.filename) 
    # if file and allowed_file(filename):
    #     destination="/".join([target, filename])
    #     file.save(destination)
    #     print(runsalmon.sanity_check())
    #     response='success'
    #     return response
    # else:  
    #     return "Not Valid"

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