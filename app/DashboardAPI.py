from Logger import Logger
from flask import Flask, render_template, jsonify, request
#from flask_restful import API, Resource, reqparse
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

@dashboard.route('/deleteWorkload', methods=['GET', 'POST'])
def deleteWorkload():
    """
    Returns request to delete a workload as a Json string
    """
   # print(workload_names)
    if request.method == 'POST':
        if request.json:  # Check for JSON data in request
            
            workload_names = request.json.get('workload_names') 

            if workload_names: # Algorithm to check for errors, can be deleted or modified later.
                print("Delete button has been pressed!")
                print(workload_names)
                return jsonify(message= 'OK'), 200
            else:
                return jsonify(error="Request is missing 'workload_names'"), 400  
        else:
                return jsonify(error="Request did not contain valid JSON data"), 400 

#    print("Delete button has been pressed!")
#    print(workload_names)
#    return 'OK', 200

def run(ip="0.0.0.0", p="5001"):
    logger.info(f"Starting the dashboard api ...")
    dashboard.run(host=ip, port=p)
