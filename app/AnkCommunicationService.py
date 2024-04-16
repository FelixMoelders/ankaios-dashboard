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
    
    def create_request_for_new_workload(self, request_id, json):
        # TODO restartPolicy

        workloadName = json["workloadName"]

        return ank.ToServer(
            request=ank.Request(
                    requestId=REQUEST_ID,
                    updateStateRequest=ank.UpdateStateRequest(
                        newState=ank.CompleteState(
                            desiredState=ank.State(
                                    apiVersion="v0.1",
                                    workloads={
                                        workloadName: ank.Workload(
                                            agent=json["agent"],
                                            runtime=json["runtime"],
                                            restartPolicy=ank.NEVER,
                                            runtimeConfig=json["runtimeConfig"])
                            }
                        )
                    ),
                    updateMask=[f"desiredState.workloads.{workloadName}"]
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
        request_new_workload = self.create_request_for_new_workload(REQUEST_ID, json)
        self.control_interface.write_request_to_control_interface(request_new_workload)

        return self.control_interface.read_from_control_interface(REQUEST_ID)
    
    def deleteWorkloads(self, json):
        for workload_name in json:
            delete_request = self.create_request_for_workload_deletion(REQUEST_ID, workload_name)
            self.control_interface.write_request_to_control_interface(delete_request)
            print(self.control_interface.read_from_control_interface(REQUEST_ID))
            

