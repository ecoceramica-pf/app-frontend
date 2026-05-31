import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { authService } from '../services/authService';

export const Perfil = () => {
  const { user, reloadUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: '', telefone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const openEditModal = () => {
    setFormData({ nome: user?.nome || '', telefone: user?.telefone || '', password: '' });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { nome: formData.nome, telefone: formData.telefone };
      if (formData.password) payload.password = formData.password;
      
      await authService.updateMe(payload);
      await reloadUser();
      
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado com sucesso!', life: 3000 });
      setIsEditing(false);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o perfil. Verifique os dados.', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Toast ref={toast} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Meu Perfil</h1>
        <Button label="Editar Dados" icon="pi pi-pencil" outlined className="p-button-secondary" onClick={openEditModal} />
      </div>

      <Card className="shadow-lg rounded-[var(--radius-card)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex flex-col items-center gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl w-full md:w-1/3">
            <Avatar 
              label={user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'} 
              shape="circle" 
              size="xlarge"
              className="bg-primary text-white font-bold text-4xl w-24 h-24"
            />
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.nome || 'Usuário Teste'}</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 inline-block">
                {user?.tipo_perfil || 'Não definido'}
              </span>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 dark:border-gray-700">
              Informações de Contato
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</p>
                <p className="font-medium text-gray-800 dark:text-gray-300">{user?.email || 'email@teste.com'}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Telefone</p>
                <p className="font-medium text-gray-800 dark:text-gray-300">{user?.telefone || 'Não informado'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Documento (CNPJ/CPF)</p>
                <p className="font-medium text-gray-800 dark:text-gray-300">{user?.documento || 'Não informado'}</p>
              </div>
            </div>
          </div>

        </div>
      </Card>

      <Dialog header="Editar Perfil" visible={isEditing} style={{ width: '90vw', maxWidth: '500px' }} onHide={() => setIsEditing(false)}>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <InputText id="nome" name="nome" value={formData.nome} onChange={handleChange} className="w-full" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="telefone" className="font-medium text-gray-700 dark:text-gray-300">Telefone</label>
            <InputText id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300">Nova Senha (opcional)</label>
            <InputText id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="w-full" placeholder="Deixe em branco para manter a atual" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button label="Cancelar" icon="pi pi-times" outlined onClick={() => setIsEditing(false)} />
          <Button label="Salvar" icon="pi pi-check" loading={loading} onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
};
