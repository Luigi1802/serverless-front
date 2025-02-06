// import React from 'react';
import './App.css';
import { Header } from 'antd/es/layout/layout';
import FilesList from '../FilesList/FilesList';
import FileView from '../FileView/FileView';
import { useState } from 'react';
import { MdOutlineOpenInNew } from 'react-icons/md';
interface DataType {
    key: React.Key;
    name: string;
  }

const App = () => {
  const [selectedFile, setFileView] = useState<DataType | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header className="flex flex-row items-center !py-10 !bg-[#1257a6]">
        {/* TODO Add logo */}
        <span className="font-consolas text-3xl text-white">
          CSV Analyzer
        </span>
      </Header>
      {/* Content */}
      <div className="w-full h-full flex flex-row overflow-hidden">
        {/* Files list section */}
        <section className={`bg-white h-full ${selectedFile ? 'w-[40%]' : 'w-[50%]'}`}>
          <div className="flex flex-col gap-4 px-8 pt-6">
            <span className="text-2xl">Liste des fichiers distants</span>
            <span className="text-md flex flex-row gap-2 items-center">Cliquez sur <MdOutlineOpenInNew className="text-md" /> pour afficher l'analyse du fichier.</span>
          </div>
          <div>
            {/* Files list content */}
            <FilesList setFileView={setFileView} />
          </div>
        </section>
        {/* File analysis section */}
        {selectedFile ? 
          <section className="bg-gray-100 h-full w-[60%] overflow-y-auto flex-1">
            <FileView selectedFile={selectedFile} />
          </section> :
          <div className="flex h-full w-[50%] justify-center items-center"> 
            <img src="../../../public/illustration.jpg" className="h-[500px]" />
          </div>
        }
      </div>
      {/* Floating upload button */}
      <div>

      </div>
    </div>
  );
};

export default App;