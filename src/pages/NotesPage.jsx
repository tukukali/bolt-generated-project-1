import React, { useState, useRef, useEffect } from 'react';
    import Button from '../components/Button';
    import StatusBar from '../components/StatusBar';
    import { supabase, getUserSpaces, createUserSpace } from '../services/supabase';
    import { transcribeAudio } from '../services/assemblyAI';
    import { downloadTextFile } from '../utils/fileDownload';

    const NotesPage = ({ onLogout }) => {
      const [note, setNote] = useState('');
      const [isRecording, setIsRecording] = useState(false);
      const [isProcessing, setIsProcessing] = useState(false);
      const audioInputRef = useRef(null);
      const [userSpaces, setUserSpaces] = useState([]);
      const [selectedSpace, setSelectedSpace] = useState(null);

      useEffect(() => {
        const fetchUserSpaces = async () => {
          const spaces = await getUserSpaces();
          setUserSpaces(spaces);
          if (spaces.length > 0) {
            setSelectedSpace(spaces[0].id);
          }
        };

        fetchUserSpaces();
      }, []);

      const handleCreateSpace = async () => {
        const spaceName = prompt('Enter a name for your new space:');
        if (spaceName) {
          const newSpace = await createUserSpace(spaceName);
          if (newSpace) {
            setUserSpaces([...userSpaces, newSpace]);
            setSelectedSpace(newSpace.id);
          }
        }
      };

      const handleRecord = async () => {
        try {
          setIsRecording(true);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];

          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            setIsRecording(false);
            setIsProcessing(true);
            
            try {
              const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
              
              // Transcribe audio using Assembly AI
              const transcription = await transcribeAudio(audioBlob);
              setNote(transcription);

              // Save to Supabase
              const { data, error } = await supabase
                .from('notes')
                .insert([
                  { content: transcription, user_id: supabase.auth.user()?.id, space_id: selectedSpace }
                ]);

              if (error) throw error;
            } catch (error) {
              console.error('Error processing audio:', error);
              alert('Error processing audio. Please try again.');
            } finally {
              setIsProcessing(false);
            }
          };

          mediaRecorder.start();
          setTimeout(() => mediaRecorder.stop(), 5000);
        } catch (error) {
          console.error('Error recording:', error);
          setIsRecording(false);
          alert('Error accessing microphone. Please ensure you have granted permission.');
        }
      };

      const handleAudioUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        try {
          const transcription = await transcribeAudio(file);
          setNote(transcription);

          const { data, error } = await supabase
            .from('notes')
            .insert([
              { content: transcription, user_id: supabase.auth.user()?.id, space_id: selectedSpace }
            ]);

          if (error) throw error;
        } catch (error) {
          console.error('Error processing audio:', error);
          alert('Error processing audio. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      const handleDownload = () => {
        if (note) {
          downloadTextFile(note, 'note.txt');
        }
      };

      return (
        <div className="flex flex-col min-h-screen">
          <StatusBar />
          <div className="flex-1 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">My Notes</h1>
              <Button label="Logout" onClick={onLogout} />
            </div>
            <div className="flex gap-4 mb-6">
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-black"
              >
                {userSpaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name}
                  </option>
                ))}
              </select>
              <Button label="Create Space" onClick={handleCreateSpace} />
            </div>
            <div className="flex gap-4 mb-6">
              <Button 
                label={isRecording ? "Recording..." : isProcessing ? "Processing..." : "Record"} 
                onClick={handleRecord} 
                variant="primary"
                disabled={isRecording || isProcessing}
              />
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                style={{ display: 'none' }}
                ref={audioInputRef}
              />
              <Button 
                label="Upload Audio" 
                onClick={() => audioInputRef.current.click()}
                disabled={isProcessing}
              />
              <Button 
                label="Download" 
                onClick={handleDownload} 
                disabled={!note}
              />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 p-4 rounded-lg bg-neutral-800 text-white resize-none"
              placeholder="Your note will appear here..."
              readOnly={isProcessing}
            />
          </div>
        </div>
      );
    };

    export default NotesPage;
