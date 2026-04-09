"""Count nodes reachable from a start node."""


def reachable_count(graph: dict[str, list[str]], start: str) -> int:
    """Number of distinct nodes reachable from start (including start)."""
    seen: set[str] = set()
    stack = [start]
    while stack:
        n = stack.pop()
        if n in seen:
            continue
        seen.add(n)
        for nb in graph.get(n, []):
            if nb not in seen:
                stack.append(nb)
    return len(seen)
