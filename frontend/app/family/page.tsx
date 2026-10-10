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
      case "grandfather": return "👴";
      case "grandmother": return "👵";
      default: return "👤";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="min-h-screen bg-gradient-to-b from-purple-950/20 via-transparent to-slate-950">
        {/* Header */}
        <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedMember) setSelectedMember(null);
                else router.back();
              }}
              className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all"
            >
              ←
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">
                {selectedMember ? `${selectedMember.name}'s Medicines` : "👨‍👩‍👧 Family Members"}
              </h1>
              <p className="text-xs text-slate-500">
                {selectedMember ? "Viewing member's medicines" : `${members.length} member${members.length !== 1 ? "s" : ""} in your family`}
              </p>
            </div>
            {!selectedMember && (
              <button onClick={() => setShowAdd(true)} className="btn-primary px-5 py-2.5 text-white font-medium rounded-xl text-sm flex items-center gap-2" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
                <span className="text-lg leading-none">+</span> Add
              </button>
            )}
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Member Medicines View */}
          {selectedMember ? (
            <div className="space-y-4 animate-fade-in">
              <button
                onClick={() => setSelectedMember(null)}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
              >
                ← Back to family list
              </button>

              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(124,58,237,0.1) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  {relationEmoji(selectedMember.relation)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedMember.name}</h2>
                  <p className="text-slate-400 text-sm">
                    {selectedMember.relation} {selectedMember.age && `· ${selectedMember.age} years`}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Medicines ({memberMeds.length})</h3>
                {memberMeds.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <div className="text-4xl mb-3">💊</div>
                    <p className="text-slate-400">No medicines added for {selectedMember.name}</p>
                  </div>
                ) : (
                  memberMeds.map((med, index) => (
                    <div key={med.id} className="glass-card p-4 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <span className="text-xl">💊</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{med.medicineName}</p>
                        <p className="text-sm text-slate-400">{med.dosage} {med.timing && `· ${med.timing}`}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-800 rounded-xl shimmer" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-slate-800 rounded shimmer w-1/3" />
                      <div className="h-4 bg-slate-800 rounded shimmer w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="glass-card p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4 animate-float">👨‍👩‍👧</div>
              <h3 className="text-xl font-bold text-white mb-2">No family members added</h3>
              <p className="text-slate-400 mb-6">Add family members to track their medicines</p>
              <button
                onClick={() => setShowAdd(true)}
                className="px-8 py-3 text-white font-semibold rounded-xl"
                style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}
              >
                + Add Family Member
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="glass-card glass-card-hover p-5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(124,58,237,0.1) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      {relationEmoji(member.relation)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white">{member.name}</h3>
                      <p className="text-sm text-slate-400">
                        {member.relation} {member.age && `· ${member.age} years`}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 mt-2">
                        💊 {member.medicineCount} medicine{member.medicineCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => viewMeds(member)}
                        className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                      >
                        View Meds
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Modal */}
          {showAdd && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card p-6 w-full max-w-md animate-fade-in-up border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>👨‍👩‍👧</span> Add Family Member
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Track their medicines separately</p>
                  </div>
                  <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    ✕
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <span className="text-purple-400">👤</span> Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Father"
                      className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="text-purple-400">🤝</span> Relation
                      </label>
                      <select
                        value={form.relation}
                        onChange={(e) => setForm({ ...form, relation: e.target.value })}
                        className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                      >
                        <option value="">Select...</option>
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="text-purple-400">🎂</span> Age
                      </label>
                      <input
                        type="number"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        placeholder="55"
                        className="input-field w-full px-4 py-3.5 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowAdd(false)} className="flex-1 py-3 glass-card text-slate-300 rounded-xl hover:bg-slate-800/60 transition font-medium">
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={!form.name}
                      className="flex-1 py-3 text-white rounded-xl transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: form.name ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" : "#334155" }}
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
