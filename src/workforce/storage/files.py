"""
Atomic JSON handoff used from the host and the container.
"""

import json
import os
from pathlib import Path
from tempfile import NamedTemporaryFile

from ..contracts import require


def write_json(path, document, *, replace=True):
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(
        mode="w", encoding="utf-8", dir=path.parent, prefix=".", delete=False
    ) as stream:
        temporary = Path(stream.name)
        try:
            json.dump(document, stream, ensure_ascii=False, indent=2, allow_nan=False)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
            temporary.chmod(0o644)
            if replace:
                temporary.replace(path)
            else:
                try:
                    os.link(temporary, path)
                except FileExistsError:
                    require(
                        json.loads(path.read_text(encoding="utf-8")) == document,
                        "La entrega ya existe con contenido distinto.",
                    )
        finally:
            temporary.unlink(missing_ok=True)
