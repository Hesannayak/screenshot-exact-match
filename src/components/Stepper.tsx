import { Check } from "lucide-react";
export function Stepper({ step }: { step: number }) {
  return (
    <div className="stepper">
      {["Your agent", "Verify email", "Verify GitHub"].map((label, i) => (
        <div className="stepper-item" data-active={i + 1 <= step} key={label}>
          <span className="step-number">{i + 1 < step ? <Check size={11} /> : i + 1}</span>
          {label}
        </div>
      ))}
    </div>
  );
}
