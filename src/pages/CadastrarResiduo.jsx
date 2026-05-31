import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { EnderecoSelector } from '../components/common/EnderecoSelector';
import { ConfirmarOfertaModal } from '../components/dashboard/ConfirmarOfertaModal';
import { materiaisService } from '../services/materiaisService';
import { enderecosService } from '../services/enderecosService';
import { ofertasService } from '../services/ofertasService';

export const CadastrarResiduo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    material: '',
    quantidade_kg: '',
    cacambas: '',
    endereco: null,
    observacoes: ''
  });

  const [materiais, setMateriais] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materiaisData, enderecosData] = await Promise.all([
          materiaisService.listar(),
          enderecosService.listar()
        ]);
        
        // Handling standard Laravel API responses which might be wrapped in { data: [...] }
        setMateriais(materiaisData.data || materiaisData);
        setEnderecos(enderecosData.data || enderecosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!formData.endereco) {
      toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione ou cadastre um endereço de retirada.', life: 4000 });
      return;
    }
    setShowConfirmModal(true);
    setConfirmChecked(false);
  };

  const confirmAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      let endereco_id = null;

      if (formData.endereco.tipo === 'novo') {
        const resEndereco = await enderecosService.criar(formData.endereco.dados);
        // O padrão do Laravel Resource retorna dentro de data
        endereco_id = resEndereco.data ? resEndereco.data.id : resEndereco.id;
      } else {
        endereco_id = formData.endereco.id;
      }

      const payload = {
        material_id: formData.material,
        quantidade_kg: formData.quantidade_kg ? parseFloat(formData.quantidade_kg) : null,
        quantidade_cacamba: formData.cacambas ? parseInt(formData.cacambas, 10) : null,
        endereco_id: endereco_id,
        observacoes: formData.observacoes || null
      };

      await ofertasService.criarOferta(payload);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao publicar a oferta. Verifique os dados e tente novamente.', life: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMaterialObj = materiais.find(m => m.id == formData.material);
  
  let enderecoStr = 'Endereço não definido';
  if (formData.endereco) {
    if (formData.endereco.tipo === 'novo' && formData.endereco.dados) {
      const { logradouro, numero, bairro, cidade } = formData.endereco.dados;
      enderecoStr = `${logradouro}, ${numero} - ${bairro}, ${cidade}`;
    } else if (formData.endereco.tipo === 'existente') {
      const end = enderecos.find(e => e.id == formData.endereco.id);
      if (end) {
        enderecoStr = `${end.logradouro}, ${end.numero} - ${end.bairro}, ${end.cidade}`;
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Toast ref={toast} position="top-right" />
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registrar Novo Resíduo</h2>
        <p className="text-gray-600 dark:text-gray-400">Preencha os detalhes do material disponível para coleta.</p>
      </div>

      <form onSubmit={handleOpenConfirm} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Material Type */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-800 dark:text-gray-200" htmlFor="material">Tipo de Material <span className="text-red-500">*</span></label>
          <div className="relative">
            <select 
              id="material"
              name="material"
              required
              value={formData.material}
              onChange={handleChange}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option disabled value="">Selecione o material</option>
              {materiais.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
            <i className="pi pi-angle-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
          </div>
        </div>

        {/* Quantity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-800 dark:text-gray-200" htmlFor="quantidade_kg">Quantidade (kg) <span className="text-red-500">*</span></label>
            <input 
              id="quantidade_kg"
              name="quantidade_kg"
              type="number"
              required
              placeholder="0.00"
              value={formData.quantidade_kg}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-gray-800 dark:text-gray-200" htmlFor="cacambas">Caçambas (opcional)</label>
            <input 
              id="cacambas"
              name="cacambas"
              type="number"
              placeholder="0"
              value={formData.cacambas}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Location / Address Selection */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-800 dark:text-gray-200">Endereço de Retirada <span className="text-red-500">*</span></label>
          {loading ? (
            <div className="text-sm text-gray-500">Carregando endereços...</div>
          ) : (
            <EnderecoSelector 
              enderecos={enderecos}
              value={formData.endereco}
              onChange={(novoValor) => setFormData(prev => ({ ...prev, endereco: novoValor }))}
            />
          )}
        </div>

        {/* Observations */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-800 dark:text-gray-200" htmlFor="observacoes">Observações Adicionais</label>
          <textarea 
            id="observacoes"
            name="observacoes"
            rows="3"
            placeholder="Detalhes sobre acesso, horários preferenciais, etc."
            value={formData.observacoes}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
          ></textarea>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-3">
          <Button 
            type="submit"
            label="Publicar Oferta" 
            icon="pi pi-upload" 
            className="w-full py-3 !bg-primary hover:!bg-primary/90 !border-none !text-white font-bold text-lg justify-center shadow-md" 
          />
          <Button 
            type="button"
            label="Cancelar" 
            outlined 
            className="w-full py-3 font-bold text-lg justify-center text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" 
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </form>

      <ConfirmarOfertaModal 
        visible={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={confirmAndSubmit}
        formData={formData}
        materialObj={selectedMaterialObj}
        enderecoStr={enderecoStr}
        isSubmitting={isSubmitting}
        confirmChecked={confirmChecked}
        setConfirmChecked={setConfirmChecked}
      />
    </div>
  );
};
