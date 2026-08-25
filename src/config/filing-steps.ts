export type FilingStep = {
  id: string;
  label: string;
  description: string;
};

export const filingSteps: readonly FilingStep[] = [
  { id: "describe-problem", label: "Describe Problem", description: "Explain the issue you need information about." },
  { id: "ai-understanding", label: "AI Understanding", description: "Review the assistant's understanding." },
  { id: "authority-recommendation", label: "Authority Recommendation", description: "Confirm the suggested public authority." },
  { id: "rti-draft", label: "RTI Draft", description: "Review the RTI request draft." },
  { id: "applicant-details", label: "Applicant Details", description: "Provide applicant information." },
  { id: "supporting-documents", label: "Supporting Documents", description: "Add any supporting documents." },
  { id: "payment", label: "Payment", description: "Complete the filing fee step." },
  { id: "success", label: "Success", description: "View submission confirmation." },
];
