
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PatternAlertsCard(){
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAlerts(){
    try{
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/v1/patterns/pattern-alerts', { withCredentials: true });
      if(res.data && res.data.alerts) setAlerts(res.data.alerts);
      console.log('Fetched alerts:', res.data.alerts);
    //   console.log('Total alerts:', res.data)
    }catch(err){ console.error(err); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{
    fetchAlerts();
    const id = setInterval(fetchAlerts, 15000); // poll every 15s for demo
    return ()=> clearInterval(id);
  },[]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Pattern Alerts</h3>
        <button onClick={fetchAlerts} className="text-sm px-2 py-1 border rounded">Refresh</button>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && alerts.length===0 && <div className="text-sm text-gray-500">No pattern alerts detected.</div>}

      <ul>
        {alerts.map(alert => (
          <li key={alert._id} className="mb-3 p-3 border rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">{alert.type}</div>
                <div className="text-base font-medium">{displayKey(alert)}</div>
                <div className="text-sm text-gray-500">{alert.count} complaints</div>
                <div className="text-sm">Risk: <strong>{alert.riskScore}</strong></div>
              </div>
              <div className="text-right">
                <a href={`/admin/patterns/${alert._id}`} className="text-sm underline">View</a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function displayKey(alert){
  if(alert.type==='cardNumber') return maskDisplay(alert.key);
  if(alert.type==='imageHash') return `Image: ${alert.count} matches`;
  return alert.key;
}

function maskDisplay(masked){
  if(!masked) return '';
  // show last 4 only
  const digits = masked.replace(/\D/g,'');
  if(digits.length<=4) return masked;
  return '****' + digits.slice(-4);
}