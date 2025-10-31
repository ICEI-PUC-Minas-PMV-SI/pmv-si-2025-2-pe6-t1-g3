import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const SizeGuide = ({ isOpen, onClose, isFootwear = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-light">Guia de Tamanhos</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {isFootwear ? (
            // Footwear size guide
            <>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-900 mb-4">Calçados</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-medium">BR</th>
                        <th className="text-left py-3 font-medium">US</th>
                        <th className="text-left py-3 font-medium">EU</th>
                        <th className="text-left py-3 font-medium">CM</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-100">
                        <td className="py-3">35</td>
                        <td className="py-3">5</td>
                        <td className="py-3">36</td>
                        <td className="py-3">22.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">36</td>
                        <td className="py-3">6</td>
                        <td className="py-3">37</td>
                        <td className="py-3">23.0</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">37</td>
                        <td className="py-3">7</td>
                        <td className="py-3">38</td>
                        <td className="py-3">23.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">38</td>
                        <td className="py-3">7.5</td>
                        <td className="py-3">39</td>
                        <td className="py-3">24.0</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">39</td>
                        <td className="py-3">8</td>
                        <td className="py-3">40</td>
                        <td className="py-3">24.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">40</td>
                        <td className="py-3">8.5</td>
                        <td className="py-3">41</td>
                        <td className="py-3">25.0</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">41</td>
                        <td className="py-3">9</td>
                        <td className="py-3">42</td>
                        <td className="py-3">25.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">42</td>
                        <td className="py-3">10</td>
                        <td className="py-3">43</td>
                        <td className="py-3">26.0</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">43</td>
                        <td className="py-3">11</td>
                        <td className="py-3">44</td>
                        <td className="py-3">27.0</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3">44</td>
                        <td className="py-3">12</td>
                        <td className="py-3">45</td>
                        <td className="py-3">28.0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-2">Como medir</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>1. Coloque o pé sobre uma folha de papel</li>
                  <li>2. Marque o ponto mais longo do calcanhar até o dedão</li>
                  <li>3. Meça a distância em centímetros</li>
                  <li>4. Compare com a tabela acima (coluna CM)</li>
                </ul>
              </div>
            </>
          ) : (
            // Clothing size guide
            <>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-900 mb-4">Roupas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-medium">Tamanho</th>
                        <th className="text-left py-3 font-medium">Busto (cm)</th>
                        <th className="text-left py-3 font-medium">Cintura (cm)</th>
                        <th className="text-left py-3 font-medium">Quadril (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium">PP</td>
                        <td className="py-3">78-82</td>
                        <td className="py-3">58-62</td>
                        <td className="py-3">84-88</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium">P</td>
                        <td className="py-3">82-86</td>
                        <td className="py-3">62-66</td>
                        <td className="py-3">88-92</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium">M</td>
                        <td className="py-3">86-90</td>
                        <td className="py-3">66-70</td>
                        <td className="py-3">92-96</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium">G</td>
                        <td className="py-3">90-94</td>
                        <td className="py-3">70-74</td>
                        <td className="py-3">96-100</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium">GG</td>
                        <td className="py-3">94-98</td>
                        <td className="py-3">74-78</td>
                        <td className="py-3">100-104</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-2">Como medir</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>Busto:</strong> Meça na parte mais larga do peito</li>
                  <li><strong>Cintura:</strong> Meça na parte mais estreita da cintura</li>
                  <li><strong>Quadril:</strong> Meça na parte mais larga do quadril</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
