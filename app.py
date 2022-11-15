from flask import Flask, redirect, send_from_directory, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

from data import Data

app = Flask(__name__)

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

data = Data()

@app.route('/')
def index():
    return "<p>Hello, COSS!</p>"

@app.route('/get-roadnet-options')
def get_roadnet_options():
    return data.get_roadnet_options()

@app.route('/get-replay-options/<roadnet_option>')
def get_replay_options(roadnet_option):
    return data.get_replay_options_for_roadnet(roadnet_option)

@app.route('/get-roadnet-file/<option>')
def get_roadnet_file(option):
    roadnet_file = data.get_roadnet_file(option)
    return send_from_directory('static', 'software_demonstrator_coci/' + roadnet_file, as_attachment=True)
    #return redirect(url_for('static', filename='software_demonstrator_coci/' + roadnet_file))

@app.route('/get-replay-file/<roadnet_option>/<replay_option>')
def get_replay_file(roadnet_option, replay_option):
    replay_file = data.get_replay_file(roadnet_option, replay_option)
    return send_from_directory('static', 'software_demonstrator_coci/' + replay_file, as_attachment=True)
    #return redirect(url_for('static', filename='software_demonstrator_coci/' + replay_file))