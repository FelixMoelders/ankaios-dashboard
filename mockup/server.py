from flask import Flask, render_template, request, jsonify
import json

dashboard = Flask(__name__)


def load_states():
    with open('static/completeState.json') as f:
        file = json.load(f)
    return file


@dashboard.route('/')
@dashboard.route('/index')
def index():
    return render_template('index.html')


@dashboard.route('/workloads')
def workloads():
    return render_template('workloads.html')


@dashboard.route('/states')
def states():
    print('Hello')
    return jsonify(load_states())


if __name__ == '__main__':
    dashboard.run(debug=True)
