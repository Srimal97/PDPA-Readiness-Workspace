# PDPA Readiness Workspace

A gap assessment workspace for Sri Lanka's Personal Data Protection Act, No. 9 of 2022, as amended by Act No. 22 of 2025. Built for TechNeura Labs.

A scoping profile decides which checks apply. Documents and a short question list supply the evidence. A consultant records findings, and the workspace produces the gap register, the remediation roadmap and the report.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell. Loads the fonts, the stylesheet and the two scripts. |
| `css/app.css` | All styling, light and dark themes. |
| `js/library.js` | The control library: 119 checks, the scoping questions, the document types, the commencement labels and the legal determinations. Statutory text is quoted from the Acts. |
| `js/app.js` | The application: views, scoring, saving, uploads, the document check, the report and the guided tours. |

There is no build step and there are no dependencies to install. The code holds no keys or secrets.

## Running it

**In Claude (full features).** The workspace is published as a Claude artifact. There it saves shared data, stores uploaded files, lets a consultant run the Claude document check, and separates consultant and customer access.

**Anywhere else (demonstration only).** Open `index.html` in a browser or serve the folder from any static host. In this mode the workspace shows the example data and the guided tours, and saves only to that visitor's browser. Stored uploads, shared saving, the document check and file downloads are not available.

## Updating the law

When the Data Protection Authority gazettes rules (breach notification, impact assessment form, Data Protection Officer thresholds, cross-border instruments), update `js/library.js`:

1. Change the `comm` value of the affected checks and edit their `note`.
2. Update `COUNSEL_POINTS` and the `VERIFIED` date.
3. Quote statutory text exactly. Mark merged text with `amended: true`.

The published Claude artifact does not update from this repository. Republish it after changing the files.

## Sources

- Personal Data Protection Act, No. 9 of 2022
- Personal Data Protection (Amendment) Act, No. 22 of 2025
- Extraordinary Gazette No. 2498/16, which appoints 1 January 2027 for sections 2 and 3, Part I and Part III
