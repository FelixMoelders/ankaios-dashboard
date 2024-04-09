from Logger import Logger
from flask import Flask, render_template
from AnkCommunicationService import AnkCommunicationService

dashboard = Flask(__name__)

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

@dashboard.route('/deleteWorkload')
def send_delete_workload():
    """
    Returns request to delete a workload as a Json string
    """
    print("Delete button has been pressed!")
    return 'Success'

def run(ip="0.0.0.0", p="5001"):
    logger.info(f"Starting the dashboard api ...")
    dashboard.run(host=ip, port=p)
