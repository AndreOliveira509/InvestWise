import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import styles from './AboutUs.module.css';

// Dados dos membros da equipe
const teamMembers = [
  {
    name: 'André Luis',
    role: 'Desenvolvedor Full-Stack',
    imageUrl: 'https://avatars.githubusercontent.com/u/131814071?v=4', 
    linkedin: 'https://www.linkedin.com/in/andreoliveira509/',
    github: 'https://github.com/AndreOliveira509'
  },
  {
    name: 'Isaac Amorim',
    role: 'Desenvolvedor Full-Stack',
    imageUrl: 'https://avatars.githubusercontent.com/u/163526904?v=4',
    linkedin: 'https://www.linkedin.com/in/isaacamorim/',
    github: 'https://github.com/isaacamorimm'
  },
  {
    name: 'Ryan Santos',
    role: 'Desenvolvedor Back-End',
    imageUrl: 'https://avatars.githubusercontent.com/u/166428589?v=4',
    linkedin: '#',
    github: 'https://github.com/ryanfidelis'
  },
  {
    name: 'Enrico Hidalgo',
    role: 'Desenvolvedor Full-Stack',
    imageUrl: 'https://avatars.githubusercontent.com/u/143716820?v=4',
    linkedin: 'https://www.linkedin.com/in/enricohidalgo/',
    github: 'https://github.com/EnricoHidalgo'
  },
  {
    name: 'Guilherme Caetano',
    role: 'Prompt Manager',
    imageUrl: 'https://avatars.githubusercontent.com/u/131812809?v=4',
    linkedin: '#',
    github: 'https://github.com/guilhermecaetanosouza'
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navega para a página anterior no histórico
  };

  return (
    <div className={styles.aboutUsPage}>
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
