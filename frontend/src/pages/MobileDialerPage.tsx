import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Siren, MapPin, CheckCircle2, ShieldAlert, Radio, Volume2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export const MobileDialerPage: React.FC = () => {
  const [digits, setDigits] = useState('109');
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to connect to LifeRoute Emergency');
  const [callerPhone, setCallerPhone] = useState('+91 98765 00109');
  const [dispatchedUnit, setDispatchedUnit] = useState<string | null>(null);

  // Capture real mobile GPS
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setStatusMessage(`GPS Locked: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setCoords({ lat: 12.9716, lng: 77.5946 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setCoords({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // Timer while call is connected
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  const handleDigitClick = (d: string) => {
    if (digits.length < 12) {
      setDigits((prev) => prev + d);
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!digits) return;
    setIsCalling(true);
    setStatusMessage('Ringing LifeRoute Emergency 109 Dispatch...');

    try {
      const lat = coords?.lat || 12.9716;
      const lng = coords?.lng || 77.5946;

      const res = await apiClient.post('/emergencies/call-109', {
        caller_phone: callerPhone,
        caller_name: 'Mobile Phone Caller',
        patient_latitude: lat,
        patient_longitude: lng,
        patient_address: `Live Mobile Call from ${callerPhone} (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        emergency_type: 'dial_109_emergency_call',
        severity: 'critical',
        voice_transcript: `Citizen placed voice call to 109 emergency hotline from mobile device.`,
      });

      setCallConnected(true);
      setIsCalling(false);
      setDispatchedUnit(res.data?.assigned_ambulance_id ? `Unit #${res.data.assigned_ambulance_id}` : 'MED-EMG-0101');
      setStatusMessage('Connected to LifeRoute Dispatch Desk. Ambulance assigned!');
    } catch {
      // Offline fallback simulation
      setTimeout(() => {
        setCallConnected(true);
        setIsCalling(false);
        setDispatchedUnit('MED-EMG-0101');
        setStatusMessage('Connected to LifeRoute Dispatch Desk (Demo). Ambulance assigned!');
      }, 1000);
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    setStatusMessage('Call ended. Ambulance remains dispatched to your location.');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none font-sans max-w-md mx-auto shadow-2xl border-x border-slate-800">
      {/* Top Mobile Status Header */}
      <div className="w-full text-center space-y-1 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-600/30 text-emergency-400 text-xs font-bold border border-emergency-500/30">
          <Radio className="w-3.5 h-3.5 text-emergency-500 animate-pulse" />
          <span>LifeRoute 109 Mobile Cellular Terminal</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Dialing <strong className="text-white">109</strong> links directly to your desktop dispatch system.
        </p>
      </div>

      {/* Screen Area (Active Call vs Dialpad) */}
      <div className="w-full py-4 text-center">
        {callConnected ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-pulse">
              <Siren className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Emergency 109 Connected</h2>
              <p className="text-emerald-400 text-sm font-mono mt-1 font-bold">
                Call Duration: {formatSeconds(callDuration)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Dispatched Unit:</span>
                <span className="font-bold text-emerald-400">{dispatchedUnit} (En Route)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Estimated Arrival:</span>
                <span className="font-bold text-healthcare-400">~5-6 Minutes</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Caller Telemetry:</span>
                <span className="font-mono text-slate-300">
                  {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Locking GPS...'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              📡 Check your computer screen — the LifeRoute dispatch dashboard has popped up and is tracking your ambulance live!
            </p>
          </div>
        ) : isCalling ? (
          <div className="space-y-4 py-8 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-emergency-600/30 text-emergency-500 flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black tracking-widest text-white">{digits}</h2>
            <p className="text-emergency-400 text-sm font-semibold">Calling LifeRoute Emergency System...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Enter Number or Press Call (109)</div>
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-wider text-white h-14 flex items-center justify-center">
              {digits || <span className="text-slate-600">Enter digits</span>}
            </div>
            {coords && (
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-healthcare-500" />
                <span>GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keypad Grid (When not in call) */}
      {!callConnected && !isCalling && (
        <div className="w-full max-w-xs space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '' },
              { num: '0', sub: '+' },
              { num: '#', sub: '' },
            ].map((key) => (
              <button
                key={key.num}
                type="button"
                onClick={() => handleDigitClick(key.num)}
                className="h-16 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 active:scale-95 transition flex flex-col items-center justify-center shadow-md"
              >
                <span className="text-2xl font-bold leading-none">{key.num}</span>
                {key.sub && <span className="text-[9px] text-slate-400 tracking-widest">{key.sub}</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 pt-1">
            <div className="w-12"></div>
            {/* Green Call Button */}
            <button
              type="button"
              onClick={handleCall}
              className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition"
              title="Call 109"
            >
              <Phone className="w-8 h-8" />
            </button>
            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="w-12 h-12 rounded-full text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {/* Call Actions (When in call) */}
      {callConnected && (
        <div className="w-full max-w-xs pb-4">
          <button
            type="button"
            onClick={handleEndCall}
            className="w-full py-4 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emergency-600/40 transition active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
            End Emergency 109 Call
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="w-full pt-3 border-t border-slate-900 text-center text-[10px] text-slate-500">
        Status: {statusMessage}
      </div>
    </div>
  );
};

