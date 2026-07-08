"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Briefcase, Plus, Edit, Trash2, X, 
  CheckCircle2, AlertCircle, RefreshCw 
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("lawyers"); // "lawyers" or "cases"
  const [lawyers, setLawyers] = useState([]);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Notification banners
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Lawyer Form State
  const initialLawyerForm = {
    name: "",
    bar_number: "",
    practice_area: "",
    experience: 0,
    phone: "",
    email: "",
    city: "Cuttack",
    ai_insight: "",
    avg_disposal_time: 0.0
  };
  const [lawyerForm, setLawyerForm] = useState(initialLawyerForm);
  const [editingLawyerId, setEditingLawyerId] = useState(null); // null if adding

  // Case Form State
  const initialCaseForm = {
    lawyer_id: "",
    case_number: "",
    court: "Odisha High Court",
    case_type: "Writ Petition",
    filing_date: new Date().toISOString().split("T")[0],
    status: "Pending",
    outcome: "Pending",
    judgment: ""
  };
  const [caseForm, setCaseForm] = useState(initialCaseForm);
  const [editingCaseId, setEditingCaseId] = useState(null); // null if adding

  // Fetch all database records
  // Helper to show temporary notification
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch lawyers
      const { data: lawyersData, error: lError } = await supabase
        .from("lawyers")
        .select("*")
        .order("name", { ascending: true });
      if (lError) throw lError;
      setLawyers(lawyersData || []);

      // 2. Fetch cases and join lawyer name
      const { data: casesData, error: cError } = await supabase
        .from("cases")
        .select("*, lawyers(name)")
        .order("filing_date", { ascending: false });
      if (cError) throw cError;
      setCases(casesData || []);
    } catch (err) {
      console.error("Database fetch error:", err);
      showError("Failed to fetch database records. Verify Supabase connection keys.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wrapping the call in a timeout prevents synchronous setState warnings during mounting
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------
  // LAWYER CRUD ACTIONS
  // -------------------------------------------------------------
  const handleLawyerSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!lawyerForm.name || !lawyerForm.bar_number || !lawyerForm.practice_area) {
      showError("Name, Bar Number, and Practice Areas are required fields.");
      return;
    }

    try {
      if (editingLawyerId) {
        // UPDATE lawyer
        const { error } = await supabase
          .from("lawyers")
          .update({
            name: lawyerForm.name,
            bar_number: lawyerForm.bar_number,
            practice_area: lawyerForm.practice_area,
            experience: parseInt(lawyerForm.experience, 10),
            phone: lawyerForm.phone,
            email: lawyerForm.email,
            city: lawyerForm.city,
            ai_insight: lawyerForm.ai_insight,
            avg_disposal_time: parseFloat(lawyerForm.avg_disposal_time)
          })
          .eq("id", editingLawyerId);

        if (error) throw error;
        showSuccess(`Advocate "${lawyerForm.name}" updated successfully.`);
      } else {
        // INSERT lawyer
        const { error } = await supabase
          .from("lawyers")
          .insert([
            {
              name: lawyerForm.name,
              bar_number: lawyerForm.bar_number,
              practice_area: lawyerForm.practice_area,
              experience: parseInt(lawyerForm.experience, 10),
              phone: lawyerForm.phone,
              email: lawyerForm.email,
              city: lawyerForm.city,
              ai_insight: lawyerForm.ai_insight,
              avg_disposal_time: parseFloat(lawyerForm.avg_disposal_time)
            }
          ]);

        if (error) throw error;
        showSuccess(`Advocate "${lawyerForm.name}" registered successfully.`);
      }

      // Reset form and refresh table
      setLawyerForm(initialLawyerForm);
      setEditingLawyerId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to save advocate details.");
    }
  };

  const handleEditLawyer = (lawyer) => {
    setEditingLawyerId(lawyer.id);
    setLawyerForm({
      name: lawyer.name,
      bar_number: lawyer.bar_number,
      practice_area: lawyer.practice_area,
      experience: lawyer.experience,
      phone: lawyer.phone || "",
      email: lawyer.email || "",
      city: lawyer.city,
      ai_insight: lawyer.ai_insight || "",
      avg_disposal_time: lawyer.avg_disposal_time
    });
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLawyer = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}? All associated cases will be deleted.`)) return;

    try {
      const { error } = await supabase.from("lawyers").delete().eq("id", id);
      if (error) throw error;
      showSuccess(`Advocate "${name}" deleted.`);
      
      // If we were editing that lawyer, reset form
      if (editingLawyerId === id) {
        setLawyerForm(initialLawyerForm);
        setEditingLawyerId(null);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      showError("Failed to delete advocate.");
    }
  };

  // -------------------------------------------------------------
  // CASE CRUD ACTIONS
  // -------------------------------------------------------------
  const handleCaseSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!caseForm.lawyer_id || !caseForm.case_number || !caseForm.case_type) {
      showError("Advocate reference, Case Number, and Case Type are required.");
      return;
    }

    try {
      if (editingCaseId) {
        // UPDATE case
        const { error } = await supabase
          .from("cases")
          .update({
            lawyer_id: parseInt(caseForm.lawyer_id, 10),
            case_number: caseForm.case_number,
            court: caseForm.court,
            case_type: caseForm.case_type,
            filing_date: caseForm.filing_date,
            status: caseForm.status,
            outcome: caseForm.status === "Pending" ? "Pending" : caseForm.outcome,
            judgment: caseForm.status === "Pending" ? null : caseForm.judgment
          })
          .eq("id", editingCaseId);

        if (error) throw error;
        showSuccess(`Case "${caseForm.case_number}" updated successfully.`);
      } else {
        // INSERT case
        const { error } = await supabase
          .from("cases")
          .insert([
            {
              lawyer_id: parseInt(caseForm.lawyer_id, 10),
              case_number: caseForm.case_number,
              court: caseForm.court,
              case_type: caseForm.case_type,
              filing_date: caseForm.filing_date,
              status: caseForm.status,
              outcome: caseForm.status === "Pending" ? "Pending" : caseForm.outcome,
              judgment: caseForm.status === "Pending" ? null : caseForm.judgment
            }
          ]);

        if (error) throw error;
        showSuccess(`Case "${caseForm.case_number}" registered successfully.`);
      }

      // Reset Form and reload tables
      setCaseForm(initialCaseForm);
      setEditingCaseId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to save case details.");
    }
  };

  const handleEditCase = (caseObj) => {
    setEditingCaseId(caseObj.id);
    setCaseForm({
      lawyer_id: caseObj.lawyer_id.toString(),
      case_number: caseObj.case_number,
      court: caseObj.court,
      case_type: caseObj.case_type,
      filing_date: caseObj.filing_date,
      status: caseObj.status,
      outcome: caseObj.outcome,
      judgment: caseObj.judgment || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCase = async (id, num) => {
    if (!confirm(`Are you sure you want to delete case ${num}?`)) return;

    try {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
      showSuccess(`Case "${num}" deleted.`);
      
      if (editingCaseId === id) {
        setCaseForm(initialCaseForm);
        setEditingCaseId(null);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      showError("Failed to delete case.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      
      {/* Admin Title */}
      <div className="border-b border-border/50 pb-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">Admin Control Panel</h1>
          <p className="text-xs text-text-muted mt-1">Manage lawyers database and court case records.</p>
        </div>
        <button 
          onClick={fetchData}
          className="rounded-lg border border-border p-2 bg-surface hover:bg-surface-2 text-text/80 cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Notification Banners */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl border border-success/30 bg-success/15 flex items-center gap-3 text-sm text-success">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl border border-danger/30 bg-danger/15 flex items-center gap-3 text-sm text-danger">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Raycast style tab selector */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("lawyers")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "lawyers"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted hover:text-text"
          }`}
        >
          <Users className="h-4 w-4" />
          Manage Lawyers ({lawyers.length})
        </button>
        <button
          onClick={() => setActiveTab("cases")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "cases"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted hover:text-text"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Manage Cases ({cases.length})
        </button>
      </div>

      {/* Grid Layout: Form on Left, Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ====================================================================
            TAB 1: MANAGE LAWYERS
            ==================================================================== */}
        {activeTab === "lawyers" && (
          <>
            {/* Lawyer Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 border border-border bg-surface/30 sticky top-24">
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                    {editingLawyerId ? "Edit Advocate Details" : "Register New Advocate"}
                  </h3>
                  {editingLawyerId && (
                    <button 
                      onClick={() => {
                        setEditingLawyerId(null);
                        setLawyerForm(initialLawyerForm);
                      }}
                      className="text-text-muted hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleLawyerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Advocate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Adv. Abhinav Mohanty"
                      value={lawyerForm.name}
                      onChange={(e) => setLawyerForm({...lawyerForm, name: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Bar Number</label>
                    <input
                      type="text"
                      placeholder="e.g. O/874/2006"
                      value={lawyerForm.bar_number}
                      onChange={(e) => setLawyerForm({...lawyerForm, bar_number: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Practice Areas</label>
                    <input
                      type="text"
                      placeholder="Comma separated: Property, Civil, Criminal"
                      value={lawyerForm.practice_area}
                      onChange={(e) => setLawyerForm({...lawyerForm, practice_area: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Experience (Yrs)</label>
                      <input
                        type="number"
                        min="0"
                        value={lawyerForm.experience}
                        onChange={(e) => setLawyerForm({...lawyerForm, experience: parseInt(e.target.value, 10) || 0})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Avg Disposal (Months)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={lawyerForm.avg_disposal_time}
                        onChange={(e) => setLawyerForm({...lawyerForm, avg_disposal_time: parseFloat(e.target.value) || 0.0})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">City Location</label>
                      <select
                        value={lawyerForm.city}
                        onChange={(e) => setLawyerForm({...lawyerForm, city: e.target.value})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Cuttack">Cuttack</option>
                        <option value="Bhubaneswar">Bhubaneswar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Phone Contact</label>
                      <input
                        type="text"
                        placeholder="+91 XXXXX XXXXX"
                        value={lawyerForm.phone}
                        onChange={(e) => setLawyerForm({...lawyerForm, phone: e.target.value})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. advocate@orissabar.in"
                      value={lawyerForm.email}
                      onChange={(e) => setLawyerForm({...lawyerForm, email: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">AI Practice Summary Insight</label>
                    <textarea
                      placeholder="Describe recent case trends and specializations..."
                      rows="3"
                      value={lawyerForm.ai_insight}
                      onChange={(e) => setLawyerForm({...lawyerForm, ai_insight: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 rounded-lg bg-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    {editingLawyerId ? "UPDATE ADVOCATE" : "REGISTER ADVOCATE"}
                  </button>
                </form>
              </div>
            </div>

            {/* Lawyers List Table */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 border border-border bg-surface/30">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text mb-4">Registered Advocates</h3>
                {isLoading ? (
                  <div className="py-12 text-center text-text-muted animate-pulse">Loading database data...</div>
                ) : lawyers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-text-muted font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Bar Registration</th>
                          <th className="py-2.5 px-3">City</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {lawyers.map((l) => (
                          <tr key={l.id} className="hover:bg-surface-2/20 transition-colors">
                            <td className="py-3 px-3 font-bold text-text">{l.name}</td>
                            <td className="py-3 px-3 font-mono text-accent">{l.bar_number}</td>
                            <td className="py-3 px-3 text-text">{l.city}</td>
                            <td className="py-3 px-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditLawyer(l)}
                                  className="rounded border border-border/80 p-1.5 hover:bg-primary/10 hover:text-primary text-text-muted cursor-pointer"
                                  title="Edit Profile"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLawyer(l.id, l.name)}
                                  className="rounded border border-border/80 p-1.5 hover:bg-danger/10 hover:text-danger text-text-muted cursor-pointer"
                                  title="Delete Profile"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-text-muted">No advocates registered.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ====================================================================
            TAB 2: MANAGE CASES
            ==================================================================== */}
        {activeTab === "cases" && (
          <>
            {/* Case Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 border border-border bg-surface/30 sticky top-24">
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text">
                    {editingCaseId ? "Edit Case Record" : "Add Court Case Record"}
                  </h3>
                  {editingCaseId && (
                    <button 
                      onClick={() => {
                        setEditingCaseId(null);
                        setCaseForm(initialCaseForm);
                      }}
                      className="text-text-muted hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleCaseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Assign Advocate Reference</label>
                    <select
                      value={caseForm.lawyer_id}
                      onChange={(e) => setCaseForm({...caseForm, lawyer_id: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="">-- Choose Advocate --</option>
                      {lawyers.map((l) => (
                        <option key={l.id} value={l.id}>{l.name} ({l.bar_number})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Case Number</label>
                    <input
                      type="text"
                      placeholder="e.g. WP(C)/1402/2023"
                      value={caseForm.case_number}
                      onChange={(e) => setCaseForm({...caseForm, case_number: e.target.value})}
                      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Case Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Writ Petition"
                        value={caseForm.case_type}
                        onChange={(e) => setCaseForm({...caseForm, case_type: e.target.value})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Filing Date</label>
                      <input
                        type="date"
                        value={caseForm.filing_date}
                        onChange={(e) => setCaseForm({...caseForm, filing_date: e.target.value})}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Court</label>
                      <input
                        disabled
                        type="text"
                        value="Odisha High Court"
                        className="w-full rounded-lg border border-border bg-bg/50 px-3 py-2 text-xs text-text-muted cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Status</label>
                      <select
                        value={caseForm.status}
                        onChange={(e) => setCaseForm({
                          ...caseForm, 
                          status: e.target.value,
                          outcome: e.target.value === "Pending" ? "Pending" : caseForm.outcome === "Pending" ? "Allowed" : caseForm.outcome
                        })}
                        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Disposed">Disposed</option>
                      </select>
                    </div>
                  </div>

                  {caseForm.status === "Disposed" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Outcome</label>
                        <select
                          value={caseForm.outcome}
                          onChange={(e) => setCaseForm({...caseForm, outcome: e.target.value})}
                          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="Allowed">Allowed</option>
                          <option value="Dismissed">Dismissed</option>
                          <option value="Partly Allowed">Partly Allowed</option>
                          <option value="Withdrawn">Withdrawn</option>
                          <option value="Transferred">Transferred</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Judgment Summary</label>
                        <textarea
                          placeholder="State the final order context..."
                          rows="3"
                          value={caseForm.judgment}
                          onChange={(e) => setCaseForm({...caseForm, judgment: e.target.value})}
                          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 rounded-lg bg-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 transition-all duration-200 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    {editingCaseId ? "UPDATE CASE RECORD" : "ADD CASE RECORD"}
                  </button>
                </form>
              </div>
            </div>

            {/* Cases List Table */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 border border-border bg-surface/30">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text mb-4">Court Cases Log</h3>
                {isLoading ? (
                  <div className="py-12 text-center text-text-muted animate-pulse">Loading database data...</div>
                ) : cases.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-text-muted font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Case Number</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Advocate</th>
                          <th className="py-2.5 px-3">Outcome</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {cases.map((c) => (
                          <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-text">{c.case_number}</td>
                            <td className="py-3 px-3 text-text">{c.case_type}</td>
                            <td className="py-3 px-3 text-text-muted font-semibold">{c.lawyers?.name || `ID: ${c.lawyer_id}`}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${
                                c.outcome === "Allowed"
                                  ? "bg-success/15 text-success"
                                  : c.outcome === "Dismissed"
                                  ? "bg-danger/15 text-danger"
                                  : c.outcome === "Pending"
                                  ? "bg-primary/15 text-primary"
                                  : "bg-surface-2 text-text-muted"
                              }`}>
                                {c.outcome}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditCase(c)}
                                  className="rounded border border-border/80 p-1.5 hover:bg-primary/10 hover:text-primary text-text-muted cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCase(c.id, c.case_number)}
                                  className="rounded border border-border/80 p-1.5 hover:bg-danger/10 hover:text-danger text-text-muted cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-text-muted">No cases registered.</div>
                )}
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
