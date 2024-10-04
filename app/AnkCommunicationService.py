import ank_base_pb2 as ank_base
import control_api_pb2 as control_api
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
        Create a Request to request the workloadStates.
        """
        self.logger.debug(f"Creating workloadStates request with id: {request_id}")
        return control_api.ToAnkaios(
            request=ank_base.Request(
                completeStateRequest=ank_base.CompleteStateRequest(
                    fieldMask=["desiredState", "workloadStates"]
                ),
                requestId=request_id,
            )
        )

    def create_update_state_request(self, request_id, json):
        workload_name = json["workloadName"]
        restart_policy = None
        match json.get('restartPolicy', 'NEVER'):
            case "NEVER":
                restart_policy = ank_base.NEVER
            case "ON_FAILURE":
                restart_policy = ank_base.ON_FAILURE
            case "ALWAYS":
                restart_policy = ank_base.ALWAYS
            case _:
                restart_policy = ank_base.NEVER

        print("tags") # TODO
        tag_list = []
        if "tags" in json:
            for kv_pair in json["tags"]:
                tag = ank_base.Tag(key=kv_pair["key"], value=kv_pair["value"])
                print(tag) # TODO
                tag_list.append(tag)

        return control_api.ToAnkaios(
                request=ank_base.Request(
                        requestId=request_id,
                        updateStateRequest=ank_base.UpdateStateRequest(
                            newState=ank_base.CompleteState(
                                desiredState=ank_base.State(
                                        apiVersion="v0.1",
                                        workloads=ank_base.WorkloadMap(
                                            workloads={
                                                workload_name: ank_base.Workload(
                                                    agent=json["agent"],
                                                    runtime=json["runtime"],
                                                    restartPolicy=restart_policy,
                                                    tags=ank_base.Tags(
                                                        tags=tag_list
                                                    ),
                                                    runtimeConfig=json["runtimeConfig"],
                                                    controlInterfaceAccess=json["controlInterfaceAccess"]
                                                )
                                            }
                                        )
                                )
                            ),
                            updateMask=[f"desiredState.workloads.{workload_name}"]
                        )
                )
            )

    def create_request_for_workload_deletion(self, request_id, workload_name):
        
        return control_api.ToAnkaios(
                request=ank_base.Request(
                        requestId=request_id,
                        updateStateRequest=ank_base.UpdateStateRequest(
                            newState=ank_base.CompleteState(
                                desiredState=ank_base.State(
                                        apiVersion="v0.1",
                                        workloads={}
                                )
                            ),
                            updateMask=[f"desiredState.workloads.{workload_name}"]
                        )
                )
            )      

    def get_complete_state(self):
        request_workload_states = self.create_request_for_complete_state(REQUEST_ID)
        self.control_interface.write_request_to_control_interface(request_workload_states)

        workload_states = self.control_interface.read_from_control_interface(REQUEST_ID)

        print(workload_states)
        return workload_states
    
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
