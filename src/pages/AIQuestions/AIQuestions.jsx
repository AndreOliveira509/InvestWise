// AIQuestions.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaDownload,
  FaVolumeUp,
  FaVolumeMute,
  FaMicrophone,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileAlt
} from "react-icons/fa";
import styles from "./AIQuestions.module.css";
import Header from '../../components/Header/Header';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const GEMINI_API_KEY = "AIzaSyAllQYJ1cbB7Q6eZTIfgD1Mc7MRxOITF-Q";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AIQuestions = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const [userFinancialData] = useState({
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    savings: 15000,
    debts: 5000,
    financialGoals: 'Comprar um apartamento'
  });

  const [pendingChartRequest, setPendingChartRequest] = useState(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatHistory');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    } else {
      const initialMessages = [
        { id: 1, text: "Olá! Sou sua assistente inteligente. 🤖", sender: 'ai', timestamp: new Date() },
        { id: 2, text: "Posso ajudar com dúvidas financeiras, gerar PDFs, imagens, planilhas e muito mais.", sender: 'ai', timestamp: new Date() },
        { id: 3, text: "Peça 'Gerar imagem de gráfico' ou 'Gere um PDF' para testar.", sender: 'ai', timestamp: new Date() }
      ];
      setMessages(initialMessages);
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }

    speechSynthesisRef.current = window.speechSynthesis;

    return () => {
      if (speechSynthesisRef.current) speechSynthesisRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('aiChatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    applyDarkModeStyles(darkMode);
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyDarkModeStyles(newDarkMode);
  };

  const applyDarkModeStyles = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--bg-card', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    } else {
      root.style.setProperty('--bg-primary', '#f4f6fa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  };

  const detectFileRequest = (userMessage) => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('pdf') || lower.includes('documento pdf') || (lower.includes('gerar pdf') || lower.includes('crie um pdf'))) {
      return { type: 'pdf', detected: true };
    }
    if (lower.includes('imagem') || lower.includes('gráfico') || lower.includes('grafico') || lower.includes('chart') || lower.includes('png') || lower.includes('jpg')) {
      return { type: 'image', detected: true };
    }
    if (lower.includes('word') || lower.includes('doc') || lower.includes('docx')) {
      return { type: 'doc', detected: true };
    }
    if (lower.includes('excel') || lower.includes('planilha') || lower.includes('xlsx') || lower.includes('xls')) {
      return { type: 'xlsx', detected: true };
    }
    if (lower.includes('txt') || lower.includes('texto')) {
      return { type: 'txt', detected: true };
    }
    return { type: null, detected: false };
  };

  const callGeminiForFiles = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fileRequest = detectFileRequest(userMessage);
      let prompt = '';

      if (fileRequest.detected) {
        if (fileRequest.type === 'image') {
          prompt = `
Usuário solicitou geração de um gráfico/imagem.
Pedido do usuário: "${userMessage}"

TAREFA:
- Se o usuário quer um gráfico, gere dados estruturados que possam ser usados para o gráfico em formato JSON.
- Inclua: "labels": [...], "values": [...], "title": "Título do gráfico", "description": "Breve descrição"
- Se não for possível obter dados específicos, gere um resumo textual curto explicando o que o gráfico deve mostrar.

RETORNE APENAS O CONTEÚDO (JSON se possível ou texto simples).
`;
        } else {
          prompt = `
O usuário pediu que seja gerado um arquivo do tipo ${fileRequest.type.toUpperCase()}.
Pedido: "${userMessage}"

GERE APENAS O CONTEÚDO QUE DEVE IR NO ARQUIVO.
Use estes dados de contexto se necessário:
Renda mensal: R$ ${userFinancialData.monthlyIncome}
Despesas: R$ ${userFinancialData.monthlyExpenses}
Economias: R$ ${userFinancialData.savings}
Dívidas: R$ ${userFinancialData.debts}
Meta: ${userFinancialData.financialGoals}
`;
        }
      } else {
        prompt = `
Responda de forma útil e clara ao usuário:
"${userMessage}"

Dados contextuais (use se necessário):
Renda mensal: R$ ${userFinancialData.monthlyIncome}
Despesas mensais: R$ ${userFinancialData.monthlyExpenses}
Economias: R$ ${userFinancialData.savings}
Dívidas: R$ ${userFinancialData.debts}
`;
      }

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      if (fileRequest.detected && fileRequest.type === 'image') {
        try {
          const jsonStart = responseText.indexOf('{');
          if (jsonStart !== -1) {
            const possibleJson = responseText.slice(jsonStart);
            const parsed = JSON.parse(possibleJson);
            return { text: parsed, fileRequest: 'image' };
          }
        } catch (err) {
          return { text: responseText, fileRequest: 'image' };
        }
      }

      return { text: responseText, fileRequest: fileRequest.detected ? fileRequest.type : null };
    } catch (error) {
      console.error('Erro Gemini:', error);
      return { text: "🤖 Ocorreu um erro ao gerar o conteúdo. Tente novamente.", fileRequest: null };
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    if (!inputMessage.trim()) return;

    if (pendingChartRequest) {
      const chartTypeInput = inputMessage.trim().toLowerCase();
      setInputMessage('');
      setIsLoading(true);

      const userConfirmMessage = {
        id: Date.now(),
        text: `Gerando gráfico do tipo "${chartTypeInput}"...`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userConfirmMessage]);

      let dataObj = null;
      if (typeof pendingChartRequest.aiContent === 'object' && pendingChartRequest.aiContent.labels && pendingChartRequest.aiContent.values) {
        dataObj = pendingChartRequest.aiContent;
      } else {
        dataObj = {
          title: 'Resumo Financeiro',
          labels: ['Renda', 'Despesas', 'Economias', 'Dívidas'],
          values: [
            userFinancialData.monthlyIncome,
            userFinancialData.monthlyExpenses,
            userFinancialData.savings,
            userFinancialData.debts
          ],
          description: 'Distribuição das principais categorias financeiras'
        };
      }

      try {
        const blob = await createChartImage(chartTypeInput, dataObj, darkMode);
        const aiMessage = {
          id: Date.now() + 1,
          text: `✅ Gráfico (${chartTypeInput}) gerado com sucesso!`,
          sender: 'ai',
          timestamp: new Date(),
          fileData: {
            type: 'image',
            content: blob,
            userRequest: pendingChartRequest.userRequest,
            chartType: chartTypeInput,
            filename: `grafico-${Date.now()}`
          }
        };
        setMessages(prev => [...prev, aiMessage]);
        
      } catch (err) {
        console.error('Erro criando gráfico:', err);
        const aiMessage = {
          id: Date.now() + 2,
          text: '❌ Falha ao gerar o gráfico. Tente outro tipo ou peça novamente.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } finally {
        setPendingChartRequest(null);
        setIsLoading(false);
      }

      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const response = await callGeminiForFiles(userMessage.text);

    if (response.fileRequest === 'image') {
      const descText = (typeof response.text === 'string')
        ? `Detectei que você quer uma imagem/gráfico. Descrição: ${response.text}`
        : `Detectei que você quer uma imagem/gráfico. Dados prontos para gráfico recebidos.`;

      const aiMessage = {
        id: Date.now() + 1,
        text: descText + '\n\nQual tipo de gráfico você quer? (barras / pizza / linha)',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      setPendingChartRequest({
        messageId: aiMessage.id,
        aiContent: response.text,
        userRequest: userMessage.text
      });

      setIsLoading(false);
      return;
    }

    const aiMessage = {
      id: Date.now() + 1,
      text: response.fileRequest ? `Conteúdo para ${response.fileRequest.toUpperCase()} gerado com sucesso! Use o botão para baixar.` : response.text,
      sender: 'ai',
      timestamp: new Date()
    };

    if (response.fileRequest) {
      aiMessage.fileData = {
        type: response.fileRequest,
        content: response.text,
        userRequest: userMessage.text,
        filename: `relatorio-${Date.now()}`
      };
    } else {
      aiMessage.text = response.text;
    }

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const createChartImage = (chartType, dataObj, isDark) => {
    return new Promise((resolve, reject) => {
      try {
        let canvas = hiddenCanvasRef.current;
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 800;
          hiddenCanvasRef.current = canvas;
        }

        if (canvas._chartInstance) {
          canvas._chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.fillStyle = isDark ? '#0f1720' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const labels = dataObj.labels || [];
        const values = dataObj.values || [];
        const title = dataObj.title || 'Gráfico';
        const description = dataObj.description || '';

        const commonOptions = {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: title,
              color: isDark ? '#ffffff' : '#1f2937',
              font: { size: 24, weight: '700' }
            },
            legend: {
              display: chartType !== 'bar',
              labels: {
                color: isDark ? '#e5e7eb' : '#374151'
              }
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            x: {
              ticks: { color: isDark ? '#e5e7eb' : '#374151' },
              grid: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)' }
            },
            y: {
              ticks: { color: isDark ? '#e5e7eb' : '#374151' },
              grid: { color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)' }
            }
          }
        };

        let chartConfig = null;

        if (chartType.includes('bar')) {
          chartConfig = {
            type: 'bar',
            data: {
              labels,
              datasets: [{
                label: 'Valores',
                data: values,
                backgroundColor: labels.map(() => isDark ? 'rgba(99,102,241,0.9)' : 'rgba(59,130,246,0.9)'),
                borderColor: labels.map(() => isDark ? 'rgba(99,102,241,1)' : 'rgba(59,130,246,1)'),
                borderWidth: 1
              }]
            },
            options: commonOptions
          };
        } else if (chartType.includes('pie') || chartType.includes('pizza')) {
          chartConfig = {
            type: 'pie',
            data: {
              labels,
              datasets: [{
                label: 'Distribuição',
                data: values,
                backgroundColor: labels.map((_, i) => {
                  const palette = [
                    '#60a5fa', '#f97316', '#34d399', '#f472b6', '#facc15', '#a78bfa', '#fb7185'
                  ];
                  return palette[i % palette.length];
                })
              }]
            },
            options: commonOptions
          };
        } else {
          chartConfig = {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Série',
                data: values,
                fill: false,
                tension: 0.3,
                borderWidth: 2,
                borderColor: isDark ? '#60a5fa' : '#2563eb',
                pointBackgroundColor: isDark ? '#93c5fd' : '#bfdbfe'
              }]
            },
            options: commonOptions
          };
        }

        const chartInstance = new Chart(ctx, chartConfig);
        canvas._chartInstance = chartInstance;

        setTimeout(() => {
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Falha ao criar blob do gráfico.'));
            resolve(blob);
          }, 'image/png', 1);
        }, 300);
      } catch (err) {
        reject(err);
      }
    });
  };

  const downloadBlob = (blob, filename, mime) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Erro ao fazer download do arquivo.');
    }
  };

  const generatePDF = (content, filename = 'relatorio', userRequest = '') => {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4'
      });

      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Relatório Gerado pela Assistente IA', 40, 60);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Solicitação: ${userRequest}`, 40, 85);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 40, 100);

      doc.setDrawColor(220);
      doc.line(40, 110, 555, 110);

      doc.setFontSize(12);
      doc.setTextColor(20);
      const lines = doc.splitTextToSize(typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content), 515);
      let y = 130;
      lines.forEach(line => {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, 40, y);
        y += 14;
      });

      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text('Gerado por Assistente IA - confidencial', 40, 780);

      doc.save(`${filename}.pdf`);
    } catch (err) {
      console.error('Erro jsPDF:', err);
      alert('Erro ao gerar PDF. Veja o console.');
    }
  };

  const generateTXT = (content, filename = 'relatorio', userRequest = '') => {
    try {
      const header = `RELATÓRIO\nSolicitação: ${userRequest}\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
      const body = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
      const blob = new Blob([header + body + '\n\nGerado por Assistente IA'], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, `${filename}.txt`, 'text/plain');
    } catch (err) {
      console.error('Erro gerar TXT:', err);
      alert('Erro ao gerar TXT.');
    }
  };

  const generateDOC = (content, filename = 'relatorio', userRequest = '') => {
    try {
      const header = `Relatório Gerado pela Assistente IA\n\nSolicitação: ${userRequest}\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
      const body = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
      const fullContent = header + body + '\n\nGerado por Assistente IA';
      const blob = new Blob([fullContent], { type: 'application/msword' });
      downloadBlob(blob, `${filename}.doc`, 'application/msword');
    } catch (err) {
      console.error('Erro DOC:', err);
      alert('Erro ao gerar DOC.');
    }
  };

  const generateXLSX = (content, filename = 'planilha', userRequest = '') => {
    try {
      let wsData = [];
      
      if (typeof content === 'object' && content.labels && content.values) {
        wsData.push(['Categoria', 'Valor']);
        for (let i = 0; i < content.labels.length; i++) {
          wsData.push([content.labels[i], content.values[i]]);
        }
      } else if (Array.isArray(content)) {
        wsData = content;
      } else {
        wsData = [
          ['Relatório Gerado pela Assistente IA'],
          ['Solicitação:', userRequest],
          ['Gerado em:', new Date().toLocaleString('pt-BR')],
          [''],
          ['Conteúdo:'],
          [typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content)]
        ];
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (err) {
      console.error('Erro XLSX:', err);
      alert('Erro ao gerar planilha Excel.');
    }
  };

  const handleDownload = (message) => {
    console.log('Download clicked:', message.fileData);
    
    if (message.fileData) {
      const { type, content, userRequest, filename } = message.fileData;

      switch (type) {
        case 'pdf':
          generatePDF(content, filename, userRequest);
          break;
        case 'txt':
          generateTXT(content, filename, userRequest);
          break;
        case 'doc':
          generateDOC(content, filename, userRequest);
          break;
        case 'xlsx':
          generateXLSX(content, filename, userRequest);
          break;
        case 'image':
          if (content instanceof Blob) {
            downloadBlob(content, `${filename}.png`, 'image/png');
          } else {
            console.error('Conteúdo da imagem não é um Blob válido:', content);
            alert('Erro: Conteúdo da imagem inválido.');
          }
          break;
        default:
          generateTXT(content, filename, userRequest);
      }
    } else {
      generateTXT(message.text, `conversa-${Date.now()}`, 'Conversa IA');
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FaFilePdf />;
      case 'image': return <FaFileImage />;
      case 'doc': return <FaFileWord />;
      case 'txt': return <FaFileAlt />;
      case 'xlsx': return <FaFileAlt />;
      default: return <FaDownload />;
    }
  };

  const speakText = (text) => {
    if (!speechSynthesisRef.current) return;

    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const quickSuggestions = [
    "Gere um PDF com análise financeira",
    "Crie uma imagem com resumo das finanças",
    "Exporte meus dados para Word",
    "Baixe um relatório em texto",
    "Como posso economizar mais?",
    "Dicas para quitar dívidas"
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <div className={styles.aiQuestions}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.aiHeader}>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>
                  <FaRobot className={styles.titleIcon} />
                  Assistente IA
                </h1>
                <p className={styles.subtitle}>Consultoria inteligente com Gemini 2.5</p>
              </div>
            </div>
          </section>

          <div className={styles.chatWrapper}>
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
                >
                  <div className={styles.messageAvatar}>
                    {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>
                      {String(message.text).split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                      {message.fileData && (
                        <div className={styles.fileReady}>
                          <div className={styles.fileInfo}>
                            {getFileIcon(message.fileData.type)}
                            <span>Arquivo {message.fileData.type.toUpperCase()} pronto para download</span>
                          </div>
                          <button
                            className={styles.downloadFileButton}
                            onClick={() => handleDownload(message)}
                          >
                            <FaDownload /> Baixar {message.fileData.type.toUpperCase()}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={styles.messageActions}>
                      <div className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {message.sender === 'ai' && (
                        <div className={styles.actionButtons}>
                          <button
                            className={`${styles.actionButton} ${isSpeaking ? styles.speaking : ''}`}
                            onClick={() => speakText(message.text)}
                            title={isSpeaking ? "Parar áudio" : "Ouvir resposta"}
                          >
                            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className={styles.message}>
                  <div className={styles.messageAvatar}>
                    <FaRobot />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className={styles.quickSuggestions}>
              <div className={styles.suggestionsGrid}>
                {quickSuggestions.map((sugg, idx) => (
                  <button key={idx} className={styles.suggestionChip} onClick={() => handleQuickSuggestion(sugg)}>
                    {sugg}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <button
                  type="button"
                  className={`${styles.voiceButton} ${isRecording ? styles.recording : ''}`}
                  onClick={startRecording}
                  disabled={isRecording}
                >
                  <FaMicrophone />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua pergunta ou peça para gerar arquivos (PDF, imagem, Word, Excel...)"
                  className={styles.messageInput}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className={styles.sendButton}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIQuestions;