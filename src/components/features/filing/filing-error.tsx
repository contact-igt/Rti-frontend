import { AlertCircle, RotateCcw } from "lucide-react";

export function FilingError({ message, onRetry, errorRef }: { message: string; onRetry?: () => void; errorRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="filing-error" role="alert" tabIndex={-1} ref={errorRef}>
      <AlertCircle aria-hidden="true" />
      <div><strong>We couldn’t complete that step</strong><p>{message}</p></div>
      {onRetry ? <button type="button" onClick={onRetry}><RotateCcw aria-hidden="true" /> Try again</button> : null}
    </div>
  );
}
