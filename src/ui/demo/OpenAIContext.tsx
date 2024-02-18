import { ReactNode, createContext, useContext } from "react"
import OpenAI from "openai"

type OpenAIContext_t = {
  chug: (prompt: string, callback: any) => void;
}

const OpenAIContext = createContext<OpenAIContext_t>({
  chug: () => {},
})

export function useOpenAI() {
  return useContext(OpenAIContext);
}

export default function OpenAIProvider(props: {
  children: ReactNode,
}) {

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const chug = (prompt: string, callback: any) => {
    complete(prompt).then((response) => {
      callback(response);
    });
  }

  async function complete(prompt: string) {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system", content: "You are a transcription processor. You will be given a transcript along with a specific request for information contained within the transcript. Please reply with short answers that include only the necessary response. For instance, reply with 'Jeff' instead of 'The person's name is Jeff'.",
      }, {
        role: "user", content: prompt,
      }]
    })

    return stream.choices[0].message.content?.trim();
  }

  return <OpenAIContext.Provider value={{
    chug: chug
  }}>
    {props.children}
  </OpenAIContext.Provider>
}