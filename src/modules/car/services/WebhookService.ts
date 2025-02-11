import axios from 'axios';

export const sendWebhook = async (url: string, data: any) => {
    try {
        await axios.post(url, data);
    } catch (error) {
        console.error('Erro ao enviar webhook:', error);
        throw error;
    }
};