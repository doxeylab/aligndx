from flask import Flask

app = Flask(__name__)

@app.route('/main')
def test_hello():
    return {'result':"You now have a pathogen"}