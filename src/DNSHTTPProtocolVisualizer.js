import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DNSHTTPProtocolVisualizer = () => {
  const [domain, setDomain] = useState('');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [dnsSteps, setDnsSteps] = useState([]);
  const [httpSteps, setHttpSteps] = useState([]);
  const [explanation, setExplanation] = useState('');

  const simulateDNSResolution = () => {
    const steps = [
      { name: 'Local DNS Cache', time: Math.random() * 10 },
      { name: 'ISP DNS Server', time: Math.random() * 20 + 10 },
      { name: 'Root DNS Server', time: Math.random() * 30 + 30 },
      { name: 'TLD DNS Server', time: Math.random() * 40 + 60 },
      { name: 'Authoritative DNS Server', time: Math.random() * 50 + 100 },
    ];
    setDnsSteps(steps);
  };

  const simulateHTTPRequest = () => {
    const steps = [
      { name: 'DNS Lookup', time: Math.random() * 100 },
      { name: 'TCP Handshake', time: Math.random() * 50 + 50 },
      { name: 'TLS Handshake', time: Math.random() * 100 + 100 },
      { name: `${httpMethod} Request`, time: Math.random() * 200 + 200 },
      { name: 'Server Processing', time: Math.random() * 500 + 500 },
      { name: 'Response', time: Math.random() * 200 + 200 },
    ];
    setHttpSteps(steps);
  };

  const handleSimulate = () => {
    if (!domain) {
      alert('Please enter a domain name');
      return;
    }
    simulateDNSResolution();
    simulateHTTPRequest();
    updateExplanation();
  };

  const updateExplanation = () => {
    setExplanation(`
      1. DNS Resolution: Your computer first checks its local DNS cache. If not found, it asks your ISP's DNS server. 
         If still not found, it goes through Root, TLD, and finally the Authoritative DNS server to get the IP address.
      2. HTTP Request: Once the IP is known, your browser initiates a TCP handshake, followed by a TLS handshake for HTTPS.
      3. The ${httpMethod} request is then sent to the server, which processes it and sends back a response.
      4. Your browser renders the received content.
    `);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 bg-clip-padding bg-opacity-60 border border-gray-200" style={{ backdropFilter: 'blur(20px)' }}>
          <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">DNS and HTTP Protocol Visualizer</h1>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain:</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Method:</label>
              <select 
                value={httpMethod} 
                onChange={(e) => setHttpMethod(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSimulate}
            className="w-full py-3 px-6 bg-purple-500 text-white rounded-lg text-lg focus:outline-none hover:bg-purple-600 transition-colors duration-300"
          >
            Simulate Request
          </button>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-800">DNS Resolution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dnsSteps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#8884d8" name="Time (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-pink-800">HTTP Request</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={httpSteps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#82ca9d" name="Time (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-yellow-800">What's happening?</h2>
            <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNSHTTPProtocolVisualizer;