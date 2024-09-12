import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import LineCodingVisualizer from './LineCodingVisualizer';
import TCPUDPTrafficAnalysis from './TCPUDPTrafficAnalysis';
import DNSHTTPProtocolVisualizer from './DNSHTTPProtocolVisualizer';
import PacketSwitchingSimulator from './PacketSwitchingSimulator';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/line-coding-visualizer" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">Network Visualizer</span>
                  </Link>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Link to="/line-coding-visualizer" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Line Coding</Link>
                  <Link to="/tcp-udp" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">TCP/UDP</Link>
                  <Link to="/dns-http" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">DNS/HTTP</Link>
                  <Link to="/packet-switching-simulator" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Packet Switching Simulator</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/line-coding" element={<Navigate to="/line-coding-visualizer" />} />
          <Route path="/line-coding-visualizer" element={<LineCodingVisualizer />} />
          <Route path="/tcp-udp" element={<TCPUDPTrafficAnalysis />} />
          <Route path="/dns-http" element={<DNSHTTPProtocolVisualizer />} />
          <Route path="/packet-switching-simulator" element={<PacketSwitchingSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;