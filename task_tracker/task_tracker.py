"""A small command-line task tracker with local JSON storage."""

import argparse
import json
import os
from pathlib import Path
import sys
import tempfile


DEFAULT_FILE = Path.home() / ".task_tracker" / "tasks.json"


def load_tasks(path):
    """Load saved tasks, or start an empty list when there is no file yet."""
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"Could not read task file: {exc}") from exc
    if not isinstance(data, list):
        raise ValueError("Task file must contain a list of tasks.")
    seen_ids = set()
    for task in data:
        if (not isinstance(task, dict)
                or type(task.get("id")) is not int or task["id"] < 1
                or not isinstance(task.get("title"), str) or not task["title"].strip()
                or type(task.get("done")) is not bool
                or task["id"] in seen_ids):
            raise ValueError("Task file contains an invalid task.")
        seen_ids.add(task["id"])
    return data


def save_tasks(path, tasks):
    """Write tasks through a temporary file so an interrupted write is safer."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=path.parent, delete=False
        ) as temporary:
            temporary_path = Path(temporary.name)
            json.dump(tasks, temporary, indent=2, ensure_ascii=False)
            temporary.write("\n")
        os.replace(temporary_path, path)
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


def build_parser():
    parser = argparse.ArgumentParser(description="Keep track of your tasks.")
    parser.add_argument(
        "--file", type=Path, default=DEFAULT_FILE,
        help="storage file (default: ~/.task_tracker/tasks.json)",
    )
    commands = parser.add_subparsers(dest="command", required=True)
    add = commands.add_parser("add", help="add a task")
    add.add_argument("title", help="task description")
    commands.add_parser("list", help="show all tasks")
    done = commands.add_parser("done", help="mark a task completed")
    done.add_argument("id", type=int, help="task ID")
    delete = commands.add_parser("delete", help="delete a task")
    delete.add_argument("id", type=int, help="task ID")
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        tasks = load_tasks(args.file)
        if args.command == "list":
            if not tasks:
                print("No tasks yet. Add one with the add command.")
            for task in tasks:
                mark = "x" if task["done"] else " "
                print(f"{task['id']}. [{mark}] {task['title']}")
            return 0

        if args.command == "add":
            title = args.title.strip()
            if not title:
                raise ValueError("Task title cannot be empty.")
            task = {"id": max((item["id"] for item in tasks), default=0) + 1,
                    "title": title, "done": False}
            tasks.append(task)
            message = f"Added task {task['id']}: {title}"
        else:
            task = next((item for item in tasks if item["id"] == args.id), None)
            if task is None:
                raise ValueError(f"Task {args.id} was not found.")
            if args.command == "done":
                task["done"] = True
                message = f"Completed task {task['id']}: {task['title']}"
            else:
                tasks.remove(task)
                message = f"Deleted task {task['id']}: {task['title']}"
        save_tasks(args.file, tasks)
        print(message)
        return 0
    except (OSError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
