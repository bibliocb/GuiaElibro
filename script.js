// Inicializar Iconos
lucide.createIcons();

function switchTab(tabId) {
    // IDs de las secciones
    const sections = ['inicio', 'colecciones', 'tutoriales', 'guia'];
    
    // 1. Ocultar TODAS las secciones
    sections.forEach(id => {
        const el = document.getElementById('section-' + id);
        if (el) {
            el.classList.add('hidden-section');
            el.classList.remove('fade-in-up'); // Reset animation
        }
    });

    // 2. Mostrar SOLO la seleccionada con animación
    const selected = document.getElementById('section-' + tabId);
    if (selected) {
        selected.classList.remove('hidden-section');
        // Trigger reflow para reiniciar animación css
        void selected.offsetWidth; 
        selected.classList.add('fade-in-up');
    }

    // 3. Gestionar estado activo de botones
    sections.forEach(id => {
       // Desktop
       const btnD = document.getElementById('btn-desktop-' + id);
       if(btnD) {
           if(id === tabId) {
               btnD.classList.add('nav-active-desktop');
           } else {
               btnD.classList.remove('nav-active-desktop');
           }
       }
       
       // Mobile
       const btnM = document.getElementById('btn-mobile-' + id);
       if(btnM) {
           if(id === tabId) {
               btnM.classList.add('nav-active-mobile');
               btnM.classList.remove('text-orange-100'); // Quitamos color inactivo
           } else {
               btnM.classList.remove('nav-active-mobile');
               btnM.classList.add('text-orange-100'); // Ponemos color inactivo
           }
       }
    });
    
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- LÓGICA DEL CHATBOT ---

// Base de conocimiento simple
const knowledgeBase = [
    { 
        keywords: ['hola', 'buenos dias', 'buenas'], 
        response: "¡Hola! ¿En qué puedo ayudarte hoy sobre la biblioteca?" 
    },
    { 
        keywords: ['horario', 'hora', 'abierto', 'atienden'], 
        response: "🕒 <b>Horarios Sede Cochabamba:</b><br>• Lun-Vie: 08:00 - 20:00<br>• Sábados: 08:00 - 12:00" 
    },
    { 
        keywords: ['entrar', 'acceso', 'ingresar', 'login', 'usuario', 'contraseña', 'clave', 'cuenta'], 
        response: "🔑 <b>Credenciales de Acceso:</b><br>1. Entra a <a href='https://bibliovirtual.unifranz.edu.bo/' target='_blank' class='text-orange-600 underline'>bibliovirtual.unifranz.edu.bo</a><br>2. Usuario: Tu correo institucional (ej: Cbba.juan@unifranz.edu.bo)<br>3. Contraseña: Nº Carnet + CBB (ej: 123456CBB)" 
    },
    { 
        keywords: ['requisito', 'prestamo', 'prestar', 'sacar libro', 'llevar libro'], 
        response: "📚 <b>Requisitos de Préstamo:</b><br>⚠ Requiere reserva previa en sistema.<br>• <b>Domicilio:</b> Dejar C.I. o Pasaporte vigente.<br>• <b>Sala:</b> Credencial o C.I." 
    },
    { 
        keywords: ['research4life', 'hinari', 'agora', 'oare', 'ardi', 'goali'], 
        response: "🌍 <b>Research4Life</b> ofrece acceso a 5 programas:<br>• Hinari (Salud)<br>• AGORA (Agricultura)<br>• OARE (Ambiente)<br>• ARDI (Innovación)<br>• GOALI (Justicia)<br><a href='https://portal.research4life.org/' target='_blank' class='text-orange-600 underline'>Ir al portal</a>" 
    },
    { 
        keywords: ['contacto', 'ayuda', 'telegram', 'soporte'], 
        response: "💬 Puedes unirte a nuestro canal oficial de Telegram para soporte inmediato: <a href='https://t.me/+UMBSce1zVjhZGtEz' target='_blank' class='text-orange-600 underline font-bold'>Clic aquí para unirte</a>" 
    },
    {
        keywords: ['direccion', 'ubicacion', 'donde queda'],
        response: "📍 Estamos ubicados en la Sede Cochabamba. Puedes encontrar la biblioteca dentro del campus universitario."
    }
];

function toggleChat() {
    const chatBox = document.getElementById('chat-box');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    
    if (chatBox.classList.contains('hidden')) {
        chatBox.classList.remove('hidden');
        chatBox.classList.add('flex');
        toggleBtn.classList.add('scale-0'); // Ocultar botón flotante
    } else {
        chatBox.classList.add('hidden');
        chatBox.classList.remove('flex');
        toggleBtn.classList.remove('scale-0'); // Mostrar botón flotante
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();
    
    if (messageText === "") return;

    // 1. Añadir mensaje del usuario
    addMessage(messageText, 'user');
    input.value = '';

    // 2. Simular "escribiendo..."
    showTypingIndicator();

    // 3. Procesar respuesta (con delay para realismo)
    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(messageText);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', `chat-${sender}`, 'shadow-sm', 'fade-in-up');
    msgDiv.innerHTML = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('chat-message', 'chat-bot', 'typing-indicator', 'shadow-sm');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
}

function getBotResponse(input) {
    const normalizedInput = input.toLowerCase();
    
    // Buscar coincidencia en base de conocimientos
    for (const item of knowledgeBase) {
        if (item.keywords.some(keyword => normalizedInput.includes(keyword))) {
            return item.response;
        }
    }
    
    // Respuesta por defecto
    return "🤔 No estoy seguro de entender tu pregunta. Intenta preguntar sobre:<br>• Horarios<br>• Cómo ingresar<br>• Requisitos<br>• Research4Life<br>• Contacto";
}