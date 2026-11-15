import contextlib
import importlib
import io
import unittest
from unittest.mock import patch

import library


class LibraryTests(unittest.TestCase):
    def setUp(self):
        self.catalog = {}

    def call_with_input(self, function, *answers):
        output = io.StringIO()
        with patch("builtins.input", side_effect=answers), contextlib.redirect_stdout(output):
            result = function(self.catalog)
        return result, output.getvalue()

    def test_import_does_not_start_menu(self):
        with patch("builtins.input", side_effect=AssertionError("unexpected input")):
            importlib.reload(library)

    def test_add_normalizes_title_and_rejects_duplicates_and_empty_titles(self):
        result, _ = self.call_with_input(library.add_checker, "  The Hobbit  ")
        self.assertIs(result, self.catalog)
        self.assertEqual(self.catalog, {"the hobbit": "on shelf"})
        _, duplicate = self.call_with_input(library.add_checker, "THE HOBBIT")
        _, empty = self.call_with_input(library.add_checker, "   ")
        self.assertIn("it is refused", duplicate)
        self.assertIn("it is refused", empty)
        self.assertEqual(self.catalog, {"the hobbit": "on shelf"})

    def test_lend_and_return_a_book(self):
        self.catalog["the hobbit"] = "on shelf"
        self.call_with_input(library.lend_checker, " THE HOBBIT ", " Alice ")
        self.assertEqual(self.catalog["the hobbit"], "alice")
        _, output = self.call_with_input(library.lend_checker, "the hobbit")
        self.assertIn("it is refused", output)
        self.call_with_input(library.return_checker, " The Hobbit ")
        self.assertEqual(self.catalog["the hobbit"], "on shelf")
        _, output = self.call_with_input(library.return_checker, "the hobbit")
        self.assertIn("it is refused", output)

    def test_invalid_borrowers_and_missing_books_are_rejected(self):
        self.catalog["book"] = "on shelf"
        for name in (" ", " ON SHELF "):
            _, output = self.call_with_input(library.lend_checker, "book", name)
            self.assertIn("name is not correct", output)
        for function in (library.lend_checker, library.return_checker):
            _, output = self.call_with_input(function, "missing")
            self.assertIn("it is refused", output)
        self.assertEqual(self.catalog, {"book": "on shelf"})

    def test_list_shows_borrowed_books_and_shelf_count(self):
        self.catalog.update({"book": "alice", "other": "on shelf"})
        _, output = self.call_with_input(library.catalog_checker)
        self.assertIn("book is with alice", output)
        self.assertIn("on shelf: 1", output)

    def test_main_handles_unknown_commands_and_quit(self):
        output = io.StringIO()
        with patch("builtins.input", side_effect=["unknown", " QUIT "]), contextlib.redirect_stdout(output):
            library.main()
        self.assertIn("unknown command", output.getvalue())


if __name__ == "__main__":
    unittest.main()
