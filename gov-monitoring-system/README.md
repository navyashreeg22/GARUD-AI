# Government Training Centre Monitoring System (GTMS)

A production-ready React web application styled with Tailwind CSS for government vocational training audits and AI-assisted compliance verification.

## Architecture & Features

### 1. App Shell & Role-Based Navigation
- Institutional header with security session indicators, national compliance bar, and route switching.
- **Login Portal (`/`)**:
  - Trainee Official Login (`/trainee`)
  - Government Official Login (`/gov`)

### 2. Trainee Official Dashboard (`/trainee`)
- Card-based form interface:
  - **Input 1**: Manual Attendance (Numeric headcount).
  - **Input Group 2**: Infrastructure Status (Numeric inputs for Workbenches, Welding Machines, and Computers).
  - **Input 3**: Discrepancy / Feedback text area with justification remarks.
  - **Action**: "Submit Daily Report" with acknowledgment toast and real-time state synchronization.

### 3. Government Official Dashboard (`/gov`)
- **Triangulated Verification Matrix (3-Column Layout)**:
  - **Column 1 (Reported)**: Displays the manual roll-call attendance submitted by the Trainee.
  - **Column 2 (AI Verified)**: Displays the YOLO-detected AI attendance. Highlights the cell with a light red background (`bg-rose-50/80`), warning icon, and variance indicator when the AI count is lower than the reported headcount. Features an interactive **"View Camera Snapshot"** modal with simulated bounding box vision HUD.
  - **Column 3 (Infrastructure Match)**: Displays sanctioned vs. present equipment table with variance tags, along with the trainee's raw feedback text verbatim.
- **Auditor Endorsement & Audit JSON Export**:
  - Endorse justifications to log reconciliation.
  - Download official statutory audit JSON payload for record keeping.

### 4. REST API Integration Layer
Located in [`src/services/api.js`](src/services/api.js) configured to integrate with any backend REST API endpoint (`/api/v1/centres/:centreId/audit-matrix`).

## Running Locally

```bash
cd gov-monitoring-system
npm install
npm run dev
```

App runs on `http://localhost:5173`.
