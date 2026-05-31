import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Tooltip } from 'primereact/tooltip';

export const ConfirmarOfertaModal = ({ 
  visible, 
  onHide, 
  onConfirm, 
  formData, 
  materialObj, 
  enderecoStr, 
  isSubmitting,
  confirmChecked,
  setConfirmChecked
}) => {
  // Determinar badges
  const isCortante = materialObj?.cortante;
  const isAltoVolume = (formData.cacambas && parseInt(formData.cacambas) > 0) || (formData.quantidade_kg && parseFloat(formData.quantidade_kg) > 500);

  // Formatar quantidade
  let qtdeStr = [];
  if (formData.quantidade_kg) qtdeStr.push(`${formData.quantidade_kg} kg`);
  if (formData.cacambas) qtdeStr.push(`${formData.cacambas} caçamba(s)`);
  const quantidadeFinal = qtdeStr.join(' + ') || 'Não especificada';

  const headerElement = (
    <div className="flex items-center gap-2">
      <i className="pi pi-check-circle text-green-600 text-2xl"></i>
      <h3 className="text-xl font-bold text-primary m-0">Revisão de Oferta</h3>
    </div>
  );

  return (
    <Dialog 
      visible={visible} 
      onHide={onHide} 
      header={headerElement}
      style={{ width: '95vw', maxWidth: '500px' }}
      draggable={false}
      resizable={false}
      modal
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* Summary Card */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-hidden shadow-sm border-l-8 border-l-red-800 dark:border-l-red-900">
          <div className="p-4 flex flex-col">
            
            {/* Material */}
            <div className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <i className="pi pi-box text-red-800 dark:text-red-400 text-xl"></i>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Material</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{materialObj?.nome || 'N/A'}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <i className="pi pi-sort-alt text-red-800 dark:text-red-400 text-xl"></i>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Quantidade</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{quantidadeFinal}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 py-3">
              <i className="pi pi-map-marker text-red-800 dark:text-red-400 text-xl"></i>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Local de Coleta</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{enderecoStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Row */}
        {(isCortante || isAltoVolume) && (
          <div className="flex flex-wrap gap-2">
            {isCortante && (
              <div className="flex items-center gap-1 bg-red-800 text-white px-3 py-1 rounded-full">
                <i className="pi pi-exclamation-triangle text-xs"></i>
                <span className="font-bold text-xs">Material Cortante</span>
              </div>
            )}
            {isAltoVolume && (
              <div className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full">
                <i className="pi pi-chart-line text-xs"></i>
                <span className="font-bold text-xs">Alto Volume</span>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Checkbox */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Checkbox 
              inputId="confirm-checkbox" 
              checked={confirmChecked} 
              onChange={(e) => setConfirmChecked(e.checked)} 
              disabled={isSubmitting}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <label htmlFor="confirm-checkbox" className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                  Confirmo que os dados estão corretos
                </label>
                <Tooltip target=".info-tooltip" />
                <i className="pi pi-info-circle text-primary text-sm info-tooltip" data-pr-tooltip="Você poderá editar a oferta após publicação através do seu perfil." data-pr-position="top"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button 
            label="Editar" 
            outlined 
            onClick={onHide} 
            disabled={isSubmitting}
            className="w-full py-3 font-bold text-primary border-2 border-primary hover:bg-gray-50 dark:hover:bg-gray-800 justify-center"
          />
          <Button 
            label={isSubmitting ? "Publicando..." : "Publicar"} 
            icon={isSubmitting ? "pi pi-spin pi-spinner" : ""}
            disabled={!confirmChecked || isSubmitting}
            onClick={onConfirm}
            className="w-full py-3 bg-green-600 hover:bg-green-700 border-none text-white font-bold justify-center"
          />
        </div>

        {/* Footer Note */}
        <p className="text-center font-semibold text-xs text-gray-500 dark:text-gray-400 mt-2">
          Sua oferta será visível no mural por 30 dias
        </p>

      </div>
    </Dialog>
  );
};
