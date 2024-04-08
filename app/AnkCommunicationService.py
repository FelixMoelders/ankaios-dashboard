import ankaios_pb2 as ank
from Logger import Logger
from ControlInterface import ControlInterface

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

    def get_complete_state(self):
        request_complete_state = self.create_request_for_complete_state(REQUEST_ID)
        self.control_interface.write_request_to_control_interface(request_complete_state)

        return self.control_interface.read_from_control_interface(REQUEST_ID)

