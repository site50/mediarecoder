import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';

function App() {
    const record = useRef<MediaRecorder | null>(null);
    const blob = useRef<BlobPart[]>([]);
    const [url, setUrl] = useState<string | null>(null);

    const websocket = useRef<WebSocket | null>(null);
    const [translated, setTranslated] = useState(``);

    const start = async () => {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        record.current = new MediaRecorder(s)
        blob.current = [];
        record.current.ondataavailable = e => blob.current.push(e.data)
        record.current.onstop = () => {
            const b = new Blob(blob.current, { type: `audio/web` });
            setUrl(URL.createObjectURL(b));

            const text = ` we send and receive a simulated text`;
            websocket.current?.send(JSON.stringify({ text }))
        }
        record.current.start()
    }
    const stop = () => {
        record.current?.stop();
    }

    useEffect(() => {
        websocket.current = new WebSocket(`ws://localhost:3001`);
        websocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.translation) {
                setTranslated(prev => prev + `` + data.translation + `/`)
            }
        }
        return () => websocket.current?.close()
    }, []);

    return (
        <div style ={{textAlign:`center`}}>
            <button onClick={start}>start</button>
            <button onClick={stop}>stop</button>
            <div className='block-translated'>
            <h3>{translated}</h3>
            </div>
           
            {url && <audio src={url} controls />}
        </div>
    )
}
export default App;