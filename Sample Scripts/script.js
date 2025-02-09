// Temporary classification function - will be replaced with LLM logic
async function clasificarResiduo() {
    const input = document.getElementById('residuo').value.toLowerCase();
    if (!input.trim()) {
        mostrarError('Por favor ingresa un residuo para clasificar');
        return;
    }

    const resultadoDiv = document.getElementById('resultado');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');

    // Show loading state
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        const clasificacion = await obtenerClasificacion(input);
        actualizarUI(clasificacion);
    } catch (error) {
        mostrarError('Hubo un error al clasificar el residuo. Por favor intenta de nuevo.');
        console.error('Error:', error);
    } finally {
        // Hide loading state
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

async function obtenerClasificacion(residuo) {
    const response = await fetch('/.netlify/functions/classify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ residuo })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.details || 'Error en la llamada al servidor');
    }

    const data = await response.json();
    return interpretarRespuesta(data);
}

function interpretarRespuesta(data) {
    console.log('Raw response:', data);
    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
        console.error('Unexpected response format:', data);
        throw new Error('Formato de respuesta inesperado');
    }
    
    const respuesta = data[0].generated_text;
    const lines = respuesta.split('\n').map(line => line.trim()).filter(line => line);
    
    // First line should contain the color
    const colorLine = lines[0].toLowerCase();
    let color = 'desconocido';
    
    // Update color mapping
    if (colorLine.includes('blanco')) color = 'blanco';  // Reciclaje
    if (colorLine.includes('negro')) color = 'negro';    // Basura
    if (colorLine.includes('verde')) color = 'verde';    // Orgánicos
    
    // Update inference logic
    if (color === 'desconocido' && lines.length > 1) {
        const explanation = lines.slice(1).join(' ').toLowerCase();
        if (explanation.includes('reciclable') || explanation.includes('reciclaje')) color = 'blanco';
        if (explanation.includes('compost') || explanation.includes('orgánico')) color = 'verde';
        if (explanation.includes('basura') || explanation.includes('no reciclable')) color = 'negro';
    }
    
    // Get explanation from remaining lines
    const explanation = lines.slice(1).join(' ').trim();
    
    return {
        color,
        explanation
    };
}

function actualizarUI({ color, explanation }) {
    const welcomeText = document.querySelector('.welcome-text');
    const resultadoDiv = document.getElementById('resultado');
    
    // Fade out welcome text and fade in results
    welcomeText.style.opacity = '0';
    welcomeText.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        welcomeText.style.display = 'none';
        resultadoDiv.style.display = 'block';
        // Force a reflow
        resultadoDiv.offsetHeight;
        resultadoDiv.style.opacity = '1';
        resultadoDiv.style.transform = 'translateY(0)';
    }, 300);
    
    const containerIcon = document.getElementById('container-icon');
    const containerText = document.getElementById('container-text');
    const explanationText = document.getElementById('explanation-text');
    const resultIcon = containerIcon.querySelector('.result-icon');
    
    switch(color) {
        case 'blanco':
            containerIcon.style.backgroundColor = '#f5f5f5';
            containerText.textContent = '¡Va en el contenedor BLANCO! 🔄';
            resultIcon.className = 'fas fa-recycle result-icon';
            break;
        case 'verde':
            containerIcon.style.backgroundColor = '#27ae60';
            containerText.textContent = '¡Va en el contenedor VERDE! 🌱';
            resultIcon.className = 'fas fa-seedling result-icon';
            break;
        case 'negro':
            containerIcon.style.backgroundColor = '#2c3e50';
            containerText.textContent = '¡Va en el contenedor NEGRO! 🗑️';
            resultIcon.className = 'fas fa-trash result-icon';
            break;
        default:
            containerIcon.style.backgroundColor = '#e74c3c';
            containerText.textContent = '¡Ups! Intenta ser más específico 🤔';
            resultIcon.className = 'fas fa-question result-icon';
    }
    
    // Clean up explanation text: remove numbers, dots, and emojis at the start
    const cleanExplanation = explanation
        .replace(/^\d+\.\s*/, '') // Remove leading numbers and dots
        .replace(/^[💡\s]+/, '') // Remove leading emojis and spaces
        .trim();
    
    explanationText.textContent = cleanExplanation;
}

function mostrarError(mensaje) {
    const welcomeText = document.querySelector('.welcome-text');
    const resultadoDiv = document.getElementById('resultado');
    
    // Fade out welcome text
    welcomeText.style.opacity = '0';
    welcomeText.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        welcomeText.style.display = 'none';
        resultadoDiv.style.display = 'block';
        // Force a reflow
        resultadoDiv.offsetHeight;
        resultadoDiv.style.opacity = '1';
        resultadoDiv.style.transform = 'translateY(0)';
        
        const containerIcon = document.getElementById('container-icon');
        const containerText = document.getElementById('container-text');
        containerIcon.style.backgroundColor = '#e74c3c';
        containerText.textContent = mensaje;
    }, 300);
}

// Add event listener when the document loads
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', clasificarResiduo);
}); 