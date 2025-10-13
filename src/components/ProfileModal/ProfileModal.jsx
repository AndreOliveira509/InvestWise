import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaCog, FaEdit, FaSave, FaCamera } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import styles from './ProfileModal.module.css';

const ProfileModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados do usuário
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    location: 'São Paulo, SP',
    birthDate: '15/03/1990',
    cpf: '123.456.789-00'
  });

  const [formData, setFormData] = useState(userData);

  // Bloquear scroll e adicionar blur quando o modal abrir
  useEffect(() => {
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
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setUserData(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData(userData);
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
                <h1 className={styles.userName}>{userData.name}</h1>
                <p className={styles.userEmail}>{userData.email}</p>
                <div className={styles.userStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>12</span>
                    <span className={styles.statLabel}>Meses</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>R$ 45.670</span>
                    <span className={styles.statLabel}>Patrimônio</span>
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
                onClick={handleEditToggle}
              >
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
                      <div className={styles.infoValue}>{userData.name}</div>
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
                      <div className={styles.infoValue}>{userData.email}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>Telefone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{userData.phone}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>Localização</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{userData.location}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>Data de Nascimento</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{userData.birthDate}</div>
                    )}
                  </div>

                  <div className={styles.infoGroup}>
                    <label>CPF</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{userData.cpf}</div>
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