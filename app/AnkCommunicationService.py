import ankaios_pb2 as ank
from Logger import Logger
from ControlInterface import ControlInterface
import json

REQUEST_ID = "ank_dashboard"
logger = Logger.get_custom_logger()

class AnkCommunicationService:

    def __init__(self) -> None:
        self.logger = Logger.get_custom_logger()
        self.control_interface = ControlInterface()

    def create_request_for_complete_state(self, request_id):
        """
        Create a Request to request the CompleteState
        for querying the workload states.
        """
        self.logger.debug(f"Creating complete state request with id: {request_id}")
        return ank.ToServer(
            request=ank.Request(
                completeStateRequest=ank.CompleteStateRequest(
                    fieldMask=["workloadStates"]
                ),
                requestId=request_id,
            )
        )
    
    def create_update_state_request(self, request_id, json):
        workload_name = json["workloadName"]
        restart_policy = None
        match json.get('restartPolicy', 'NEVER'):
            case "NEVER":
                restart_policy = ank.NEVER
            case "ON_FAILURE":
                restart_policy = ank.ON_FAILURE
            case "ALWAYS":
                restart_policy = ank.ALWAYS
            case _:
                restart_policy = ank.NEVER

        tag_list = []
        if "tags" in json:
            for kv_pair in json["tags"]:
                tag = ank.Tag(key=kv_pair["key"], value=kv_pair["value"])
                tag_list.append(tag)

        return ank.ToServer(
                request=ank.Request(
                        requestId=request_id,
                        updateStateRequest=ank.UpdateStateRequest(
                            newState=ank.CompleteState(
                                desiredState=ank.State(
                                        apiVersion="v0.1",
                                        workloads={
                                            workload_name: ank.Workload(
                                                agent=json["agent"],
                                                runtime=json["runtime"],
                                                restartPolicy=restart_policy,
                                                tags=tag_list,
                                                runtimeConfig=json["runtimeConfig"])
                                        }
                                )
                            ),
                            updateMask=[f"desiredState.workloads.{workload_name}"]
                        )
                )
            )

    def create_request_for_workload_deletion(self, request_id, workload_name):
        
        return ank.ToServer(
                request=ank.Request(
                        requestId=REQUEST_ID,
                        updateStateRequest=ank.UpdateStateRequest(
                            newState=ank.CompleteState(
                                desiredState=ank.State(
                                        apiVersion="v0.1",
                                        workloads={}
                                )
                            ),
                            updateMask=[f"desiredState.workloads.{workload_name}"]
                        )
                )
            )      

    def get_complete_state(self):
        request_complete_state = self.create_request_for_complete_state(REQUEST_ID)
        self.control_interface.write_request_to_control_interface(request_complete_state)

        return self.control_interface.read_from_control_interface(REQUEST_ID)
    
    def add_new_workload(self, json):
        request_new_workload = self.create_update_state_request(REQUEST_ID, json)
        self.control_interface.write_request_to_control_interface(request_new_workload)

        return self.control_interface.read_from_control_interface(REQUEST_ID)
    
    def deleteWorkloads(self, json):
        for workload_name in json:
            delete_request = self.create_request_for_workload_deletion(REQUEST_ID, workload_name)
            self.control_interface.write_request_to_control_interface(delete_request)
            print(self.control_interface.read_from_control_interface(REQUEST_ID))

    def update_config(self, json):
        update_request = self.create_update_state_request(REQUEST_ID, json)
        self.control_interface.write_request_to_control_interface(update_request)
        return self.control_interface.read_from_control_interface(REQUEST_ID)
