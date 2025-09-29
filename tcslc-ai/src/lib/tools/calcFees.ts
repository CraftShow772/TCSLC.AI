type CalcFeesArgs = { type: string; params: Record<string, unknown> };

type FeeCalculation = {
  estimate: number;
  currency: string;
  description: string;
  assumptions: string[];
};

const MEMBERSHIP_BASE = 125;
const EVENT_DAY_RATE = 45;

export function estimateFees(args: CalcFeesArgs): FeeCalculation {
  const type = args.type.toLowerCase();
  switch (type) {
    case "membership": {
      const duration = Number(args.params?.duration ?? 12);
      const scholarships = Boolean(args.params?.scholarship);
      const base = MEMBERSHIP_BASE * Math.ceil(duration / 12);
      const estimate = scholarships ? base * 0.6 : base;
      return {
        estimate,
        currency: "USD",
        description: "Estimated annual TCSLC membership dues",
        assumptions: [
          `Duration: ${duration} months`,
          scholarships ? "Scholarship support applied" : "Standard rate",
        ],
      };
    }
    case "event": {
      const attendees = Number(args.params?.attendees ?? 1);
      const days = Number(args.params?.days ?? 1);
      const estimate = attendees * days * EVENT_DAY_RATE;
      return {
        estimate,
        currency: "USD",
        description: "Estimated workshop or retreat facilitation fees",
        assumptions: [`${attendees} attendees`, `${days} day(s)`],
      };
    }
    default:
      return {
        estimate: MEMBERSHIP_BASE,
        currency: "USD",
        description: "Baseline TCSLC consultation fee",
        assumptions: ["Contact our team for an exact quote."],
      };
  }
}
