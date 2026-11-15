import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "task_tracker" / "task_tracker.py"


class TaskTrackerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.file = Path(self.temporary.name) / "data" / "tasks.json"

    def run_tracker(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--file", str(self.file), *args],
            capture_output=True, text=True, check=False,
        )

    def test_task_lifecycle_persists_between_runs(self):
        self.assertIn("No tasks yet", self.run_tracker("list").stdout)
        self.assertEqual(self.run_tracker("add", " Buy milk ").returncode, 0)
        self.assertEqual(self.run_tracker("add", "Read").returncode, 0)
        self.assertIn("1. [ ] Buy milk", self.run_tracker("list").stdout)
        self.assertEqual(self.run_tracker("done", "1").returncode, 0)
        self.assertIn("1. [x] Buy milk", self.run_tracker("list").stdout)
        self.assertEqual(self.run_tracker("delete", "2").returncode, 0)
        self.assertEqual(json.loads(self.file.read_text()), [
            {"id": 1, "title": "Buy milk", "done": True}
        ])

    def test_invalid_input_does_not_write_a_file(self):
        self.assertNotEqual(self.run_tracker("add", "  ").returncode, 0)
        self.assertNotEqual(self.run_tracker("done", "1").returncode, 0)
        self.assertFalse(self.file.exists())

    def test_bad_file_is_not_overwritten(self):
        self.file.parent.mkdir()
        for contents in ("not json", '{"not": "a list"}',
                         '[{"id": 1, "title": "Task", "done": "no"}]'):
            self.file.write_text(contents)
            result = self.run_tracker("add", "New task")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Error:", result.stderr)
            self.assertEqual(self.file.read_text(), contents)

    def test_missing_id_is_reported_without_changing_tasks(self):
        self.run_tracker("add", "One")
        before = self.file.read_text()
        result = self.run_tracker("delete", "42")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("not found", result.stderr)
        self.assertEqual(self.file.read_text(), before)


if __name__ == "__main__":
    unittest.main()
