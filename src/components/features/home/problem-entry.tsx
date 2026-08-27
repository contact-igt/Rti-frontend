"use client";

import { ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { homeContent } from "@/content/home";
import { routes } from "@/config/routes";
import { storeStartProblem } from "@/lib/filing/storage";

export function ProblemEntry() {
  const router = useRouter();
  const [problem, setProblem] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (problem.trim()) storeStartProblem(problem.trim());
    router.push(routes.start);
  }

  return (
    <form className="problem-entry" onSubmit={handleSubmit}>
      <div className="problem-entry__heading">
        <span className="section-index">Start here</span>
        <div>
          <label htmlFor="citizen-problem">What information are you trying to get?</label>
          <p>Write as you would explain it to a neighbour. You do not need legal terms or a department name.</p>
        </div>
      </div>
      <textarea
        id="citizen-problem"
        name="problem"
        value={problem}
        onChange={(event) => setProblem(event.target.value)}
        placeholder="For example: My pension has been pending for six months. I want to know where the file is and what action has been taken."
        rows={5}
      />
      <div className="problem-entry__suggestions" aria-label="Example situations">
        <span>Try an example</span>
        <div>
          {homeContent.examples.map((example, index) => (
            <button type="button" key={example} onClick={() => setProblem(example)}>
              {index + 1}
              <span className="sr-only">: {example}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="problem-entry__footer">
        <p><CornerDownLeft aria-hidden="true" /> Your words stay editable at every step.</p>
        <button className="button button--primary button--large" type="submit">
          Help me prepare my RTI <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
