# 01 — BFS traversal order

You are given a **directed graph** as an adjacency list: `dict[str, list[str]]`. Neighbor order in each list matters when breaking ties.

Implement `bfs_order(graph, start)` so it returns nodes in the order they are **first dequeued** from the BFS queue (the start node is first).

Use a FIFO queue; enqueue neighbors in the order they appear in the adjacency list.

Edit **`student.py`**, then run:

```bash
pytest exercises/01_search_basics -q
```
