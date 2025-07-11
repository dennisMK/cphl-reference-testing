// Sample status utility functions for viral load management

export interface StatusInfo {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
  description: string;
}

/**
 * Get status information from stage code
 * Stage codes:
 * 20 - Pending sample collection
 * 25 - Pending packaging (collected but not packaged)
 * 30 - In transit (packaged and sent to lab)
 */
export function getStatusFromStage(stage: number | null, verified?: number | null): StatusInfo {
  switch (stage) {
    case 20:
      return {
        label: "Pending Collection",
        variant: "secondary",
        color: "text-orange-600 bg-orange-50",
        description: "Sample request created, awaiting collection"
      };
    case 25:
      return {
        label: "Pending Packaging",
        variant: "secondary", 
        color: "text-blue-600 bg-blue-50",
        description: "Sample collected, ready for packaging"
      };
    case 30:
      return {
        label: "In Transit",
        variant: "default",
        color: "text-purple-600 bg-purple-50",
        description: "Sample packaged and sent to laboratory"
      };
    default:
      // Check if sample is completed/verified
      if (verified === 1) {
        return {
          label: "Completed",
          variant: "default",
          color: "text-green-600 bg-green-50",
          description: "Sample processed and results available"
        };
      }
      return {
        label: "Unknown Status",
        variant: "destructive",
        color: "text-gray-600 bg-gray-50",
        description: "Status could not be determined"
      };
  }
}

/**
 * Get status statistics from a list of samples
 */
export function getStatusStatistics(samples: Array<{ stage: number | null; verified?: number | null }>) {
  const stats = {
    pendingCollection: 0,
    pendingPackaging: 0,
    inTransit: 0,
    completed: 0,
    unknown: 0,
  };

  samples.forEach(sample => {
    switch (sample.stage) {
      case 20:
        stats.pendingCollection++;
        break;
      case 25:
        stats.pendingPackaging++;
        break;
      case 30:
        stats.inTransit++;
        break;
      default:
        if (sample.verified === 1) {
          stats.completed++;
        } else {
          stats.unknown++;
        }
    }
  });

  return stats;
}

/**
 * Get the next action for a sample based on its current stage
 */
export function getNextAction(stage: number | null): string {
  switch (stage) {
    case 20:
      return "Collect Sample";
    case 25:
      return "Package Sample";
    case 30:
      return "Process at Lab";
    default:
      return "Review Status";
  }
}

/**
 * Check if a sample can be packaged (stage 25)
 */
export function canBePackaged(stage: number | null): boolean {
  return stage === 25;
}

/**
 * Check if a sample needs collection (stage 20)
 */
export function needsCollection(stage: number | null): boolean {
  return stage === 20;
} 