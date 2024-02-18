"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type TTSContext_t = {
	play: () => void;
	pause: () => void;
	cancel: () => void;
	queue: (next: string[]) => void;
  speak: (next: string, callback?: any) => void;
};

const TTSContext = createContext<TTSContext_t>({
	play: () => {},
	pause: () => {},
	cancel: () => {},
	queue: () => {},
  speak: () => {},
});

export function useTTS() {
	return useContext(TTSContext);
}

export default function TTSProvider(props: { children: ReactNode }) {
	const [paused, setPaused] = useState(false);
	const [queue, setQueue] = useState<string[]>([]);

	const onPlay = () => {
		const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(queue[0]);

		if (paused) {
			synth.resume();
		}

    synth.speak(u);

    setQueue(queue.filter((v, i) => i != 0))
		setPaused(false);
	};

	const onPause = () => {
		const synth = window.speechSynthesis;

		synth.pause();

		setPaused(true);
	};

	const onCancel = () => {
		const synth = window.speechSynthesis;

		synth.cancel();

		setPaused(false);
	};

	const onQueue = (next: string[]) => {
		setQueue([...queue, ...next]);
	};

  const onSpeak = (next: string, callback: any) => {
    const synth = window.speechSynthesis;

		synth.cancel();

    const u = new SpeechSynthesisUtterance(next);

		u.onend = callback;

    synth.speak(u);
  }

	return <TTSContext.Provider value={{
    play: onPlay,
    pause: onPause,
    cancel: onCancel,
    queue: onQueue,
    speak: onSpeak,
  }}>{props.children}</TTSContext.Provider>;
}
