# Shared attributes used my multiple models
from typing import Literal

status = Literal['setup', 'processing', 'uploading', 'analyzing', 'completed', 'error']
