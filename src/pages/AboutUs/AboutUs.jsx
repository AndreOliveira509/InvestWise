// pages/AboutUs/AboutUs.jsx
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import styles from './AboutUs.module.css';

// Dados dos membros da equipe (você pode substituir com os dados reais)
const teamMembers = [
  {
    name: 'Nome do Membro 1',
    role: 'Desenvolvedor Full-Stack',
    imageUrl: 'https://via.placeholder.com/150', // Substitua pela URL da imagem
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Nome do Membro 2',
    role: 'Designer UX/UI',
    imageUrl: 'https://via.placeholder.com/150',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Nome do Membro 3',
    role: 'Engenheiro de Software',
    imageUrl: 'https://via.placeholder.com/150',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Nome do Membro 4',
    role: 'Gerente de Projetos',
    imageUrl: 'https://via.placeholder.com/150',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Nome do Membro 5',
    role: 'Analista de QA',
    imageUrl: 'https://via.placeholder.com/150',
    linkedin: '#',
    github: '#'
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navega para a página anterior no histórico
  };

  return (
    <div className={styles.aboutUsPage}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Conheça a Nossa Equipe</h1>
          <p className={styles.subtitle}>
            Somos apaixonados por tecnologia e finanças, dedicados a criar a melhor experiência para você.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <div className={styles.memberImageContainer}>
                <img src={member.imageUrl} alt={member.name} className={styles.memberImage} />
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <div className={styles.memberSocials}>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaLinkedin />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <FaGithub />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.backButtonContainer}>
          <button onClick={handleGoBack} className={styles.backButton}>
            <FaArrowLeft />
            <span>Voltar</span>
          </button>
        </div>
      </main>
    </div>
  );
}