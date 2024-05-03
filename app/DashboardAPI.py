from Logger import Logger
from flask import Flask, render_template, Response, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from AnkCommunicationService import AnkCommunicationService
import uuid
import os

class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        variable_start_string='%%',  # Default is '{{', I'm changing this because Vue.js uses '{{' / '}}'
        variable_end_string='%%',
    ))

dashboard = CustomFlask(__name__, static_folder = 'static/assets/', template_folder = 'static/')
dashboard.config['SECRET_KEY'] = str(uuid.uuid4())

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(dashboard)

logger = Logger.get_custom_logger()
ank_comm_service = AnkCommunicationService()

DEFAULT_PASSWORD = ""

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@dashboard.route('/', methods=['GET'])
@dashboard.route('/index.html', methods=['GET'])
def home():
    return render_template('index.html')

@dashboard.route('/login', methods=['POST'])
def login():
    pwd = request.json['pwd']['_value']
    if pwd == os.environ.get('PASSWORD', DEFAULT_PASSWORD):
        user = User(str(uuid.uuid4))
        login_user(user)
        return Response("Logged in.", status=200)

    else:
        return Response("Wrong password.", status=401)


@dashboard.route('/logout')
# TODO @login_required
def logout():
    logout_user()
    return Response("Logged out.", status=200)

@dashboard.route('/debug')
def debug():
    return render_template('debug.html')

@dashboard.route('/completeState', methods=['GET'])
# TODO @login_required
def get_complete_state():
    return ank_comm_service.get_complete_state()

@dashboard.route('/addNewWorkload', methods=['POST'])
# TODO @login_required
def add_new_workload():
    print(ank_comm_service.add_new_workload(request.json))
    return Response("Workload added.", status=200, mimetype='application/json')

@dashboard.route('/deleteWorkloads', methods=['POST'])
# TODO @login_required
def delete_workloads():
    print(ank_comm_service.deleteWorkloads(request.json))
    return Response("Workloads deleted.", status=200, mimetype='application/json')

@dashboard.route('/updateConfig', methods=['POST'])
# TODO @login_required
def update_config():
    print(ank_comm_service.update_config(request.json))
    return Response("Workloads deleted.", status=200, mimetype='application/json')

def run(ip="0.0.0.0", p="5001"):
    logger.info(f"Starting the dashboard api ...")
    dashboard.run(host=ip, port=p)
