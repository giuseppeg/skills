import { Prose } from "./page";
import "./step-nav.css";

type StepNavStep = {
  title: string;
  detail?: string | null;
  status?: "complete" | "current" | "upcoming" | null;
};

type StepNavProps = {
  steps: StepNavStep[];
};

function stepStatus(props: { step: StepNavStep; index: number }) {
  return props.step.status ?? (props.index === 0 ? "current" : "upcoming");
}

function StepNav(props: StepNavProps & { orientation: "horizontal" | "vertical" }) {
  return (
    <nav
      className={`step-nav step-nav-${props.orientation}`}
      aria-label="Steps"
    >
      <ol className="step-nav-list">
        {props.steps.map((step, index) => {
          const status = stepStatus({ step, index });
          return (
            <li className={`step-nav-item is-${status}`} key={`${step.title}-${index}`}>
              <span className="step-nav-index" aria-hidden="true">
                {status === "complete" ? "✓" : index + 1}
              </span>
              <span className="step-nav-copy">
                <span className="step-nav-title">
                  <Prose text={step.title} />
                </span>
                {step.detail ? (
                  <span className="step-nav-detail">
                    <Prose text={step.detail} />
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function StepNavHorizontal(props: StepNavProps) {
  return <StepNav {...props} orientation="horizontal" />;
}

export function StepNavVertical(props: StepNavProps) {
  return <StepNav {...props} orientation="vertical" />;
}
