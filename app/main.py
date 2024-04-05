import ankaios_pb2 as ank
from google.protobuf.internal.encoder import _VarintBytes
from google.protobuf.internal.decoder import _DecodeVarint
from google.protobuf.json_format import MessageToJson
from flask import Flask, render_template

import time
import logging

ANKAIOS_CONTROL_INTERFACE_BASE_PATH = "/run/ankaios/control_interface"
WAITING_TIME_IN_SEC = 5
REQUEST_ID = "ank_dashboard"

def create_logger():
    """
    Create a logger with custom format and default log level.
    """
    formatter = logging.Formatter('%(asctime)s %(message)s', datefmt="%FT%TZ")
    logger = logging.getLogger("custom_logger")
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger

logger = create_logger()

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    """
    Returns the complete state of the ankaios system
    as a Json string.
    """
    return render_template('index.html')

@app.route('/completeState', methods=['GET'])
def get_complete_state():
    """
    Returns the complete state of the ankaios system
    as a Json string.
    """
    logger.info("Received http request.")
    return read_complete_state()

def create_request_for_complete_state():
    """
    Create a Request to request the CompleteState
    for querying the workload states.
    """

    return ank.ToServer(
        request=ank.Request(
            completeStateRequest=ank.CompleteStateRequest(
                fieldMask=["workloadStates"]
            ),
            requestId=REQUEST_ID,
        )
    )

def write_request_to_control_interface(request):
    """
    Writes the given request into the
    control interface output fifo.
    """

    with open(f"{ANKAIOS_CONTROL_INTERFACE_BASE_PATH}/output", "ab") as f:

        request_byte_len = request.ByteSize() # Length of the msg
        proto_request_msg = request.SerializeToString() # Serialized proto msg

        logger.info(f"Sending Request containing details for requesting all workload states:\nToServer {{{request}}}\n")
        f.write(_VarintBytes(request_byte_len)) # Send the byte length of the proto msg
        f.write(proto_request_msg) # Send the proto msg itself
        f.flush()


def read_from_control_interface():
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
                logger.info(f"Invalid response, parsing error: '{e}'")
                continue

            request_id = from_server.response.requestId
            if from_server.response.requestId == REQUEST_ID:
                msg_json = MessageToJson(from_server)
                logger.info(f"JSON-Response: {msg_json}")
                return msg_json
            else:
                logger.info(f"RequestId does not match. Skipping messages from requestId: {request_id}")

def read_complete_state():
    request_complete_state = create_request_for_complete_state()
    write_request_to_control_interface(request=request_complete_state)
    return read_from_control_interface()

# Remember using ANK_BIN_DIR=/workspaces/ankaios/target/x86_64-unknown-linux-musl/debug ./run_dashboard.sh
# podman logs -f $(podman ps -a | grep ank_dashboard | awk '{print $1}')
if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5001")
