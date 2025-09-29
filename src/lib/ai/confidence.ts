export interface ConfidenceSignal {
  source: string;
  score: number;
  weight?: number;
  rationale?: string;
}

export interface NormalizedConfidenceSignal {
  source: string;
  score: number;
  weight: number;
  rationale?: string;
}

export interface ConfidenceSummary {
  score: number;
  rawScore: number;
  totalWeight: number;
  signals: NormalizedConfidenceSignal[];
}

const clamp = (value: number, min = 0, max = 1) => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
};

export function normalizeSignals(signals: ConfidenceSignal[]): NormalizedConfidenceSignal[] {
  return signals
    .filter((signal) => Number.isFinite(signal.score))
    .map((signal) => ({
      source: signal.source,
      score: clamp(signal.score),
      weight: signal.weight && signal.weight > 0 ? signal.weight : 1,
      rationale: signal.rationale,
    }));
}

export function calculateConfidence(
  signals: ConfidenceSignal[],
  fallbackScore = 0.6,
): ConfidenceSummary {
  const normalized = normalizeSignals(signals);
  const totalWeight = normalized.reduce((total, signal) => total + signal.weight, 0);

  const rawScore =
    totalWeight > 0
      ? normalized.reduce((total, signal) => total + signal.score * signal.weight, 0) / totalWeight
      : clamp(fallbackScore);

  return {
    score: clamp(rawScore),
    rawScore,
    totalWeight,
    signals: normalized,
  };
}
