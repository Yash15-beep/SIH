# Agent Workspace Rules

## Automatic memory.md Logging
Upon completing any coding task, feature addition, bug fix, or visual refinement in this workspace, the agent MUST automatically record a structured log entry under the `Changes & Feature Log` section of [memory.md](file:///e:/FreelanceHub/memory.md) without requiring explicit prompting from the user.

Each log entry should follow the established pattern:
```markdown
### [YYYY-MM-DD] Description of the Change
* **Issue**: Brief description of the problem, user request, or visual design gap.
* **Resolution**: 
    * Bullets summarizing the changes in specific files, linking the files with absolute file:/// links.
* **Verification**: Details on how the changes were verified (e.g. builds, manual verification, lint status).
```
