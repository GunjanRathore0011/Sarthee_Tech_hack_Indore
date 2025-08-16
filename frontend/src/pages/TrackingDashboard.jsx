// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TrackingDashboard = ({ investigatorToken }) => {
//   const [caseId, setCaseId] = useState('');
//   const [originalUrl, setOriginalUrl] = useState('');
//   const [trackingUrl, setTrackingUrl] = useState('');
//   const [logs, setLogs] = useState([]);

//   const currentUser = useSelector((state) => state.user);
//   const investigatorId = currentUser.user.additionDetails;


//   // Generate Tracking Link
//   const handleGenerateLink = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:4000/api/v1/tracking/create`,
//         { caseId, originalUrl },
//         { withCredentials: true, }
//       );

//       setTrackingUrl(res.data.trackingUrl);
//       fetchLogs(); // fetch logs after generating
//     } catch (err) {
//       console.error(err);
//       toast.error('Error generating link');
//     }
//   };

//   // Fetch logs
//   const fetchLogs = async () => {
//     if (!caseId) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/api/v1/tracking/logs/${caseId}`,
//         {

//           withCredentials: true,
//         }
//       );
//       setLogs(res.data.data);
//     } catch (err) {
//       console.error(err);
//       toast.error('Error fetching logs');
//     }
//   };


//  const handleRedirect = (e) => {
//   e.preventDefault();

//   const shortCode = trackingUrl.split("/t/")[1]; // "8dU5hZ3u"
//   window.location.href = `http://localhost:4000/api/v1/tracking/t/${shortCode}`;
// };


//   useEffect(() => {
//     if (caseId) fetchLogs();
//   }, [caseId]);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Investigator Tracking Dashboard</h2>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter Case ID"
//           value={caseId}
//           onChange={(e) => setCaseId(e.target.value)}
//           className="border p-2 mr-2"
//         />
//         <input
//           type="text"
//           placeholder="Enter Original URL"
//           value={originalUrl}
//           onChange={(e) => setOriginalUrl(e.target.value)}
//           className="border p-2 mr-2"
//         />
//         <button
//           onClick={handleGenerateLink}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Generate Link
//         </button>
//       </div>

//       {trackingUrl && (
//         <div className="mb-4">
//           <strong>Tracking Link:</strong>{' '}
//           <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600" onClick={handleRedirect}>
//             {trackingUrl}
//           </a>
//         </div>
//       )}

//       <h3 className="text-lg font-semibold mt-4 mb-2">Click Logs</h3>
//       <table className="table-auto border-collapse border border-gray-300 w-full">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border px-2 py-1">IP Address</th>
//             <th className="border px-2 py-1">User Agent</th>
//             <th className="border px-2 py-1">Timestamp</th>
//             <th className="border px-2 py-1">Original URL</th>
//             <th className="border px-2 py-1">Short Code</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log) => (
//             <tr key={log._id}>
//               <td className="border px-2 py-1">{log.ipAddress}</td>
//               <td className="border px-2 py-1">{log.userAgent}</td>
//               <td className="border px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
//               <td className="border px-2 py-1">{log.linkId.originalUrl}</td>
//               <td className="border px-2 py-1">{log.linkId.shortCode}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TrackingDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { data } from "react-router-dom";

