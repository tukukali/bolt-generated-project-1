
    import React, { useState } from 'react';
    import axios from 'axios';

    const NotesPage = ({ onLogout }) => {
      const [note, setNote] = useState('');
      const [template, setTemplate] = useState('default');

      const handleRecord = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

          const formData = new FormData();
          formData.append('audio', audioFile);

          const response = await axios.post('https://api.assemblyai.com/v2/transcript', formData, {
            headers: {
              'Authorization': 'Bearer YOUR_ASSEMBLYAI_API_KEY',
              'Content-Type': 'multipart/form-data'
            }
          });

          const transcript = response.data.text;
          const formattedNote = await formatNoteWithLLM(transcript, template);
          setNote(formattedNote);
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);
      };

      const formatNoteWithLLM = async (text, template) => {
        const response = await axios.post('https://your-llm-api-endpoint', { text, template });
        return response.data.formattedText;
      };

      const handleSave = async () => {
        const authToken = localStorage.getItem('authToken');
        await axios.post('https://your-supabase-url/rest/v1/notes', { note }, {
          headers: {
            'apikey': 'YOUR_SUPABASE_API_KEY',
            'Authorization': `Bearer ${authToken}`
          }
        });
      };

      return (
        <div className="bg-yellow-700 pb-96">
          <div className="flex items-center py-4 pr-6 pl-10">
            <svg
              width="30"
              height="12"
              viewBox="0 0 30 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0">
              <path
                d="M4.41455 11.2642C3.32568 11.2642 2.43213 10.9663 1.73389 10.3706C1.03564 9.7749 0.664551 9.0083 0.620605 8.0708H2.39307C2.45166 8.5542 2.66895 8.94482 3.04492 9.24268C3.4209 9.54053 3.88232 9.68945 4.4292 9.68945C5.04932 9.68945 5.5498 9.49902 5.93066 9.11816C6.31641 8.73242 6.50928 8.22461 6.50928 7.59473C6.50928 6.96484 6.31641 6.45459 5.93066 6.06396C5.5498 5.66846 5.0542 5.4707 4.44385 5.4707C4.01416 5.4707 3.63086 5.56104 3.29395 5.7417