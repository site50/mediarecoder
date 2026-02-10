import React, { Component } from 'react';
import { useState, useRef,useEffect } from 'react';

export function useSocket(onMessage: (data: any) => void) {
    const socketRef = useRef<WebSocket | null>(null);
  
    useEffect(() => {
      const socket = new WebSocket("ws://localhost:3001");
      socketRef.current = socket;
  
      socket.onmessage = (event) => {
        onMessage(JSON.parse(event.data));
      };
  
      return () => socket.close();
    }, [onMessage]);
  
    const send = (data: any) => {
      socketRef.current?.send(JSON.stringify(data));
    };
  
    return { send };
  }