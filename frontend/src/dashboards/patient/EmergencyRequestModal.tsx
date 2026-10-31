import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Siren,
  HeartPulse,
  Brain,
  ShieldAlert,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { AmbulanceType, EmergencySeverity, Coordinates } from '../../types';
import { mlPredictionService } from '../../services/mlPredictionService';
import { MLBadge } from '../../components/common/MLBadge';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    chiefComplaint: string;
    symptoms: string[];
    severity: EmergencySeverity;
    ambulanceTypeRequired: AmbulanceType;
    notes?: string;
  }) => void;
  userLocation: Coordinates;
  isLoading?: boolean;
}

const COMMON_SYMPTOMS = [
  'Severe Chest Pain / Pressure',
  'Shortness of Breath',
  'Loss of Consciousness / Fainting',
  'Severe Bleeding / Deep Laceration',
  'Stroke Signs (Face Droop / Slurred Speech)',
  'Suspected Bone Fracture / Trauma',
  'Severe Allergic Reaction / Anaphylaxis',
  'High Fever / Seizure',
  'Severe Burn / Scald',
  'Pregnancy / Labor Complications',
];

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userLocation,
  isLoading = false,
}) => {
  const [complaint, setComplaint] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [ambulanceType, setAmbulanceType] = useState<AmbulanceType>('ALS');
  const [notes, setNotes] = useState('');

  // Real-time ML symptom triage analysis
  const triage = mlPredictionService.assessTriageUrgency(selectedSymptoms, complaint);

  if (!isOpen) return null;

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      chiefComplaint: complaint || 'Emergency Request via Patient Portal',
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Unspecified urgent condition'],
      severity: triage.severity,
      ambulanceTypeRequired: ambulanceType || triage.recommendedUnit,
      notes,
    });
  };

  const severityColor = {
    CRITICAL: 'bg-emergency-50 border-emergency-300 text-emergency-800',
    HIGH: 'bg-orange-50 border-orange-300 text-orange-800',
    MODERATE: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    LOW: 'bg-slate-50 border-slate-300 text-slate-800',
  }[triage.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emergency-100 text-emergency-600 flex items-center justify-center">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Detailed Emergency Request Form
              </h3>
              <p className="text-xs text-slate-500">
                Machine Learning assisted symptom triage and unit allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pickup Location Confirm */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Pickup Location:</span>
              <span className="font-bold text-slate-800">
                {userLocation.address || 'Detected GPS Location (Metro Area)'}
              </span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              GPS Locked
            </span>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chief Complaint / Primary Medical Concern *
            </label>
            <input
              type="text"
              required
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="e.g. Sudden severe chest tightness and radiating pain to left shoulder"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-healthcare-500 text-sm"
            />
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Observed Symptoms (Tap all that apply):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-healthcare-50 border-healthcare-500 text-healthcare-800 font-bold ring-1 ring-healthcare-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time ML Triage Prediction Card */}
          <div className={`p-4 rounded-xl border ${severityColor} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-healthcare-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Automated ML Triage Assessment:
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase tracking-wider border border-current">
                {triage.severity} PRIORITY
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{triage.reason}</p>
            <div className="text-[11px] font-semibold pt-1">
              Recommended Unit: <b>{triage.recommendedUnit}</b> (Advanced Life Support)
            </div>
          </div>

          {/* Ambulance Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Confirm Ambulance Service Type:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'ALS' as AmbulanceType, title: 'ALS Unit', desc: 'Critical ventilator & defibrillator' },
                { type: 'BLS' as AmbulanceType, title: 'BLS Unit', desc: 'Standard emergency transfer' },
                { type: 'NEONATAL' as AmbulanceType, title: 'Neonatal', desc: 'Pediatric incubator transport' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setAmbulanceType(item.type)}
                  className={`p-3 rounded-xl border text-left transition ${
                    ambulanceType === item.type
                      ? 'bg-healthcare-50 border-healthcare-500 ring-2 ring-healthcare-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{item.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Additional Access Notes (Apartment No, Gate code, Landmarks):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 4th floor, elevator in service, security code #4412"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              {isLoading ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <Siren className="w-4 h-4" />
                  <span>Submit & Dispatch Ambulance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

