import React from 'react';
import styles from './DeleteConfirmationModal.module.css';
import Button from '../Button/Button'; // Reutiliza seu componente de botão existente

/**
 * Modal de Confirmação de Exclusão
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controla a visibilidade do modal.
 * @param {function} props.onClose - Função chamada ao fechar o modal (Cancelar, 'X', clique no fundo).
 * @param {function} props.onConfirm - Função chamada ao confirmar a exclusão (botão 'Excluir').
 * @param {string} props.title - O título do modal (ex: "Excluir Gasto" ou "Excluir Investimento").
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) {
    return null; // Não renderiza nada se estiver fechado
  }

  // Previne que o clique dentro do modal feche o modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // O 'onClick={onClose}' no backdrop permite fechar ao clicar fora
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        {/* Botão de fechar (X) */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        {/* Título dinâmico */}
        <h2>{title || 'Confirmar Exclusão'}</h2>
        
        {/* Mensagem solicitada */}
        <p className={styles.message}>
          Você tem certeza disso?
        </p>
        
        <div className={styles.buttonContainer}>
          {/* Botão de Cancelar. 
            Como ele não é uma ação destrutiva, usa o estilo padrão (verde)
            do seu componente <Button>.
          */}
          <Button onClick={onClose}>
            Cancelar
          </Button>
          
          {/* Wrapper para forçar o estilo de "perigo" (vermelho) no botão de confirmação,
            já que o componente Button original não aceita variantes de cor.
            Isso não mexe no código original do Button.
          */}
          <div className={styles.confirmButtonWrapper}>
            <Button onClick={onConfirm}>
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;