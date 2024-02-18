import { ReactNode, createContext, useContext, useState } from "react"

type DataContext_t = {
  // type declaration
  onboarded: boolean,
  setOnboarded: (x: boolean) => void;
  data: any,
  setData: (x: any) => void,
}

const DataContext = createContext<DataContext_t>({
  // default values
  onboarded: false,
  setOnboarded: () => {},
  data: {},
  setData: () => {},
});

export function useData() {
  return useContext(DataContext);
}

export default function DataProvider(props: {
  children: ReactNode,
}) {

  const [onboarded, setOnboarded] = useState(false);
  const [data, setData] = useState({});

  return <DataContext.Provider value={{
    onboarded: onboarded,
    setOnboarded: setOnboarded,
    data: data,
    setData: setData,
  }}>
    {props.children}
  </DataContext.Provider>
}