import { Coordinates, Ambulance, MLPrediction, EmergencySeverity, AmbulanceType } from '../types';
import { calculateDistanceKm } from './ambulanceService';
import { mockDelay } from './apiClient';

export interface MLDispatchRecommendation {
  ambulanceId: string;
  ambulanceRegistration: string;
  ambulanceType: AmbulanceType;
  confidenceScore: number; // e.g. 98.4
  estimatedTimeMinutes: number;
  distanceKm: number;
  trafficFactor: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  greenCorridorRecommended: boolean;
  scoringBreakdown: {
    proximityScore: number; // 0-100
    equipmentMatchScore: number; // 0-100
    trafficFlowScore: number; // 0-100
    driverReadinessScore: number; // 0-100
  };
  simulationNotice: string;
}

export const mlPredictionService = {
  /**
   * Simulates Machine Learning multi-criteria dispatch optimization:
   * Features: Distance, Real-time Traffic Congestion Index, Medical Equipment Fit, Historical Arrival Speed.
   */
  async predictOptimalDispatch(
    patientLocation: Coordinates,
    requiredType: AmbulanceType,
    severity: EmergencySeverity,
    availableAmbulances: Ambulance[]
  ): Promise<MLDispatchRecommendation> {
    await mockDelay(350);

    if (availableAmbulances.length === 0) {
      throw new Error('No ambulances currently online in this sector.');
    }

    // Rank ambulances using simulated weighted scoring formula
    const scored = availableAmbulances.map((amb) => {
      const dist = calculateDistanceKm(patientLocation, amb.currentLocation);
      const isTypeMatch = amb.type === requiredType || amb.type === 'ALS';
      const equipmentMatchScore = isTypeMatch ? 98 : 70;
      const proximityScore = Math.max(30, Math.round(100 - dist * 12));
      const trafficFlowScore = 88; // Simulated city traffic factor
      const driverReadinessScore = amb.status === 'available' ? 99 : 65;

      const totalScore =
        proximityScore * 0.4 +
        equipmentMatchScore * 0.3 +
        trafficFlowScore * 0.15 +
        driverReadinessScore * 0.15;

      const eta = Math.max(3, Math.round(dist * 2.1 + (severity === 'CRITICAL' ? 1.0 : 2.5)));

      return {
        amb,
        dist,
        eta,
        totalScore: Math.round(totalScore * 10) / 10,
        breakdown: {
          proximityScore,
          equipmentMatchScore,
          trafficFlowScore,
          driverReadinessScore,
        },
      };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);
    const best = scored[0];

    return {
      ambulanceId: best.amb.id,
      ambulanceRegistration: best.amb.registrationNumber,
      ambulanceType: best.amb.type,
      confidenceScore: Math.min(99.4, best.totalScore),
      estimatedTimeMinutes: best.eta,
      distanceKm: best.dist,
      trafficFactor: 'Moderate',
      greenCorridorRecommended: severity === 'CRITICAL',
      scoringBreakdown: best.breakdown,
      simulationNotice:
        'ML Dispatch Engine (v4.2 XGBoost & Graph Routing Simulator) - Prepared for FastAPI / PyTorch endpoint integration.',
    };
  },

  /**
   * ML Traffic & Congestion ETA recalculation
   */
  async calculateLiveTrafficETA(
    currentCoord: Coordinates,
    targetCoord: Coordinates,
    hasGreenCorridor: boolean = false
  ): Promise<{ etaMinutes: number; congestionIndex: number; trafficStatus: string }> {
    await mockDelay(200);
    const dist = calculateDistanceKm(currentCoord, targetCoord);
    const baseSpeed = hasGreenCorridor ? 45 : 32; // km/h
    const rawMinutes = (dist / baseSpeed) * 60;
    const trafficCongestionPenalty = hasGreenCorridor ? 0.3 : 1.4;

    const eta = Math.max(1, Math.round(rawMinutes + trafficCongestionPenalty));

    return {
      etaMinutes: eta,
      congestionIndex: hasGreenCorridor ? 1.1 : 2.4,
      trafficStatus: hasGreenCorridor ? 'Traffic Cleared (Green Corridor)' : 'Moderate Traffic Flow',
    };
  },

  /**
   * Automated symptom triage assessment
   */
  assessTriageUrgency(symptoms: string[], complaint: string): { severity: EmergencySeverity; reason: string; recommendedUnit: AmbulanceType } {
    const text = (complaint + ' ' + symptoms.join(' ')).toLowerCase();

    if (
      text.includes('chest pain') ||
      text.includes('cardiac') ||
      text.includes('heart') ||
      text.includes('unconscious') ||
      text.includes('stroke') ||
      text.includes('severe bleeding') ||
      text.includes('not breathing')
    ) {
      return {
        severity: 'CRITICAL',
        reason: 'Identified critical life-threat indicators (cardiovascular / airway compromise).',
        recommendedUnit: 'ALS',
      };
    }

    if (
      text.includes('fracture') ||
      text.includes('asthma') ||
      text.includes('breathing') ||
      text.includes('head injury') ||
      text.includes('burn')
    ) {
      return {
        severity: 'HIGH',
        reason: 'Identified high urgency indicators requiring rapid paramedic intervention.',
        recommendedUnit: 'ALS',
      };
    }

    if (text.includes('baby') || text.includes('infant') || text.includes('neonate')) {
      return {
        severity: 'HIGH',
        reason: 'Pediatric/Neonatal specialized protocol triggered.',
        recommendedUnit: 'NEONATAL',
      };
    }

    return {
      severity: 'MODERATE',
      reason: 'Standard emergency transfer protocol; vital signs stabilization en route.',
      recommendedUnit: 'BLS',
    };
  },
};

