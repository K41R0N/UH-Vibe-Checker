const https = require('https');

function makeRequest(url, options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ ok: true, json: () => Promise.resolve(JSON.parse(data)) });
                } else {
                    resolve({ ok: false, status: res.statusCode, text: () => Promise.resolve(data) });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { residuo } = JSON.parse(event.body);
        
        if (!process.env.HF_API_KEY) {
            throw new Error('API key not configured');
        }

        const requestBody = JSON.stringify({
            inputs: `<s>[INST] Eres un experto que ayuda a clasificar residuos según el sistema colombiano. SIEMPRE responde en español.
            
            Clasifica este residuo: "${residuo}"

            REGLAS ESTRICTAS DE CLASIFICACIÓN COLOMBIANA:

            VERDE = COMPOST/ORGÁNICOS (si cumple CUALQUIERA de estas):
            - Es resto de comida o alimento
            - Es cáscara de fruta o verdura
            - Es hoja, rama o flor
            - Es orgánico y se pudre
            - Es residuo de café o té
            - Es servilleta usada con comida

            BLANCO = RECICLAJE (debe cumplir TODAS estas):
            - Está completamente limpio y seco
            - Es plástico, vidrio, papel, cartón o metal
            - No tiene restos de comida
            - No está contaminado
            - Se puede procesar de nuevo

            NEGRO = BASURA (si cumple CUALQUIERA de estas):
            - Está sucio o contaminado
            - Tiene restos de comida
            - Es un producto higiénico
            - No es reciclable ni orgánico
            - No estás seguro de su limpieza

            IMPORTANTE:
            - Si se pudre = VERDE (compost)
            - Si está sucio = NEGRO (basura)
            - Si está limpio y es reciclable = BLANCO
            
            Responde EXACTAMENTE así:
            1. Solo el color en MAYÚSCULAS
            2. Una explicación de 2-3 frases cortas (máximo 280 caracteres). Incluye el tipo de residuo y una recomendación o dato importante.
            [/INST]</s>`,
            parameters: {
                max_new_tokens: 150,
                temperature: 0.1,
                top_p: 0.9,
                return_full_text: false
            }
        });

        const response = await makeRequest(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            },
            requestBody
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API error:', errorText);
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Error al clasificar el residuo',
                details: error.message 
            })
        };
    }
}; 