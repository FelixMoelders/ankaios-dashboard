# Ankaios Dashboard

The Ankaios Dashboard ist the ui interface for [Eclipse Ankaios](https://github.com/eclipse-ankaios/ankaios) project. It offers insights into a running ankaios cluster, allows for modification/deletion/creation of workloads and offers a dependency graph for easier understanding of the interdependencies between workloads. If you didn't use the Ankaios CLI commands so far, the dashboard is a powerful tool to understand the functionality of ankaios. Furthermore, if you are running into any issues during the execution of your ankaios workloads, it is a good starting point to start debugging, especially for finding workloads that are missing but other workloads are depending on.

The ankaios dashboard is started as a workload within the ankaios cluster. More Info on how to get started may be found in the next chapter.

<center>

| Dashboard version | Tested with Ankaios |
|:-----------------:|:-------------------:|
| v0.1, v0.1.1      | v0.3                |
| v0.2              | v0.4                |

</center>

![Architecture](/doc/Architecture.PNG)

## How to use the dashboard out of the box?

Add the following entry to your startupState.yaml for ankaios and you are ready to go.

   ```yaml
   apiVersion: v0.1
   workloads:
     Ankaios_Dashboard:
       runtime: podman
       agent: agent_A
       restart: true
       updateStrategy: AT_LEAST_ONCE
       accessRights:
         allow: []
         deny: []
       restartPolicy: NEVER 
       dependencies:
       runtimeConfig: |
          image: ghcr.io/felixmoelders/ankaios-dashboard:latest
          commandOptions: ["-p", "5001:5001", "-e", "PASSWORD=admin"]
       controlInterfaceAccess:
           allowRules:
             - type: StateRule
               operation: ReadWrite
               filterMask:
                 - "desiredState"
                 - "workloadStates"
   ```

Call the dashboard via localhost:5001. The login credentials are by default

> - User: **admin**
> - Password: **admin**
   
   

## How to build and run the dashboard during development?

1. Open the project in VS Code Dev Container, with the provided configuration.
2. Build and run the dashboard:

   ```shell
   ./run_dashboard.sh
   ```

   The Ankaios executables are provided by the dev container under the default path [Installation instructions](https://eclipse-ankaios.github.io/ankaios/main/usage/installation/). If you want to use another version, you can specify an alternative Ankaios executable path like the following:

   ```shell
   ANK_BIN_DIR=/absolute/path/to/ankaios/executables ./run_dashboard.sh
   ```

   In case you get errors like `DNS lookup error` your are probably within a VPN that restricts access to some DNS servers.
   To workaround that [problem caused by buildah](https://github.com/containers/buildah/issues/3806) you need to specify a DNS server that should be used like:

   ```shell
   ./run_dashboard.sh --dns=<IP address of DNS server>
   ```

3. Open an additional terminal in the dev container and run the following shell command to see the logs of the example workload:

   ```shell
   podman logs -f $(podman ps -a | grep Ankaios_Dashboard | awk '{print $1}')
   ```

## Use the protobuf definition in python

Execute the following command in the dev container:

   ```shell
   protoc --python_out=/workspaces/ankaios-dashboard/app/ --proto_path=/tmp/ankaios/api/proto/ ankaios.proto && touch /workspaces/ankaios-dashboard/app/__init__.py
   ```


## Ankaios logs

Run the following command to see the Ankaios server logs:

   ```shell
   tail -f /tmp/ankaios-server.log
   ```

Run the following command to see the Ankaios agent logs:

   ```shell
   tail -f /tmp/ankaios-agent_A.log
   ```
