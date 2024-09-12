import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const encodingTechniques = [
  "NRZ-L", "NRZ-I", "RZ", "Manchester", "Differential Manchester", "AMI", "Pseudoternary"
];

const errorDetectionMethods = ["Hamming Code", "CRC-8"];

const LineCodingVisualizer = () => {
  const [inputData, setInputData] = useState('');
  const [technique, setTechnique] = useState('NRZ-L');
  const [encodedData, setEncodedData] = useState([]);
  const [errorDetectionMethod, setErrorDetectionMethod] = useState('Hamming Code');
  const [errorCorrectedData, setErrorCorrectedData] = useState('');
  const [errorPosition, setErrorPosition] = useState(-1);

  const encodeData = (data, technique) => {
    const binaryData = data.split('').map(bit => parseInt(bit));
    let encoded = [];
  
    switch (technique) {
      case 'NRZ-L':
        encoded = binaryData.map(bit => bit ? 1 : -1);
        break;
      case 'NRZ-I':
        let currentLevel = 1;
        encoded = binaryData.map(bit => {
          if (bit === 1) currentLevel *= -1;
          return currentLevel;
        });
        break;
      case 'RZ':
        encoded = binaryData.flatMap(bit => bit ? [1, 0] : [-1, 0]);
        break;
      case 'Manchester':
        encoded = binaryData.flatMap(bit => bit ? [1, -1] : [-1, 1]);
        break;
      case 'Differential Manchester':
        currentLevel = 1;
        encoded = binaryData.flatMap(bit => {
          const result = bit ? [-currentLevel, currentLevel] : [currentLevel, -currentLevel];
          if (bit === 0) currentLevel *= -1;
          return result;
        });
        break;
      case 'AMI':
        currentLevel = 1;
        encoded = binaryData.map(bit => {
          if (bit === 0) return 0;
          const result = currentLevel;
          currentLevel *= -1;
          return result;
        });
        break;
      case 'Pseudoternary':
        currentLevel = 1;
        encoded = binaryData.map(bit => {
          if (bit === 1) return 0;
          const result = currentLevel;
          currentLevel *= -1;
          return result;
        });
        break;
      default:
        encoded = [];
    }
  
    return encoded.map((value, index) => ({ time: index, value }));
  };

  const applyHammingCode = (data) => {
    const dataLength = data.length;
    const m = Math.ceil(Math.log2(dataLength + Math.ceil(Math.log2(dataLength)) + 1));
    const totalLength = dataLength + m;
    
    let encoded = new Array(totalLength).fill(0);
    let j = 0;
    for (let i = 0; i < totalLength; i++) {
      if ((i + 1) & i) {
        encoded[i] = parseInt(data[j]);
        j++;
      }
    }
    
    for (let i = 0; i < m; i++) {
      const pos = Math.pow(2, i) - 1;
      let parity = 0;
      for (let j = pos; j < totalLength; j += (pos + 1) * 2) {
        for (let k = 0; k < pos + 1 && j + k < totalLength; k++) {
          parity ^= encoded[j + k];
        }
      }
      encoded[pos] = parity;
    }
    
    return encoded.join('');
  };

  const applyCRC8 = (data) => {
    const polynomial = 0x07; // x^8 + x^2 + x^1 + 1
    let crc = 0;
    
    for (let i = 0; i < data.length; i++) {
      crc ^= (parseInt(data[i]) << 7);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x80) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
      }
    }
    
    return data + crc.toString(2).padStart(8, '0');
  };

  const introduceError = (data) => {
    const errorPos = Math.floor(Math.random() * data.length);
    setErrorPosition(errorPos);
    const errorBit = data[errorPos] === '0' ? '1' : '0';
    return data.substring(0, errorPos) + errorBit + data.substring(errorPos + 1);
  };

  const correctHammingCode = (data) => {
    const dataLength = data.length;
    const m = Math.ceil(Math.log2(dataLength));
    
    let errorBit = 0;
    for (let i = 0; i < m; i++) {
      const pos = Math.pow(2, i) - 1;
      let parity = 0;
      for (let j = pos; j < dataLength; j += (pos + 1) * 2) {
        for (let k = 0; k < pos + 1 && j + k < dataLength; k++) {
          parity ^= parseInt(data[j + k]);
        }
      }
      if (parity !== 0) {
        errorBit += pos + 1;
      }
    }
    
    if (errorBit !== 0) {
      const correctedBit = data[errorBit - 1] === '0' ? '1' : '0';
      return data.substring(0, errorBit - 1) + correctedBit + data.substring(errorBit);
    }
    
    return data;
  };

  const detectCRC8Error = (data) => {
    const dataLength = data.length - 8;
    const receivedCRC = parseInt(data.slice(dataLength), 2);
    const polynomial = 0x07;
    let crc = 0;
    
    for (let i = 0; i < dataLength; i++) {
      crc ^= (parseInt(data[i]) << 7);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x80) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
      }
    }
    
    return crc === receivedCRC ? data.slice(0, dataLength) : "Error detected";
  };

  const handleEncode = () => {
    if (!/^[01]+$/.test(inputData)) {
      alert('Please enter valid binary data (0s and 1s only)');
      return;
    }
    
    const encoded = encodeData(inputData, technique);
    setEncodedData(encoded);
    
    let errorProtectedData;
    if (errorDetectionMethod === 'Hamming Code') {
      errorProtectedData = applyHammingCode(inputData);
    } else {
      errorProtectedData = applyCRC8(inputData);
    }
    
    const dataWithError = introduceError(errorProtectedData);
    let correctedData;
    if (errorDetectionMethod === 'Hamming Code') {
      correctedData = correctHammingCode(dataWithError);
    } else {
      correctedData = detectCRC8Error(dataWithError);
    }
    setErrorCorrectedData(correctedData);
  };

  const handleClear = () => {
    setInputData('');
    setEncodedData([]);
    setErrorCorrectedData('');
    setErrorPosition(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Line Coding Visualizer with Error Detection & Correction</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Input Data</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter binary data"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Line Coding Technique</label>
                  <select
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value)}
                  >
                    {encodingTechniques.map((tech) => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Error Detection Method</label>
                  <select
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    value={errorDetectionMethod}
                    onChange={(e) => setErrorDetectionMethod(e.target.value)}
                  >
                    {errorDetectionMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={handleEncode}
                  >
                    Encode & Detect Errors
                  </button>
                  <button
                    className="bg-red-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Encoded Data: {encodedData.map(d => d.value).join(', ')}</p>
                <p>Error Corrected Data: {errorCorrectedData}</p>
                {errorPosition !== -1 && <p>Error introduced at position: {errorPosition}</p>}
              </div>
            </div>
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={encodedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[-1.5, 1.5]} ticks={[-1, 0, 1]} />
                <Tooltip />
                <Legend />
                <Line type="stepAfter" dataKey="value" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineCodingVisualizer;