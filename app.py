from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "<p>Hello, COSS!</p>"

@app.route('/get-roadnet-file/<option>')
def get_roadnet_file(option):
    pass

#@app.route