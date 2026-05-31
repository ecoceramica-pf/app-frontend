import React, { useState, useEffect } from 'react';

/**
 * EnderecoSelector - Componente reutilizável para seleção ou criação de endereço.
 * @param {Array} enderecos - Lista de endereços do usuário [{ id, logradouro, numero, bairro, cidade }]
 * @param {Object} value - Valor atual selecionado { tipo: 'existente' | 'novo', id?: number, dados?: object }
 * @param {Function} onChange - Callback disparado ao alterar a seleção ou os dados do novo endereço
 */
export const EnderecoSelector = ({ enderecos = [], value, onChange }) => {
  const [modo, setModo] = useState('selecionar'); // 'selecionar' ou 'novo'
  const [selectedId, setSelectedId] = useState('');
  const [novoEndereco, setNovoEndereco] = useState({
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: 'Porto Ferreira'
  });

  // Sincroniza estado local com o value inicial, se necessário (simplificado aqui)
  
  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'novo') {
      setModo('novo');
      setSelectedId('');
      onChange({ tipo: 'novo', dados: novoEndereco });
    } else {
      setModo('selecionar');
      setSelectedId(val);
      onChange({ tipo: 'existente', id: val });
    }
  };

  const handleNovoEnderecoChange = (e) => {
    const { name, val } = e.target;
    const updated = { ...novoEndereco, [name]: e.target.value };
    setNovoEndereco(updated);
    onChange({ tipo: 'novo', dados: updated });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <select 
          value={modo === 'novo' ? 'novo' : selectedId}
          onChange={handleSelectChange}
          className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        >
          <option disabled value="">Selecione um endereço para a coleta</option>
          {enderecos.map(end => (
            <option key={end.id} value={end.id}>
              {end.logradouro}, {end.numero} - {end.bairro} ({end.cidade})
            </option>
          ))}
          <option value="novo" className="font-bold text-primary">➕ Cadastrar novo endereço</option>
        </select>
        <i className="pi pi-map-marker absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
      </div>

      {/* Formulário Expansível para Novo Endereço */}
      {modo === 'novo' && (
        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
            Detalhes do Novo Endereço
            <button 
              type="button" 
              onClick={() => { setModo('selecionar'); onChange({ tipo: 'existente', id: '' }); }}
              className="text-xs text-red-500 hover:text-red-700 font-normal"
            >
              Cancelar
            </button>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Logradouro <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="logradouro" 
                required={modo === 'novo'}
                placeholder="Rua, Avenida, etc."
                value={novoEndereco.logradouro}
                onChange={handleNovoEnderecoChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Número <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="numero" 
                required={modo === 'novo'}
                placeholder="Ex: 123, S/N"
                value={novoEndereco.numero}
                onChange={handleNovoEnderecoChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Bairro <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="bairro" 
                required={modo === 'novo'}
                placeholder="Nome do bairro"
                value={novoEndereco.bairro}
                onChange={handleNovoEnderecoChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Cidade <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="cidade" 
                required={modo === 'novo'}
                value={novoEndereco.cidade}
                onChange={handleNovoEnderecoChange}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
