/* ============================================================
   FILE: immunizations.js
   PURPOSE: Page specific behavior for immunizations.html. At
            present this file exposes a single function that
            prints a clean, formatted copy of the patient's
            immunization record.
   ============================================================
   This script is currently driven by example data so that the
   print workflow can be demonstrated end to end. When the
   page is wired to real data, replace the EXAMPLE_RECORD
   object below with the values pulled from the page DOM or
   from a backend service, then leave the rendering and
   print logic untouched.
   ============================================================ */


/* ------------------------------------------------------------
   SECTION 1: Example Record Data
   ------------------------------------------------------------
   The values below mirror the immunization history that the
   immunizations.html page currently displays. Updating one
   side without the other will make the printed copy diverge
   from the on screen view, so keep them in sync.
   ------------------------------------------------------------ */
const EXAMPLE_RECORD = {
    patient: {
        name:    'Jane Smith',
        ouId:    '113000000',
        dob:     '03/14/2002',
        provider: 'Goddard Health Center'
    },
    immunizations: [
        {
            name:   'Hepatitis B Requirement',
            status: 'Complete',
            detail: '3 of 3 doses completed',
            doses:  ['#1: 01/23/1998', '#2: 02/23/1998', '#3: 08/05/1998']
        },
        {
            name:   'MMR (Measles, Mumps, Rubella)',
            status: 'Fully verified',
            detail: 'All three components on file',
            doses: [
                'Measles: 03/06/2000, 07/09/2006',
                'Mumps: 09/12/2024, 10/10/2024',
                'Rubella: 03/05/1999, 09/12/2024'
            ]
        },
        {
            name:   'TB Skin Test',
            status: 'Negative',
            detail: 'Latest test: 08/14/2024',
            doses:  []
        }
    ]
};


/* ------------------------------------------------------------
   SECTION 2: HTML Builder
   ------------------------------------------------------------
   Returns a complete HTML document as a string. The document
   is fully self contained with inline styles so it does not
   depend on any of the portal's stylesheets being available
   when it is loaded into the new print window.
   ------------------------------------------------------------ */
function buildPrintableHtml(record) {

    // Format today's date for the printed footer.
    const today = new Date().toLocaleDateString('en-US', {
        year:  'numeric',
        month: 'long',
        day:   'numeric'
    });

    // Render one record entry as a row of HTML.
    const recordRows = record.immunizations.map(item => {
        const dosesHtml = item.doses.length
            ? `<ul class="dose-list">${item.doses.map(d => `<li>${d}</li>`).join('')}</ul>`
            : '';
        return `
            <tr>
                <td class="rec-name">
                    <strong>${item.name}</strong>
                    <div class="rec-detail">${item.detail}</div>
                    ${dosesHtml}
                </td>
                <td class="rec-status">${item.status}</td>
            </tr>
        `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Immunization Record - ${record.patient.name}</title>
    <style>
        @page { margin: 0.75in; }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e3a5f;
            line-height: 1.5;
            margin: 0;
        }

        h1 { font-size: 20px; margin: 0 0 4px 0; color: #1e3a5f; }
        h2 { font-size: 13px; font-weight: 600; color: #4b6fa8;
             text-transform: uppercase; letter-spacing: 0.05em;
             margin: 24px 0 8px 0; }

        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header .sub  { font-size: 12px; color: #4b6fa8; }
        .header .meta { font-size: 11px; color: #4b6fa8; margin-top: 8px; }

        table.patient-info,
        table.records {
            width: 100%;
            border-collapse: collapse;
        }
        table.patient-info td {
            padding: 4px 12px 4px 0;
            font-size: 12px;
            vertical-align: top;
        }
        table.patient-info td.label {
            color: #4b6fa8;
            font-weight: 600;
            width: 110px;
        }

        table.records {
            border: 1px solid #dbe8f8;
            margin-top: 4px;
        }
        table.records th {
            background: #f0f5ff;
            font-size: 11px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #4b6fa8;
            padding: 8px 12px;
            border-bottom: 1px solid #dbe8f8;
        }
        table.records td {
            padding: 12px;
            border-bottom: 1px solid #f0f5ff;
            font-size: 12px;
            vertical-align: top;
        }
        table.records tr:last-child td { border-bottom: none; }

        .rec-detail { font-size: 11px; color: #8fafd6; margin-top: 2px; }
        .rec-status { width: 120px; font-weight: 600; color: #166534; }

        .dose-list {
            margin: 8px 0 0 0;
            padding-left: 18px;
            font-size: 11px;
            color: #4b6fa8;
        }

        .footer {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #dbe8f8;
            font-size: 10px;
            color: #8fafd6;
            line-height: 1.5;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>OU HealthConnection</h1>
        <div class="sub">Verified Immunization Record</div>
        <div class="meta">Issued ${today} &middot; ${record.patient.provider}</div>
    </div>

    <h2>Patient Information</h2>
    <table class="patient-info">
        <tr><td class="label">Name</td>          <td>${record.patient.name}</td></tr>
        <tr><td class="label">OU ID</td>         <td>${record.patient.ouId}</td></tr>
        <tr><td class="label">Date of Birth</td> <td>${record.patient.dob}</td></tr>
    </table>

    <h2>Immunization History</h2>
    <table class="records">
        <thead>
            <tr><th>Immunization</th><th>Status</th></tr>
        </thead>
        <tbody>
            ${recordRows}
        </tbody>
    </table>

    <div class="footer">
        This record reflects vaccination data on file with OU Health Services
        as of the issue date above. For verification, contact the Goddard
        Health Center directly. This document does not replace an official
        sealed record where one is required.
    </div>

</body>
</html>`;
}


/* ------------------------------------------------------------
   SECTION 3: Print Trigger
   ------------------------------------------------------------
   Opens a new window, writes the printable document into it,
   and triggers the browser print dialog. The window closes
   itself after printing on browsers that allow it.
   ------------------------------------------------------------ */
function printImmunizationRecord() {
    const printWindow = window.open('', '_blank', 'width=850,height=1100');

    if (!printWindow) {
        alert(
            'Please allow pop ups for this site so the printable ' +
            'immunization record can open in a new window.'
        );
        return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintableHtml(EXAMPLE_RECORD));
    printWindow.document.close();

    // Wait for the new document to render before invoking print.
    // Some browsers fire the print dialog before layout is ready
    // when print is called synchronously after document.close().
    printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
    };
}