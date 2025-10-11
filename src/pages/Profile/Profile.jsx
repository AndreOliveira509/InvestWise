// src/pages/Profile/Profile.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBirthdayCake,
  FaEdit,
  FaSave,
  FaTimes,
  FaBars,
  FaShieldAlt,
  FaBell,
  FaPalette,
  FaSignOutAlt,
  FaCamera
} from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Dados do usuário
  const [userData, setUserData] = useState({
    personal: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      location: 'São Paulo, SP',
      birthDate: '15/03/1990',
      cpf: '123.456.789-00'
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      darkMode: false,
      currency: 'BRL',
      language: 'pt-BR'
    },
    security: {
      twoFactor: false,
      lastLogin: '2024-01-15 14:30',
      loginAttempts: 0
    }
  });

  const [formData, setFormData] = useState(userData.personal);

  const handleEditToggle = () => {
    if (isEditing) {
      // Salvar alterações
      setUserData(prev => ({
        ...prev,
        personal: formData
      }));
    } else {
      // Entrar no modo edição
      setFormData(userData.personal);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData(userData.personal);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: <FaUser /> },
    { id: 'preferences', label: 'Preferências', icon: <FaPalette /> },
    { id: 'security', label: 'Segurança', icon: <FaShieldAlt /> }
  ];

  return (
    <div className={styles.profile}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className={`${styles.mainContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarContent}>
            <button 
              className={styles.menuButton}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FaBars />
            </button>
            <div className={styles.userActions}>
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className={styles.main}>
          <div className={styles.container}>
            
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
                  <h1 className={styles.userName}>{userData.personal.name}</h1>
                  <p className={styles.userEmail}>{userData.personal.email}</p>
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
                    <FaTimes />
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
              
              {/* Informações Pessoais */}
              {activeTab === 'personal' && (
                <div className={styles.personalInfo}>
                  <h2>Informações Pessoais</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoGroup}>
                      <label>
                        <FaUser className={styles.inputIcon} />
                        Nome Completo
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.name}</div>
                      )}
                    </div>

                    <div className={styles.infoGroup}>
                      <label>
                        <FaEnvelope className={styles.inputIcon} />
                        E-mail
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.email}</div>
                      )}
                    </div>

                    <div className={styles.infoGroup}>
                      <label>
                        <FaPhone className={styles.inputIcon} />
                        Telefone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.phone}</div>
                      )}
                    </div>

                    <div className={styles.infoGroup}>
                      <label>
                        <FaMapMarkerAlt className={styles.inputIcon} />
                        Localização
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.location}</div>
                      )}
                    </div>

                    <div className={styles.infoGroup}>
                      <label>
                        <FaBirthdayCake className={styles.inputIcon} />
                        Data de Nascimento
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.birthDate}</div>
                      )}
                    </div>

                    <div className={styles.infoGroup}>
                      <label>
                        <MdAccountBalanceWallet className={styles.inputIcon} />
                        CPF
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <div className={styles.infoValue}>{userData.personal.cpf}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferências */}
              {activeTab === 'preferences' && (
                <div className={styles.preferences}>
                  <h2>Preferências</h2>
                  <div className={styles.preferencesGrid}>
                    
                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <FaBell className={styles.preferenceIcon} />
                        <div>
                          <h4>Notificações</h4>
                          <p>Receber notificações do sistema</p>
                        </div>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={userData.preferences.notifications}
                          onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <FaEnvelope className={styles.preferenceIcon} />
                        <div>
                          <h4>Atualizações por E-mail</h4>
                          <p>Receber novidades e dicas por e-mail</p>
                        </div>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={userData.preferences.emailUpdates}
                          onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <FaPalette className={styles.preferenceIcon} />
                        <div>
                          <h4>Modo Escuro</h4>
                          <p>Interface em tema escuro</p>
                        </div>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={userData.preferences.darkMode}
                          onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <MdAccountBalanceWallet className={styles.preferenceIcon} />
                        <div>
                          <h4>Moeda Padrão</h4>
                          <p>Selecione sua moeda preferida</p>
                        </div>
                      </div>
                      <select 
                        className={styles.select}
                        value={userData.preferences.currency}
                        onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                      >
                        <option value="BRL">Real (R$)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <FaUser className={styles.preferenceIcon} />
                        <div>
                          <h4>Idioma</h4>
                          <p>Idioma da interface</p>
                        </div>
                      </div>
                      <select 
                        className={styles.select}
                        value={userData.preferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      >
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}

              {/* Segurança */}
              {activeTab === 'security' && (
                <div className={styles.security}>
                  <h2>Segurança da Conta</h2>
                  <div className={styles.securityGrid}>
                    
                    <div className={styles.securityItem}>
                      <div className={styles.securityInfo}>
                        <FaShieldAlt className={styles.securityIcon} />
                        <div>
                          <h4>Autenticação de Dois Fatores</h4>
                          <p>Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={userData.security.twoFactor}
                          onChange={(e) => setUserData(prev => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              twoFactor: e.target.checked
                            }
                          }))}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.securityCard}>
                      <h4>Atividade Recente</h4>
                      <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                          <div className={styles.activityDetails}>
                            <strong>Login realizado</strong>
                            <span>Dispositivo conhecido • {userData.security.lastLogin}</span>
                          </div>
                          <div className={styles.activityStatus}>
                            <span className={styles.statusSuccess}>Bem-sucedido</span>
                          </div>
                        </div>
                        <div className={styles.activityItem}>
                          <div className={styles.activityDetails}>
                            <strong>Tentativas de login</strong>
                            <span>Últimos 30 dias</span>
                          </div>
                          <div className={styles.activityStatus}>
                            <span className={styles.statusNeutral}>
                              {userData.security.loginAttempts} tentativas
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.securityCard}>
                      <h4>Ações de Segurança</h4>
                      <div className={styles.securityActions}>
                        <button className={styles.securityButton}>
                          Alterar Senha
                        </button>
                        <button className={styles.securityButton}>
                          Revogar Sessões
                        </button>
                        <button className={styles.securityButton}>
                          Exportar Dados
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;