const TrackingDashboard = () => {
  const [caseId, setCaseId] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [caseLogs, setCaseLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [viewMode, setViewMode] = useState("investigator"); // "case" | "investigator"

  const currentUser = useSelector((state) => state.user);
  const investigatorId = currentUser?.user?.additionDetails;

  // Generate Tracking Link
  const handleGenerateLink = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/tracking/create`,
        { caseId, originalUrl },
        { withCredentials: true }
      );

      setTrackingUrl(res.data.trackingUrl);
      fetchLogs(); // refresh logs after generating
    } catch (err) {
      console.error(err);
      toast.error("Error generating link");
    }
  };

  // Fetch logs (Case-wise / Investigator-wise)
  const fetchLogs = async () => {
    console.log("Fetching logs for view mode:", viewMode, "Case ID:", caseId);
    if (!caseId && viewMode === "case") {
      toast.error("Please enter a Case ID to fetch logs.");
      return;
    }
    // console.log("Fetching logs for view mode:", viewMode, "Case ID:", caseId);
    try {
      let res;
      if (viewMode === "case" && caseId) {
        if (!caseId) return;
        res = await axios.get(
          `http://localhost:4000/api/v1/tracking/logs/${caseId}`,
          { withCredentials: true }
        );
        console.log("Case logs fetched:", res.data);
        setCaseLogs(res.data.data || []);
        if (res.data.success == true) {
          toast.success(data.message);
        }
      } else {
        res = await axios.get(
          `http://localhost:4000/api/v1/tracking/allinvestigator`,
          { withCredentials: true }
        );
        setLogs(res.data.data || []);
        if (res.data.success == true) {
          toast.success(data.message);
        }
      }

    } catch (err) {
      console.error(err);
      toast.error("Error fetching logs");
    }
  };

  // Redirect to short link
  const handleRedirect = (e) => {
    e.preventDefault();
    if (!trackingUrl) return;

    const shortCode = trackingUrl.split("/t/")[1];
    window.location.href = `http://localhost:4000/api/v1/tracking/t/${shortCode}`;
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [caseId, viewMode]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Investigator Tracking Dashboard</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Enter Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleGenerateLink}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Link
        </button>
      </div>
      {/* Mode Switch */}
      <div className="mb-4 flex gap-4">

        <button
          onClick={() => setViewMode("investigator")}
          className={`px-4 py-2 rounded ${viewMode === "investigator"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
            }`}
        >
          My All Logs
        </button>
        <button
          onClick={() => setViewMode("case")}
          className={`px-4 py-2 rounded ${viewMode === "case" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
          Case Logs
        </button>
      </div>

      {viewMode === "case" && (
        <div>
          <input
            type="text"
            placeholder="Enter Case ID"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="border p-2 mr-2"
          />
          
        </div>
      )}

      {/* Tracking Link */}
      {trackingUrl && (
        <div className="mb-4">
          <strong>Tracking Link:</strong>{" "}
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
            onClick={handleRedirect}
          >
            {trackingUrl}
          </a>
        </div>
      )}

      {/* Logs Table */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Click Logs</h3>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">IP Address</th>
            <th className="border px-2 py-1">User Agent</th>
            <th className="border px-2 py-1">Timestamp</th>
            <th className="border px-2 py-1">Original URL</th>
            <th className="border px-2 py-1">Short Code</th>
            {viewMode === "investigator" && (
              <th className="border px-2 py-1">Case ID</th>
            )}
          </tr>
        </thead>
        <tbody>
          {viewMode === "case" ? (
            caseLogs.length > 0 ? (
              caseLogs.map((log) => (
                <tr key={log._id}>
                  <td className="border px-2 py-1">{log.ipAddress}</td>
                  <td className="border px-2 py-1">{log.userAgent}</td>
                  <td className="border px-2 py-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    {log?.linkId?.originalUrl || "-"}
                  </td>
                  <td className="border px-2 py-1">
                    {log?.linkId?.shortCode || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-2">
                  No case logs found
                </td>
              </tr>
            )
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log._id}>
                <td className="border px-2 py-1">{log.ipAddress}</td>
                <td className="border px-2 py-1">{log.userAgent}</td>
                <td className="border px-2 py-1">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="border px-2 py-1">
                  {log?.linkId?.originalUrl || "-"}
                </td>
                <td className="border px-2 py-1">
                  {log?.linkId?.shortCode || "-"}
                </td>
                <td className="border px-2 py-1">
                  {log?.linkId?.caseId || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-2">
                No investigator logs found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default TrackingDashboard;
