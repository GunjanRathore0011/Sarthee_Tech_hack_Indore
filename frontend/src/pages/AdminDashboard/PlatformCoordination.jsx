import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  FileBadge,
  Upload,
  Globe,
  History,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";


const API_BASE = "http://localhost:4000"

const PLATFORM_META = [
  { key: "google_play", label: "Google Play", code: "GP", hostHints: ["play.google.com"] },
  { key: "amazon_appstore", label: "Amazon Appstore", code: "AMZ", hostHints: ["amazon.com", "appstore.amazon.com"] },
  { key: "telegram", label: "Telegram", code: "TGM", hostHints: ["t.me", "telegram.me"] },
  { key: "instagram", label: "Instagram", code: "IG", hostHints: ["instagram.com"] },
  { key: "facebook", label: "Facebook", code: "FB", hostHints: ["facebook.com", "fb.com"] },
  { key: "x", label: "X (Twitter)", code: "X", hostHints: ["x.com", "twitter.com"] },
  { key: "youtube", label: "YouTube", code: "YT", hostHints: ["youtube.com", "youtu.be"] },
  { key: "github", label: "GitHub", code: "GH", hostHints: ["github.com"] },
  { key: "hosting_provider", label: "Website / Hosting", code: "WEB", hostHints: ["."] },
  { key: "Banking", label: "Banking / Finance", code: "BANK", hostHints: ["bank", "finance"] },
];

const REQUEST_TYPES = [
  { key: "TAKEDOWN", label: "Takedown" },
  { key: "DATA_REQUEST", label: "Data Access Request" },
  { key: "CONTENT_REMOVAL", label: "Content Removal" },
  { key: "EMERGENCY_SHUTDOWN", label: "Emergency Shutdown" },
  { key: "ACCOUNT_SUSPENSION", label: "Account Suspension" },
];

const ENTITY_TYPES = {
  google_play: [
    { key: "APP_PACKAGE", label: "App Package / URL" },
  ],
  amazon_appstore: [
    { key: "APP_URL", label: "App URL" },
  ],
  telegram: [
    { key: "CHANNEL_ID", label: "Channel/Group/Username" },
    { key: "MESSAGE_URL", label: "Message URL (optional)" },
  ],
  instagram: [
    { key: "USERNAME", label: "Username / Profile URL" },
    { key: "POST_URL", label: "Post/Story URL (optional)" },
  ],
  facebook: [
    { key: "PAGE_OR_PROFILE", label: "Page/Profile URL" },
    { key: "POST_URL", label: "Post URL (optional)" },
  ],
  x: [
    { key: "HANDLE", label: "Handle / Profile URL" },
    { key: "POST_URL", label: "Post URL (optional)" },
  ],
  youtube: [
    { key: "CHANNEL_OR_VIDEO", label: "Channel/Video URL" },
  ],
  github: [
    { key: "REPO_OR_PROFILE", label: "Repo / Profile URL" },
  ],
  hosting_provider: [
    { key: "DOMAIN_OR_URL", label: "Domain / URL" },
  ],
  Banking: [
    { key: "ACCOUNT_NUMBER", label: "Account Number" },
    { key: "CARD_NUMBER", label: "Card Number" },
    { key: "TRANSACTION_ID", label: "Transaction ID" },
  ],
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Acknowledged: "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
};

