from typing import Dict, Any

# Temporary in-memory storage.
# Later this will be replaced by the database teammate's database layer.

batches: Dict[str, Dict[str, Any]] = {}

# Temporary user storage.
# Later this will be replaced by the database layer.

users: Dict[str, Dict[str, Any]] = {}