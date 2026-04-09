"""AIMA 5001 — search basics (student implementations)."""

from collections import deque


def bfs_order(graph: dict[str, list[str]], start: str) -> list[str]:
    """Breadth-first: return nodes in dequeue order (first visit)."""
    visited: set[str] = set()
    out: list[str] = []
    q: deque[str] = deque()
    q.append(start)
    visited.add(start)
    while q:
        n = q.popleft()
        out.append(n)
        for nb in graph.get(n, []):
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
    return out
