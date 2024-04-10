from Logger import Logger
from flask import Flask, render_template, Response, request
from AnkCommunicationService import AnkCommunicationService

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        variable_start_string='%%',  # Default is '{{', I'm changing this because Vue.js uses '{{' / '}}'
        variable_end_string='%%',
    ))

dashboard = CustomFlask(__name__)

logger = Logger.get_custom_logger()
ank_comm_service = AnkCommunicationService()

@dashboard.route('/', methods=['GET'])
@dashboard.route('/index', methods=['GET'])
def home():
    return render_template('index.html')

@dashboard.route('/workloads')
def workloads():
    return render_template('workloads.html')

@dashboard.route('/completeState', methods=['GET'])
def get_complete_state():
    """
    Returns the complete state of the ankaios system
    as a Json string.
    """
    return ank_comm_service.get_complete_state()

@dashboard.route('/addNewWorkload', methods=['POST'])
def add_new_workload():
    print(ank_comm_service.add_new_workload(request.json))
    return Response("Workload added.", status=200, mimetype='application/json')

@dashboard.route('/deleteWorkloads', methods=['POST'])
def delete_workloads():
    print(ank_comm_service.deleteWorkloads(request.json))
    return Response("Workloads deleted.", status=200, mimetype='application/json')

def run(ip="0.0.0.0", p="5001"):
    logger.info(f"Starting the dashboard api ...")
    dashboard.run(host=ip, port=p)
