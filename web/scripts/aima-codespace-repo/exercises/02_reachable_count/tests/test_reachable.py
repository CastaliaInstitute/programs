import importlib.util
from pathlib import Path

_p = Path(__file__).resolve().parents[1] / 'student.py'
_spec = importlib.util.spec_from_file_location('student_reachable', _p)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
reachable_count = _mod.reachable_count


def test_line():
    g = {'A': ['B'], 'B': ['C'], 'C': []}
    assert reachable_count(g, 'A') == 3


def test_cycle():
    g = {'A': ['B'], 'B': ['A'], 'C': []}
    assert reachable_count(g, 'A') == 2


def test_isolated():
    g = {'X': []}
    assert reachable_count(g, 'X') == 1
