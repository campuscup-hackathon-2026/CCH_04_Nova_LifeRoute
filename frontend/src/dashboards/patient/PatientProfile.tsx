import React, { useState } from 'react';
import { User, HeartPulse, PhoneCall, ShieldCheck, MapPin, Plus, Trash2, Save } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { DEMO_PATIENTS } from '../../data/mockData';

export const PatientProfile: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const initialPatient = (user as any) || DEMO_PATIENTS[0];

  const [name, setName] = useState(initialPatient.name || 'Johnathan Miller');
  const [phone, setPhone] = useState(initialPatient.phone || '+1 (555) 234-5678');
  const [bloodGroup, setBloodGroup] = useState(initialPatient.bloodGroup || 'O+');
  const [allergies, setAllergies] = useState((initialPatient.allergies || ['Penicillin', 'Sulfa drugs']).join(', '));
  const [conditions, setConditions] = useState('Hypertension, Mild Asthma');
  const [address, setAddress] = useState(initialPatient.address || '45 Lakeview Blvd, Apt 4B, Metro District');
  const [contacts, setContacts] = useState(
    initialPatient.emergencyContacts || [
      { id: '1', name: 'Sarah Miller', relationship: 'Spouse', phone: '+1 (555) 987-6543' },
      { id: '2', name: 'Dr. Robert Adams', relationship: 'Primary Physician', phone: '+1 (555) 432-1098' },
    ]
  );

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        id: Date.now().toString(),
        name: 'New Emergency Contact',
        relationship: 'Family',
        phone: '+1 (555) 000-0000',
      },
    ]);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c: any) => c.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      type: 'success',
      title: 'Medical ID Updated',
      message: 'Your emergency health profile has been saved. Paramedics will receive these vitals on dispatch.',
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Emergency Medical ID & Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          This critical health telemetry is automatically transmitted to the responding ALS paramedic crew.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-healthcare-600" />
            <h3 className="font-bold text-sm text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Primary Residence Address (Auto-SOS Default)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
            />
          </div>
        </div>

        {/* Critical Health Vitals */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <HeartPulse className="w-5 h-5 text-emergency-600" />
            <h3 className="font-bold text-sm text-slate-900">Critical Medical Vitals</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Type</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold text-emergency-700"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Known Severe Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Latex, Bee Stings"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Existing Medical & Chronic Conditions
            </label>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Type 2 Diabetes, Cardiac Pacemaker, Asthma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
            />
          </div>
        </div>

        {/* Emergency Contacts List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-healthcare-600" />
              <h3 className="font-bold text-sm text-slate-900">Emergency Contacts</h3>
            </div>
            <button
              type="button"
              onClick={handleAddContact}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-healthcare-50 text-healthcare-700 text-xs font-bold hover:bg-healthcare-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact: any, index: number) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
              >
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => {
                    const updated = [...contacts];
                    updated[index].name = e.target.value;
                    setContacts(updated);
                  }}
                  placeholder="Contact Name"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="text"
                  value={contact.relationship}
                  onChange={(e) => {
                    const updated = [...contacts];
                    updated[index].relationship = e.target.value;
                    setContacts(updated);
                  }}
                  placeholder="Relationship (e.g. Spouse)"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[index].phone = e.target.value;
                      setContacts(updated);
                    }}
                    placeholder="Phone number"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-2 text-slate-400 hover:text-emergency-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Emergency Health Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

