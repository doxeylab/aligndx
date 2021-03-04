import os
from flask import Flask, flash, request, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from scripts import runsalmon, data, figures


ALLOWED_EXTENSIONS = set(['fastq', 'fastq.gz'])
path = './'
UPLOAD_FOLDER = os.path.join(path, 'uploads')
RESULTS_FOLDER = os.path.join(path, 'results')
INDEX_FOLDER = './indexes'

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)
if not os.path.isdir(RESULTS_FOLDER):
    os.mkdir(RESULTS_FOLDER)
if not os.path.isdir(INDEX_FOLDER):
    os.mkdir(INDEX_FOLDER)

app = Flask(__name__, static_url_path='', static_folder='public', template_folder='public')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
cors = CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER

@app.route('/',methods=['GET'])
def root():
    return "Welcome to the root api endpoint \n use /upload to upload files, use /files to check if it was uploaded"

# def allowed_file(filename):
#     identifers = filename.split('.') 
#     if identifers[1].lower() in ALLOWED_EXTENSIONS: 
#         return True
#     else:
#         return False 
 
@app.route('/upload', methods=['POST','GET'])
def fileUpload():
    # get list of files, if there are more than 1
    files = request.files.getlist("file") 
    for file in files:  
        # if file and allowed_file(file.filename): 
        filename = secure_filename(file.filename)
        sample_name = filename.split('.')[0]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        resultspath = os.path.join(app.config['RESULTS_FOLDER'], sample_name)
        indexpath = os.path.join(app.config['INDEX_FOLDER'], 'sars_with_human_decoys')
        file.save(filepath)  
        runsalmon.quantify(sample_name, indexpath, filepath, resultspath)
        category = 'NumReads'
        sample_df = data.producedataframe(resultspath,category)
        # figures.heatmap(sample_df, resultspath, sample_name, category)
        # figures.table(sample_df, resultspath, sample_name)
        result = data.ispositive(sample_df)
    return result  

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