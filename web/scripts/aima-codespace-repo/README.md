# aima-codespace — student workspace template

**Fork** this repository into your GitHub account, then **rename** it to `aima-<your-github-username>` (for example `aima-janedoe`).

Open your fork in **GitHub Codespaces**: **Code** → **Codespaces** → **Create codespace on main**.

## Why fork and rename?

- Gives instructors a predictable pattern to find student work (`aima-*` forks).
- Works with GitHub Classroom “template repository” or manual fork workflows.
- Keeps your assignments and commits isolated from the upstream template.

## Environment

- Python **3.12** (see `.devcontainer/`). Dependencies: `requirements.txt`.

## Exercises

See [`exercises/README.md`](exercises/README.md). From the repository root:

```bash
pip install -r requirements.txt
pytest exercises -q
```

## Course context

Maintained for **AIMA 5001 — Classroom** on the [programs catalog](https://programs.castalia.institute/catalog/aima). The main AIMA course repository is [InquiryInstitute/aima](https://github.com/InquiryInstitute/aima). For GitHub Classroom setup notes, see the [Classroom setup guide](https://github.com/InquiryInstitute/aima/blob/main/docs/CLASSROOM_SETUP.md).

## License

Follow your institution’s policy; template content is provided for course delivery alongside Castalia / Inquiry Institute programs.
