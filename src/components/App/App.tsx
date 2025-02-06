// import React from 'react';
import './App.css';
import { Header } from 'antd/es/layout/layout';
import FilesList from '../FilesList/FilesList';

const App = () => {
  console.log(import.meta.env.VITE_API_BASE_URL);
  console.log(process.env.VITE_API_BASE_URL);
  

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <Header className="flex flex-row items-center !py-10">
        {/* TODO Add logo */}
        <span className="font-consolas text-3xl text-white">
          CSV Analyzer
        </span>
      </Header>
      {/* Content */}
      <div className="w-full h-full flex flex-row">
        {/* Files list section */}
        <section className="bg-white h-full w-[50%]">
          <div className="flex flex-col gap-4 px-8 py-4">
            <span className="text-2xl">Liste des fichiers distants</span>
            <span className="text-md">Cliquez sur un fichier pour afficher son analyse.</span>
          </div>
          <div>
            {/* Files list content */}
            <FilesList/>
          </div>
        </section>
        {/* File analysis section */}
        <section className="bg-gray-100 h-full w-[50%] overflow-y-auto">
        <div className="flex flex-col gap-4 px-8 py-4">
            <span className="text-2xl">Analyse de [nom-fichier]</span>
            <span className="text-md">Compte rendu de l'analyse de [nom-fichier].csv</span>
          </div>
        </section>
      </div>
      {/* Floating upload button */}
      <div>

      </div>
    </div>
  );
};

export default App;