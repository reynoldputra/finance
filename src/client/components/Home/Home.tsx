import React, {useEffect} from 'react';

export interface HomeProps {
}

export const Home: React.FC<HomeProps> = (props) => {
  const info = `This app is using Chrome (v${window.appApi.chrome()}), Node.js (v${window.appApi.node()}), and Electron (v${window.appApi.electron()})`;

  useEffect(() => {
    window.appApi.receive("app", (event) => {
      console.log("Received event from main ", event);
      alert("Received event from main " + event.action);
    });
  }, [])

  return (
    <div className="App">
      <h1 className="bg-blue-900 text-red-300">Vite + React</h1>
      <div className="card">
        {info}
        <p>
          Edit <code>src/Home.tsx</code> and save to test HMR!
        </p>
      </div>
    </div>
  );
}
