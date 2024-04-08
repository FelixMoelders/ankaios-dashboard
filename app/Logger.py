import logging


class Logger:

    def __init__(self) -> None:
        pass

    def get_custom_logger():
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