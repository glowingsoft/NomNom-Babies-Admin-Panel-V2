// Demo PDF for mock resources until a real file is uploaded in the session.
const DEMO_PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 72 720 Td (NomNom Babies Resource) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
0000000229 00000 n 
0000000322 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
393
%%EOF`;

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createDemoPdfBlob() {
  return new Blob([DEMO_PDF], { type: 'application/pdf' });
}

export function createDemoResourceFileUrl() {
  return URL.createObjectURL(createDemoPdfBlob());
}

export function slugifyFileName(name) {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}.pdf`;
}

export function initializeResourcesWithFiles(resources) {
  return resources.map((row) => ({
    ...row,
    fileName: row.fileName ?? slugifyFileName(row.name),
    fileUrl: row.fileUrl ?? createDemoResourceFileUrl(),
  }));
}

export function downloadResourceFile(row) {
  if (!row?.fileUrl) {
    return false;
  }

  const link = document.createElement('a');
  link.href = row.fileUrl;
  link.download = row.fileName || slugifyFileName(row.name);
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

export function revokeResourceFileUrl(url) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
