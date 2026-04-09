"""Tests for exercises/01_search_basics/student.py"""

import importlib.util
from pathlib import Path

_p = Path(__file__).resolve().parents[1] / 'student.py'
_spec = importlib.util.spec_from_file_location('student_search_basics', _p)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
bfs_order = _mod.bfs_order


def test_bfs_line():
    g = {'A': ['B'], 'B': ['C'], 'C': []}
    assert bfs_order(g, 'A') == ['A', 'B', 'C']


def test_bfs_branching_order():
    g = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}
    assert bfs_order(g, 'A') == ['A', 'B', 'C', 'D']


def test_bfs_single_node():
    g = {'X': []}
    assert bfs_order(g, 'X') == ['X']
