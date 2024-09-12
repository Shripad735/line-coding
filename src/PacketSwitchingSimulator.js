import React, { useState, useEffect, useRef } from 'react';

const PacketSwitchingSimulator = () => {
  const [switchingMethod, setSwitchingMethod] = useState('datagram');
  const [networkSize, setNetworkSize] = useState(5);
  const [packetCount, setPacketCount] = useState(10);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [network, setNetwork] = useState([]);
  const [timeStep, setTimeStep] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    generateNetwork();
  }, [networkSize]);

  const generateNetwork = () => {
    const newNetwork = [];
    for (let i = 0; i < networkSize; i++) {
      newNetwork.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      });
    }
    setNetwork(newNetwork);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeStep(0);
    intervalRef.current = setInterval(() => {
      setTimeStep((prevTimeStep) => prevTimeStep + 1);
      setSimulationResults({
        averageDelay: Math.random() * 100,
        throughput: Math.random() * 1000,
      });
    }, 1000 / simulationSpeed);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isSimulating) {
      clearInterval(intervalRef.current);
    }
  }, [isSimulating]);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Packet Switching Simulator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Configuration</h2>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Switching Method</label>
            <select 
              value={switchingMethod} 
              onChange={(e) => setSwitchingMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="datagram">Datagram (Connectionless)</option>
              <option value="virtual-circuit">Virtual Circuit (Connection-oriented)</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Network Size</label>
            <input 
              type="number" 
              value={networkSize} 
              onChange={(e) => setNetworkSize(parseInt(e.target.value))} 
              min="2" 
              max="10"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Packet Count</label>
            <input 
              type="number" 
              value={packetCount} 
              onChange={(e) => setPacketCount(parseInt(e.target.value))} 
              min="1" 
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Simulation Speed</label>
            <input 
              type="range" 
              value={simulationSpeed} 
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))} 
              min="0.1" 
              max="5" 
              step="0.1"
              className="w-full"
            />
            <span className="text-sm text-gray-600">{simulationSpeed.toFixed(1)}x</span>
          </div>
          
          <button 
            onClick={isSimulating ? stopSimulation : runSimulation} 
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            {isSimulating ? 'Stop Simulation' : 'Run Simulation'}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Simulation Results</h2>
          {simulationResults ? (
            <div className="mb-6">
              <p className="text-lg mb-2">Average Delay: <span className="font-semibold text-indigo-600">{simulationResults.averageDelay.toFixed(2)} ms</span></p>
              <p className="text-lg mb-2">Throughput: <span className="font-semibold text-indigo-600">{simulationResults.throughput.toFixed(2)} packets/s</span></p>
            </div>
          ) : (
            <p className="text-gray-600 mb-6">Run the simulation to see results</p>
          )}
          
          <div className="mt-4 bg-gray-100 h-80 rounded-lg relative overflow-hidden">
            {network.map((node) => (
              <div
                key={node.id}
                className="absolute w-4 h-4 bg-indigo-500 rounded-full"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              ></div>
            ))}
            {network.map((node, index) => (
              network.slice(index + 1).map((otherNode) => (
                <svg key={`${node.id}-${otherNode.id}`} className="absolute top-0 left-0 w-full h-full">
                  <line
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="#9CA3AF"
                    strokeWidth="1"
                  />
                </svg>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacketSwitchingSimulator;