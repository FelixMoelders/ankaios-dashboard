from Logger import Logger
from ankaios_sdk import Workload, Ankaios, WorkloadStateEnum, AnkaiosException
import json

logger = Logger.get_custom_logger()

class AnkCommunicationService:

    def __init__(self) -> None:
        self.logger = Logger.get_custom_logger()
        self.ankaios = Ankaios()

    def map_json_to_workload(self, json):
        workload_name = json["workloadName"]
        workload_builder = Workload.builder().workload_name(workload_name)
        
        if "agent" in json:
            workload_builder.agent_name(json["agent"])

        if "runtime" in json:
            workload_builder.runtime(json["runtime"])

        if "restartPolicy" in json:
            workload_builder.restart_policy(json["restartPolicy"])

        if "runtimeConfig" in json:
            workload_builder.runtime_config(json["runtimeConfig"])

        if "tags" in json:
            for kv_pair in json["tags"]:
                workload_builder.add_tag(key=kv_pair["key"], value=kv_pair["value"])

        if "controlInterfaceAccess" in json:
            if "allowRules" in json["controlInterfaceAccess"]:
                for rule in json["controlInterfaceAccess"]["allowRules"]:
                    workload_builder.add_allow_rule(rule["operation"], rule["filterMask"])

            if "denyRules" in json["controlInterfaceAccess"]:
                for rule in json["controlInterfaceAccess"]["denyRules"]:
                    workload_builder.add_deny_rule(rule["operation"], rule["filterMask"])

        # map strings to enum type of ank_base.proto
        if "dependencies" in json and "dependencies" in json["dependencies"]:
            dependencies = json["dependencies"]
            for key, value in dependencies["dependencies"].items():
                workload_builder.add_dependency(workload_name=key, condition=value)

        workload = workload_builder.build()
        print(workload)
        return workload 

    def get_complete_state(self):
        complete_state = self.ankaios.get_state(timeout=5, field_masks=["desiredState", "workloadStates"]).to_dict()
        
        return complete_state
    
    def add_new_workload(self, json):
        workload = self.map_json_to_workload(json)

        update_response = {}

        try:
            update_response = self.ankaios.apply_workload(workload)
            print(update_response)
        except AnkaiosException as e:
            print("Ankaios Exception occured: ", e)
        
        return update_response
    
    def deleteWorkloads(self, json):
        for workload_name in json:
            try:
                ret = self.ankaios.delete_workload(workload_name)
                print(ret)
            except AnkaiosException as e:
                print("Ankaios Exception occured: ", e)

    def update_config(self, json):
        workload = self.map_json_to_workload(json)
        
        update_response = {}

        try:
            update_response = self.ankaios.apply_workload(workload)
            print(update_response)
        except AnkaiosException as e:
            print("Ankaios Exception occured: ", e)
        
        return update_response
