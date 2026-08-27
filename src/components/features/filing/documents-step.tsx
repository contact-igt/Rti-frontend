import { FilePlus2, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SupportingDocument } from "@/types/filing";

type MimeType = SupportingDocument["mimeType"];

export function DocumentsStep({ documents, bplRequired, onChange }: { documents: SupportingDocument[]; bplRequired: boolean; onChange: (documents: SupportingDocument[]) => void }) {
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState<MimeType>("application/pdf");
  const [sizeKb, setSizeKb] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");

  function addDocument() {
    const sizeBytes = Math.round(Number(sizeKb) * 1024);
    if (documents.length >= 5) { setError("You can add metadata for up to five documents."); return; }
    if (!fileName.trim() || /[\\/]/.test(fileName) || fileName.length > 255) { setError("Enter a file name without a folder path, up to 255 characters."); return; }
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > 5 * 1024 * 1024) { setError("Enter a document size greater than 0 KB and no more than 5 MB."); return; }
    if (purpose.trim().length > 200) { setError("Shorten the purpose to 200 characters or fewer."); return; }
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `document-${Date.now()}`;
    onChange([...documents, { id, fileName: fileName.trim(), mimeType, sizeBytes, purpose: purpose.trim() || null }]);
    setFileName(""); setSizeKb(""); setPurpose(""); setError("");
  }

  return (
    <section className="documents-section" aria-labelledby="documents-title">
      <div className="subsection-heading"><FilePlus2 aria-hidden="true" /><div><h2 id="documents-title">Document details</h2><p>{bplRequired ? "BPL proof details are required for a fee-exempt application." : "Supporting document details are optional."}</p></div></div>
      <div className="prototype-note"><Info aria-hidden="true" /><p><strong>Metadata only in this prototype</strong> RTI Saathi records the document name, type, size and purpose. It does not upload the actual file in this release.</p></div>
      {documents.length ? <div className="document-rows">{documents.map((document) => <div key={document.id}><span className="file-badge">{document.mimeType === "application/pdf" ? "PDF" : document.mimeType === "image/png" ? "PNG" : "JPG"}</span><div><strong>{document.fileName}</strong><small>{Math.ceil(document.sizeBytes / 1024)} KB{document.purpose ? ` · ${document.purpose}` : ""}</small></div><button type="button" onClick={() => onChange(documents.filter((item) => item.id !== document.id))} aria-label={`Remove ${document.fileName}`}><Trash2 aria-hidden="true" /></button></div>)}</div> : null}
      <div className="document-metadata-form">
        <div className="field-group"><label htmlFor="document-name">File name</label><input id="document-name" value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder={bplRequired ? "BPL-certificate.pdf" : "supporting-record.pdf"} maxLength={255} /></div>
        <div className="field-group"><label htmlFor="document-type">File type</label><select id="document-type" value={mimeType} onChange={(event) => setMimeType(event.target.value as MimeType)}><option value="application/pdf">PDF</option><option value="image/jpeg">JPEG image</option><option value="image/png">PNG image</option></select></div>
        <div className="field-group"><label htmlFor="document-size">Size in KB</label><input id="document-size" value={sizeKb} onChange={(event) => setSizeKb(event.target.value)} inputMode="numeric" placeholder="450" /></div>
        <div className="field-group document-purpose"><label htmlFor="document-purpose">Purpose</label><input id="document-purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder={bplRequired ? "BPL proof" : "Optional description"} maxLength={200} /></div>
        <button className="button button--secondary" type="button" disabled={documents.length >= 5} onClick={addDocument}><FilePlus2 aria-hidden="true" /> Add document details</button>
      </div>
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      <p className="document-limit">Supported metadata: PDF, JPEG or PNG · Maximum 5 MB each · Up to five documents</p>
    </section>
  );
}
