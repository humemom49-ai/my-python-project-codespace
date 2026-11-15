# Task Tracker

A simple command-line to-do list built with Python's standard library. No
extra packages are needed.

From the repository root, run:

```bash
python task_tracker/task_tracker.py add "Finish my homework"
python task_tracker/task_tracker.py add "Read a book"
python task_tracker/task_tracker.py list
python task_tracker/task_tracker.py done 1
python task_tracker/task_tracker.py delete 2
```

Tasks are saved in `~/.task_tracker/tasks.json`, so they remain available
between runs. Use `--file` **before** the command to choose another file:

```bash
python task_tracker/task_tracker.py --file my-tasks.json list
```

Run the tests from the repository root:

```bash
python -m unittest discover -s tests
```
