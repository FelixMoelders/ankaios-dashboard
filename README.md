# Ankaios dashboard under construction

Future web interface to control the ankaios system.

## How to run the examples?

1. Open the project in VS Code Dev Container, with the provided configuration.
2. Build and run the dashboard:

   ```shell
   ./run_dashboard.sh
   ```

   If the Ankaios executables are not inside the default path mentioned in the [Installation instructions](https://eclipse-ankaios.github.io/ankaios/main/usage/installation/), you can specify an alternative Ankaios executable path like the following:

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
   podman logs -f $(podman ps -a | grep ank_dashboard | awk '{print $1}')
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
