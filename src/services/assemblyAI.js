import axios from 'axios';

    const ASSEMBLY_AI_KEY = '3b0edd2d6f3844e3ace30daa584ddc84';

    export const transcribeAudio = async (audio) => {
      try {
        let audioData;
        let contentType;

        if (audio instanceof File) {
          audioData = audio;
          contentType = 'application/octet-stream';
        } else {
          audioData = audio;
          contentType = 'application/json';
        }

        console.log('Uploading audio with content type:', contentType);

        // Upload the audio file
        const uploadResponse = await axios.post(
          'https://api.assemblyai.com/v2/upload',
          audioData,
          {
            headers: {
              'Content-Type': contentType,
              'Authorization': ASSEMBLY_AI_KEY
            }
          }
        );

        console.log('Upload response:', uploadResponse);

        const audioUrl = uploadResponse.data.upload_url;

        // Start transcription
        const transcriptResponse = await axios.post(
          'https://api.assemblyai.com/v2/transcript',
          {
            audio_url: audioUrl
          },
          {
            headers: {
              'Authorization': ASSEMBLY_AI_KEY,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Transcription response:', transcriptResponse);

        const transcriptId = transcriptResponse.data.id;

        // Poll for transcription completion
        let transcript;
        while (true) {
          const pollingResponse = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
            {
              headers: {
                'Authorization': ASSEMBLY_AI_KEY
              }
            }
          );

          console.log('Polling response:', pollingResponse);

          if (pollingResponse.data.status === 'completed') {
            transcript = pollingResponse.data;
            break;
          } else if (pollingResponse.data.status === 'error') {
            console.error('AssemblyAI Error:', pollingResponse.data);
            throw new Error(`Transcription failed: ${pollingResponse.data.error}`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return transcript.text;
      } catch (error) {
        console.error('Error in transcription:', error);
        throw error;
      }
    };
