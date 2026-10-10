"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getAuth, FamilyMember, UserMedicine } from "@/lib/api";

export default function FamilyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [memberMeds, setMemberMeds] = useState<UserMedicine[]>([]);
  const [form, setForm] = useState({ name: "", relation: "", age: "" });
  const [loading, setLoading] = useState(true);

  const loadFamily = () => {
    const auth = getAuth();
    if (!auth) return router.push("/");
    api.getFamily(auth.id).then(setMembers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFamily();
  }, []);

  const handleAdd = async () => {
    const auth = getAuth();
    if (!auth || !form.name) return;
    try {
      await api.addFamilyMember({
        userId: auth.id,
        name: form.name,
        relation: form.relation || undefined,
        age: form.age ? Number(form.age) : undefined,
      });
      setShowAdd(false);
      setForm({ name: "", relation: "", age: "" });
      loadFamily();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteFamilyMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const viewMeds = async (member: FamilyMember) => {
    const auth = getAuth();
    if (!auth) return;
    setSelectedMember(member);
    try {
      const meds = (await api.getUserMedicines(auth.id, member.id)) as UserMedicine[];
      setMemberMeds(meds);
    } catch (err) {
      console.error(err);
    }
  };

  const relationEmoji = (relation?: string) => {
    switch (relation?.toLowerCase()) {
      case "father": return "👴";
      case "mother": return "👵";
      case "son": return "👦";
      case "daughter": return "👧";
      case "brother": return "👨";
      case "sister": return "👩";
      case "wife": return "👩";
      case "husband": return "👨";
      default: return "👤";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <header className="bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedMember(null); router.back(); }} className="text-slate-400 hover:text-white text-xl">←</button>
            <h1 className="text-xl font-bold text-white">
              {selectedMember ? `${selectedMember.name}'s Medicines` : "Family Members"}
            </h1>
          </div>
          {!selectedMember && (
            <button onClick={() => setShowAdd(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium">
              + Add
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Member Medicines View */}
        {selectedMember ? (
          <div className="space-y-3">
            <button onClick={() => setSelectedMember(null)} className="text-blue-400 text-sm">← Back to family list</button>
            {memberMeds.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">💊</div>
                No medicines added for {selectedMember.name}
              </div>
            ) : (
              memberMeds.map((med) => (
                <div key={med.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">💊</span>
                  <div>
                    <p className="font-semibold text-white">{med.medicineName}</p>
                    <p className="text-sm text-slate-400">{med.dosage} {med.timing && `· ${med.timing}`}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👨‍👩‍👧</div>
            <p className="text-slate-400 mb-2">No family members added</p>
            <p className="text-slate-500 text-sm mb-4">Add family members to track their medicines</p>
            <button onClick={() => setShowAdd(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl">
              + Add Family Member
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{relationEmoji(member.relation)}</span>
                    <div>
                      <h3 className="font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-slate-400">
                        {member.relation} {member.age && `· ${member.age} years`}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">{member.medicineCount} medicines</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewMeds(member)} className="text-blue-400 hover:text-blue-300 text-sm">
                      View Meds
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-300 text-sm">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Add Family Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Father"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Relation</label>
                  <select
                    value={form.relation}
                    onChange={(e) => setForm({ ...form, relation: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select relation...</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g., 55"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                    Cancel
                  </button>
                  <button onClick={handleAdd} disabled={!form.name} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white rounded-xl">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
