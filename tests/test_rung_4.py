import contextlib
import importlib
import io
import unittest

import rung_4


class LockerTests(unittest.TestCase):
    def test_assigns_a_free_locker_and_trims_name(self):
        lockers = {7: "Sam"}
        self.assertTrue(rung_4.assign_locker(lockers, 8, " Ann "))
        self.assertEqual(lockers, {7: "Sam", 8: "Ann"})

    def test_does_not_replace_existing_assignment(self):
        lockers = {7: "Sam"}
        self.assertFalse(rung_4.assign_locker(lockers, 7, "Ann"))
        self.assertEqual(lockers, {7: "Sam"})

    def test_rejects_blank_name(self):
        lockers = {}
        self.assertFalse(rung_4.assign_locker(lockers, 8, "   "))
        self.assertEqual(lockers, {})

    def test_releases_assigned_locker(self):
        lockers = {7: "Sam"}
        self.assertTrue(rung_4.release_locker(lockers, 7))
        self.assertEqual(lockers, {})
        self.assertFalse(rung_4.release_locker(lockers, 7))
        self.assertTrue(rung_4.assign_locker(lockers, 7, "Ann"))

    def test_import_does_not_run_the_example(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            importlib.reload(rung_4)
        self.assertEqual(output.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
