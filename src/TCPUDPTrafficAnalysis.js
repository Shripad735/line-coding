import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TCPUDPTrafficAnalysis = () => {
  const [protocol, setProtocol] = useState('TCP');
  const [application, setApplication] = useState('File Transfer');
  const [packetData, setPacketData] = useState([]);
  const [packetLoss, setPacketLoss] = useState(0);
  const [retransmissions, setRetransmissions] = useState(0);
  const [lossRate, setLossRate] = useState(0.1);
  const [packetSize, setPacketSize] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setPacketData(prevData => {
          const newPacket = {
            time: prevData.length,
            sent: packetSize,
            received: 0
          };

          if (protocol === 'TCP') {
            newPacket.received = newPacket.sent;
            if (Math.random() < lossRate) {
              setPacketLoss(prev => prev + 1);
              setRetransmissions(prev => prev + 1);
            }
          } else {
            if (Math.random() < lossRate * 2) {
              newPacket.received = 0;
              setPacketLoss(prev => prev + 1);
            } else {
              newPacket.received = newPacket.sent;
            }
          }

          return [...prevData.slice(-19), newPacket];
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [protocol, lossRate, packetSize, isSimulating]);

  const handleSimulate = () => {
    setIsSimulating(prev => !prev);
    setPacketData([]);
    setPacketLoss(0);
    setRetransmissions(0);
    updateExplanation();
  };

  const updateExplanation = () => {
    if (protocol === 'TCP') {
      setExplanation("TCP (Transmission Control Protocol) ensures reliable, ordered, and error-checked delivery of data. It uses acknowledgments and retransmissions to handle packet loss. Notice how the 'Packets Sent' and 'Packets Received' lines stay together, showing TCP's reliability.");
    } else {
      setExplanation("UDP (User Datagram Protocol) provides a simpler, connectionless communication with no guarantee of delivery, ordering, or duplicate protection. Observe how the 'Packets Received' line may drop below 'Packets Sent', indicating packet loss without retransmission.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 bg-clip-padding bg-opacity-60 border border-gray-200" style={{ backdropFilter: 'blur(20px)' }}>
          <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">TCP/UDP Traffic Analysis</h1>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Protocol:</label>
              <select 
                value={protocol} 
                onChange={(e) => { setProtocol(e.target.value); updateExplanation(); }}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application:</label>
              <select 
                value={application} 
                onChange={(e) => setApplication(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="File Transfer">File Transfer</option>
                <option value="Streaming">Streaming</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Packet Size (KB):</label>
              <input 
                type="number" 
                value={packetSize} 
                onChange={(e) => setPacketSize(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Packet Loss Rate:</label>
              <input 
                type="number" 
                value={lossRate} 
                step="0.01" 
                onChange={(e) => setLossRate(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button 
            onClick={handleSimulate}
            className={`w-full py-3 px-6 text-white rounded-lg text-lg focus:outline-none ${isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-colors duration-300`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <div className="mt-8 p-4 bg-indigo-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-indigo-800">Simulation Results:</h2>
            <p className="text-gray-700">Packet Loss: {packetLoss}</p>
            {protocol === 'TCP' && <p className="text-gray-700">Retransmissions: {retransmissions}</p>}
          </div>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={packetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Packets Sent" />
                <Line type="monotone" dataKey="received" stroke="#82ca9d" name="Packets Received" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-yellow-800">What's happening?</h2>
            <p className="text-gray-700">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TCPUDPTrafficAnalysis;