import ankaios_pb2 as ank
from Logger import Logger
from google.protobuf.internal.encoder import _VarintBytes
from google.protobuf.internal.decoder import _DecodeVarint
from google.protobuf.json_format import MessageToJson

ANKAIOS_CONTROL_INTERFACE_BASE_PATH = "/run/ankaios/control_interface"
logger = Logger.get_custom_logger()

class ControlInterface:

    def __init__(self) -> None:
        self.logger = Logger.get_custom_logger()

    def write_request_to_control_interface(self, request):
        """
        Writes the given request into the
        control interface output fifo.
        """

        with open(f"{ANKAIOS_CONTROL_INTERFACE_BASE_PATH}/output", "ab") as f:
            request_byte_len = request.ByteSize() # Length of the msg
            proto_request_msg = request.SerializeToString() # Serialized proto msg

            self.logger.debug(f"Sending Request containing details for requesting all workload states:\nToServer {{{request}}}\n")
            f.write(_VarintBytes(request_byte_len)) # Send the byte length of the proto msg
            f.write(proto_request_msg) # Send the proto msg itself
            f.flush()

    def read_from_control_interface(self, request_id):
        """
        Reads from the control interface input fifo
        and returns the response as a json string.
        """

        with open(f"{ANKAIOS_CONTROL_INTERFACE_BASE_PATH}/input", "rb") as f:

            while True:
                varint_buffer = b'' # Buffer for reading in the byte size of the proto msg
                while True:
                    next_byte = f.read(1) # Consume byte for byte
                    if not next_byte:
                        break
                    varint_buffer += next_byte
                    if next_byte[0] & 0b10000000 == 0: # Stop if the most significant bit is 0 (indicating the last byte of the varint)
                        break
                msg_len, _ = _DecodeVarint(varint_buffer, 0) # Decode the varint and receive the proto msg length

                msg_buf = b'' # Buffer for the proto msg itself
                for _ in range(msg_len):
                    next_byte = f.read(1) # Read exact amount of byte according to the calculated proto msg length
                    if not next_byte:
                        break
                    msg_buf += next_byte

                from_server = ank.FromServer()
                try:
                    from_server.ParseFromString(msg_buf) # Deserialize the received proto msg
                except Exception as e:
                    self.logger.error(f"Invalid response, parsing error: '{e}'")
                    continue

                response_request_id = from_server.response.requestId
                if response_request_id == request_id:
                    msg_json = MessageToJson(from_server)
                    self.logger.info(f"JSON-Response: {msg_json}")
                    return msg_json
                else:
                    self.logger.debug(f"RequestId does not match. Skipping messages from requestId: {response_request_id}")
