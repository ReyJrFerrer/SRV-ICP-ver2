
import { DisputeResolutionOutcome } from "./dispute-evidence";
export interface DisputeResolution {
    outcome: DisputeResolutionOutcome;
    notes: string;
    timestamp: Date;
  }
  