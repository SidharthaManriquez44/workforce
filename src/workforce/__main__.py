"""

CLI for Docker operation and the scheduled jobs.

"""

import argparse
import json
from datetime import datetime
from hashlib import sha256
from pathlib import Path

from .contracts import (
    PROTOCOL,
    TZ,
    Invalid,
    day,
    require,
    validate_historical,
    validate_run,
)
from .storage.files import write_json


def stage(args):
    source = Path(args.file)
    document = json.loads(source.read_text(encoding="utf-8"))
    if args.kind == "run":
        validate_run(document)
        name = f"capture-{document['run_id']}.json"
    else:
        validate_historical(document)
        # File name comes from a digest to allow source IDs with arbitrary text.
        name = f"historical-{sha256(document['id'].encode()).hexdigest()}.json"
        document = {"kind": "historical", "source": document}
    target = Path(args.directory) / "inbox" / name
    write_json(target, document, replace=False)
    return {
        "queued": str(target),
        "receipt": str(target.parent.parent / "receipts" / name),
    }


def main():
    parser = argparse.ArgumentParser(prog=f"python -m {__package__}")
    sub = parser.add_subparsers(dest="command", required=True)
    for command in ("sync", "init", "state"):
        sub.add_parser(command)
    enqueue = sub.add_parser("stage")
    enqueue.add_argument("kind", choices=("run", "historical"))
    enqueue.add_argument("file")
    enqueue.add_argument("--directory", default="data")
    weekly = sub.add_parser("weekly")
    weekly.add_argument("end")
    weekly.add_argument("--directory", default="data")
    args = parser.parse_args()
    try:
        if args.command == "stage":
            result = stage(args)
        elif args.command == "weekly":
            cut = next((cut for cut in PROTOCOL["cuts"] if cut[1] == args.end), None)
            require(
                cut and day(args.end) <= datetime.now(TZ).date(),
                "Fecha de corte inválida.",
            )
            root = Path(args.directory)
            name = f"weekly-{args.end}.json"
            target = root / "inbox" / name
            write_json(
                target,
                {"kind": "weekly", "period_start": cut[0], "period_end": cut[1]},
                replace=False,
            )
            result = {"queued": str(target), "receipt": str(root / "receipts" / name)}
        elif args.command == "sync":
            from .storage.inbox import sync

            result = {"receipts": sync()}
        elif args.command == "init":
            from .storage.storage import init_db

            init_db()
            result = {"postgres": "ok"}
        else:
            from .storage.storage import read_state

            result = read_state()
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (Invalid, OSError, json.JSONDecodeError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
