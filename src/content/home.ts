export const homeContent = {
  examples: [
    "My pension has been pending and I want to know the file status.",
    "I want records of road work carried out in my area.",
    "I want to know why my scholarship application is still pending.",
    "I want official records related to a recruitment process.",
  ],
  rtiCanAskFor: [
    "Records and documents",
    "File movement and status",
    "Copies of official communications",
    "Recorded reasons, where available",
  ],
  process: [
    { number: "01", title: "Explain", detail: "Tell us the problem in your own words." },
    { number: "02", title: "Understand", detail: "We identify what information could help." },
    { number: "03", title: "Find authority", detail: "Narrow down which public authority may hold it." },
    { number: "04", title: "Draft", detail: "Turn the issue into clear, record-based questions." },
    { number: "05", title: "Review", detail: "You check every detail before moving ahead." },
    { number: "06", title: "File / demo", detail: "Follow filing guidance or use a prototype flow." },
    { number: "07", title: "Track", detail: "Keep dates, status and next steps together." },
    { number: "08", title: "Read the reply", detail: "Understand what was answered and what is missing." },
    { number: "09", title: "Appeal guidance", detail: "Learn possible next steps when a reply falls short." },
  ],
  useCases: [
    { title: "Pension", prompt: "Ask for the current file status, movement dates and officers who handled it." },
    { title: "Scholarship", prompt: "Request recorded reasons for delay, eligibility records or payment status." },
    { title: "Roads & public works", prompt: "Seek work orders, contractor details, bills, inspection reports and completion records." },
    { title: "Government recruitment", prompt: "Ask for selection criteria, marks, answer records or the documented process." },
    { title: "Certificates", prompt: "Find the recorded status, movement and reasons available on your application file." },
    { title: "Scheme benefits", prompt: "Request beneficiary criteria, your application status and official communications." },
  ],
} as const;
