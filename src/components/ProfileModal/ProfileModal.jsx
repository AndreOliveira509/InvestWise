import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaCog, FaEdit, FaSave, FaCamera } from 'react-icons/fa'; // Adicionei FaCamera
import styles from './ProfileModal.module.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuth(); // Obtenha o usuário do contexto
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    patrimonio: user ? parseFloat(user.patrimonio) : 0,
    // Adicione outros campos se eles existirem no seu modelo de usuário
  });


  // Bloquear scroll e adicionar blur quando o modal abrir
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        patrimonio: parseFloat(user.patrimonio),
      });
    }

    // Salvar a posição atual do scroll
    const scrollY = window.scrollY;
    
    // Bloquear o scroll do body
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Adicionar blur no conteúdo de fundo
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    if (mainContent) mainContent.style.filter = 'blur(4px)';
    if (header) header.style.filter = 'blur(4px)';

    // Fechar modal ao pressionar ESC
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      // Restaurar scroll e remover blur
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      
      // Remover blur do conteúdo
      if (mainContent) mainContent.style.filter = '';
      if (header) header.style.filter = '';
      
      window.removeEventListener('keydown', handleEsc);
    };
  }, [user]);

const handleSaveChanges = async () => {
  const token = localStorage.getItem('investiwise_token');
  try {
    // Crie um objeto com todos os dados do formulário
    const dataToUpdate = {
      name: formData.name,
      email: formData.email, // Se você permitir a edição do e-mail
      patrimonio: parseFloat(formData.patrimonio),
    };

    const response = await axios.patch(
      '/api/users/me',
      dataToUpdate, // Envie o objeto completo
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Atualiza o estado global do usuário com os novos dados
    setUser(response.data); 
    setIsEditing(false);

  } catch (error) {
    console.error("Erro ao atualizar os dados:", error);
  }
};


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData({ // Reseta para os dados originais do usuário
        name: user.name,
        email: user.email,
        patrimonio: parseFloat(user.patrimonio),
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleModalClick = (e) => {
    // Impedir que cliques dentro do modal se propaguem para o overlay
    e.stopPropagation();
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <FaUser /> },
    { id: 'settings', label: 'Configurações', icon: <FaCog /> }
  ];

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        
        {/* Header do Modal */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Minha Conta</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          
          {/* Header do Perfil */}
          <section className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  <FaUser />
                </div>
                <button className={styles.avatarEdit}>
                  <FaCamera />
                </button>
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.userName}>{user?.name}</h1>
                <p className={styles.userEmail}>{user?.email}</p>
                <div className={styles.userStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>12</span>
                    <span className={styles.statLabel}>Meses</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>R$ {user?.patrimonio}</span>
                    <span className={styles.statLabel}>Orçamento</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>Premium</span>
                    <span className={styles.statLabel}>Plano</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button 
                className={`${styles.editButton} ${isEditing ? styles.save : ''}`}
                onClick={isEditing ? handleSaveChanges : handleEditToggle}>
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? 'Salvar' : 'Editar Perfil'}
              </button>
              {isEditing && (
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </section>

          {/* Abas de Navegação */}
          <section className={styles.tabsSection}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Conteúdo das Abas */}
          <section className={styles.tabContent}>
            
            {/* Aba Perfil */}
            {activeTab === 'profile' && (
              <div className={styles.personalInfo}>
                <h3>Informações Pessoais</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoGroup}>
                    <label>Nome Completo</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{user?.name}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>E-mail</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{user?.email}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>Orçamento</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.patrimonio}
                        onChange={(e) => handleInputChange('patrimonio', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{user?.patrimonio}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Aba Configurações */}
            {activeTab === 'settings' && (
              <div className={styles.settings}>
                <h3>Configurações da Conta</h3>
                <div className={styles.settingsGrid}>
                  
                  <div className={styles.settingGroup}>
                    <h4>Preferências de Notificação</h4>
                    <div className={styles.settingItem}>
                      <label>Notificações por E-mail</label>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.settingItem}>
                      <label>Notificações Push</label>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.settingGroup}>
                    <h4>Preferências de Exibição</h4>
                    <div className={styles.settingItem}>
                      <label>Moeda Padrão</label>
                      <select className={styles.select}>
                        <option value="BRL">Real Brasileiro (R$)</option>
                        <option value="USD">Dólar Americano ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div className={styles.settingItem}>
                      <label>Idioma</label>
                      <select className={styles.select}>
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.settingGroup}>
                    <h4>Privacidade</h4>
                    <div className={styles.settingItem}>
                      <label>Perfil Público</label>
                      <label className={styles.toggle}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                    <div className={styles.settingItem}>
                      <label>Compartilhar Dados Anônimos</label>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