const Timeline = ({ status, createdAt, ackAt, doneAt, refId }) => {
  const steps = [
    { key: "Pending", label: "Sent", icon: Clock },
    { key: "Acknowledged", label: "Acknowledged", icon: ShieldCheck },
    { key: "Completed", label: "Completed", icon: CheckCircle2 },
  ];
  const activeIdx = Math.max(steps.findIndex((s) => s.key === status), 0);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1 flex items-center">
            <div className={`flex items-center gap-2 ${i <= activeIdx ? "text-blue-600" : "text-gray-400"}`}>
              <s.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mx-3 ${i < activeIdx ? "bg-blue-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 text-xs text-gray-500">
        <div>
          <div className="font-medium">Created</div>
          <div>{createdAt ? new Date(createdAt).toLocaleString() : "—"}</div>
        </div>
        <div>
          <div className="font-medium">Ack</div>
          <div>{ackAt ? new Date(ackAt).toLocaleString() : "—"}</div>
        </div>
        <div>
          <div className="font-medium">Ref ID</div>
          <div className="truncate" title={refId || "—"}>{refId || "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default function PlatformCoordination() {
  const location = useLocation();
  const { caseId } = location.state || {};
  if (caseId) {
    console.log("Case ID from state:", caseId);
  }

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Filters
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Form state (aligns with backend)
  const [form, setForm] = useState({
    platform: "",
    requestType: "TAKEDOWN",
    entityType: "",
    entityValue: "",
    targetLink: "",
    reason: "",
    evidenceLink: "",
    evidenceFileName: "",
  });

  const entityOptions = ENTITY_TYPES[form.platform] || [{ key: "GENERIC", label: "Identifier / URL" }];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/platform-requests/get`, {
        complainId: caseId,
      });
      console.log("Fetched requests:", res.data);
      setRequests(res.data.requests || []);
      // if (!selectedId && data?.length) setSelectedId(data[0]._id);
      // setError("");
      // console.log("Fetched requests:", data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load requests");
      console.error("Fetch error:", e);
      toast.error(e?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Auto-detect platform when link changes
  // useEffect(() => {
  //   if (form.targetLink) {
  //     try {
  //       const u = new URL(form.targetLink);
  //       for (const p of PLATFORM_META) {
  //         if (p.hostHints.some((h) => (h === "." ? true : u.host.includes(h)))) {
  //           setForm((f) => ({ ...f, platform: p.key, entityType: (ENTITY_TYPES[p.key]?.[0]?.key) || f.entityType }));
  //           break;
  //         }
  //       }
  //     } catch { }
  //   }
  // }, [form.targetLink]);


  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.platform || !form.requestType || !form.entityType) return;

    try {
      setSubmitting(true);
      // console.log("Submitting request:", form);
      setError("");
      const res = await axios.post(`${API_BASE}/api/platform-requests`, {
        complainId: caseId,
        platform: form.platform,
        requestType: form.requestType,
        // entityType: form.entityType,
        // entityValue: form.entityValue,
        targetLink: form.entityType,
        reason: form.reason,
        // evidenceLink: form.evidenceLink,
        // evidenceFileName: form.evidenceFileName,
      });
      if (res.status !== 200) {
        throw new Error("Failed to submit request");
      }
      setEmail(res.data.email);
      setSubject(res.data.subject);
      toast.success("Request submitted successfully!");
      setForm({
        platform: "",
        requestType: "TAKEDOWN",
        entityType: "",
        entityValue: "",
        targetLink: "",
        reason: "",
        evidenceLink: "",
        evidenceFileName: "",
      });
      // await fetchRequests();
      // setRequests((prev) =>
      //   prev.map((r) => (r._id === res._id ? res : r))
      // );

      // Optionally update selectedId to ensure focus stays
      // setSelectedId(res._id);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit request");
      console.error("Submit error:", e);
      toast.error(e?.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return requests
      .filter((r) => (filterPlatform ? r.platform === filterPlatform : true))
      .filter((r) => (filterStatus ? r.status === filterStatus : true))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [requests, filterPlatform, filterStatus]);

  const current = useMemo(() => requests.find((r) => r._id === selectedId) || filtered[0] || null, [requests, selectedId, filtered]);


  const sendmail = async () => {
  }

  const handleChange = (e) => {
    setEmail(e.target.value);
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Platform Coordination</h1>
          <p className="text-gray-500">Centralized request management for app, website, and data actions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-600">Create Request</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value, entityType: (ENTITY_TYPES[e.target.value]?.[0]?.key) || "" })}
                  required
                >
                  <option value="" disabled>Select a platform</option>
                  {PLATFORM_META.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.requestType}
                  onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                >
                  {REQUEST_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.entityType}
                  onChange={(e) => setForm({ ...form, entityType: e.target.value })}
                  required
                >
                  <option value="" disabled>Select entity type</option>
                  {entityOptions.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>


              {/* Reason */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for request</label>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => setForm((f) => ({
                      ...f,
                      reason:
                        f.reason?.trim()?.length > 0
                          ? f.reason
                          : `Requesting ${f.requestType.replace("_", " ").toLowerCase()} due to suspected phishing/scam activity targeting citizens. Evidence attached.`,
                    }))}
                  >
                    Suggest reason
                  </button>
                </div>
                <textarea
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileBadge className="w-4 h-4" />}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>

              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </form>

            {/* Note */}
            <div className="mt-4 text-xs text-gray-500 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <p>
                For demo, status changes are simulated by the backend. No real provider requests are sent.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Response panel + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Response Panel */}
          <div className="bg-white rounded-xl shadow-md p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-600">AI Powered Email</h2>
            </div>

            {/* Input + Button */}
            {email && email.length > 0 ? (
              <div className="p-5 space-y-5">
                {/* To */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24">To</span>
                  <span className="text-sm text-gray-800">user@example.com</span>
                </div>

                {/* Subject */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-700 w-24"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter Subject"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                {/* Body */}
                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Body
                  </label>
                  <textarea
                    id="body"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Write your email here..."
                    rows={12}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm leading-relaxed"
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-end gap-3 border-t pt-4">
                  <button className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
                    Save Draft
                  </button>
                  <button
                    onClick={sendmail}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 8-16 8 4-8-4-8z" />
                    </svg>
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-b-2xl text-gray-500">
                <p className="text-sm">
                  No email generated yet. Submit a request to generate an email.
                </p>
              </div>
            )}
          </div>



          {/* History / Table */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-600">Request History</h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                >
                  <option value="">All Platforms</option>
                  {PLATFORM_META.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {['Pending', 'Acknowledged', 'Completed', 'Rejected'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-3">Platform</th>
                    <th className="py-2 pr-3">Type</th>
                    {/* <th className="py-2 pr-3">Identifier</th> */}
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Ref ID</th>
                    <th className="py-2 pr-3">Created</th>
                    <th className="py-2 pr-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">No requests found.</td>
                    </tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r._id} className="border-t">
                      <td className="py-2 pr-3">{PLATFORM_META.find((p) => p.key === r.platform)?.label || r.platform}</td>
                      <td className="py-2 pr-3">{REQUEST_TYPES.find((t) => t.key === r.requestType)?.label || r.requestType}</td>
                      {/* <td className="py-2 pr-3 max-w-[220px] truncate" title={r.entityValue}>{r.entityValue}</td> */}
                      <td className="py-2 pr-3"><StatusBadge status={r.status} /></td>
                      <td className="py-2 pr-3 max-w-[180px] truncate" title={r.referenceId || "—"}>{r.referenceId || "—"}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                      <td className="py-2 pr-3">
                        <button
                          className={`text-blue-600 hover:underline text-xs ${selectedId === r._id ? "font-semibold" : ""}`}
                          onClick={() => setSelectedId(r._id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
