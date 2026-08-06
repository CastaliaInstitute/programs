# exam/ — Socratic defense transcript (App-only)

**This directory is written by the Castalia App, not by you.** It holds the transcript of your
Socratic defense — the oral review where three AI faculty question you and judge fluency.

Why it's locked to the App: the credential magisterium issues rests on this transcript, so it must
be tamper-evident. A repo ruleset restricts writes to `exam/**` to the App identity; you have push
access to `work/` but not here. The App commits the transcript, pins it to a commit SHA, and
records its SHA-256 with magisterium against your credential's `verification_id`. Anyone can later
recompute the hash from `magisterium.castalia.institute/verify/<id>` to confirm nothing changed.

You don't configure any of this. It happens automatically at defense time.
