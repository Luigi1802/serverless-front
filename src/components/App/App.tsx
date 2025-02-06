import './App.css';
import { Header } from 'antd/es/layout/layout';
import FilesList from '../FilesList/FilesList';
import FileView from '../FileView/FileView';
import { useState } from 'react';
import { MdOutlineOpenInNew, MdQueryStats } from 'react-icons/md';
import { AiFillThunderbolt } from 'react-icons/ai';
import { Button, Input, Modal } from 'antd';
import { FiFilePlus } from 'react-icons/fi';
import { addFile } from '../../services/fileService';
import { LuFileCheck2 } from 'react-icons/lu';
import { IoMdOpen } from 'react-icons/io';
interface DataType {
    key: React.Key;
    name: string;
}

const App = () => {
  const [selectedFile, setFileView] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFilename(file.name.replace(".csv", ""));
      setFile(file);
    }
  };

  const renameFile = (originalFile: File, newName: string) => {
    return new File([originalFile], newName, { type: originalFile.type, lastModified: originalFile.lastModified });
  };


  const handleOk = async () => {
    if (!file) {
      return;
    }

    // Renommer le fichier
    const renamedFile = renameFile(file, `${filename}.csv`);

    try {
      await addFile(renamedFile);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'envoi", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFile(null);
    setFilename("");
    // Réinitialiser la valeur du champ input file
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Vide la valeur de l'input
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header className="flex flex-row items-center !py-10 !bg-[#1257a6] justify-between">
        <span className="text-3xl text-white flex flex-row gap-4 items-center">
          <AiFillThunderbolt className="text-[42px]" />
          CSVitesse
        </span>
        <Button
          type="text"
          onClick={()=>setIsModalOpen(true)}
          style={{
            border: "2px solid white",
            color: "white",
            padding: "20px"
          }}
        >
          <span className="poppins text-[16px] flex flex-row gap-4 items-center"><FiFilePlus className="text-xl"/> Ajouter un fichier</span>
        </Button>
        {/* Add file Modal */}
        <Modal 
          title={<span className="poppins font-normal text-lg">Ajouter un fichier .csv</span>} 
          cancelText="Annuler"
          okButtonProps={{ disabled: file === null, className: `poppins ${file && "!bg-[#1257a6]"}` }}
          cancelButtonProps={{ className: "poppins" }}
          okText="Importer le fichier"
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
        >
          <div className="flex flex-row gap-4 items-center mt-8 mb-6">
            {/* Input file caché */}
            <input
              type="file"
              accept=".csv"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Label stylisé qui agit comme un bouton */}
            <label
              htmlFor="fileInput"
              className="flex flex-row poppins items-center gap-2 cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition"
            >
              <IoMdOpen />
              Sélectionner un fichier
            </label>

            {/* Affichage du nom du fichier sélectionné */}
            {file && <p className="flex flex-row items-center gap-2 text-gray-500 text-sm poppins"><LuFileCheck2 /> {file.name}</p>}

          </div>
          {
            file &&
            <div className="flex flex-col py-4">
              <span className="text-gray-700 text-[12px] mb-2 poppins">Choisissez un nom pour le fichier (optionnel)</span>
              <Input className="poppins" placeholder="Nom du fichier" value={filename} onChange={(e) => setFilename(e.target.value)}/>
            </div>
          }
        </Modal>
      </Header>
      {/* Content */}
      <div className="w-full h-full flex flex-row overflow-hidden">
        {/* Files list section */}
        <section className={`bg-white overflow-y-auto h-full ${selectedFile ? 'w-[40%]' : 'w-[50%]'}`}>
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
        {selectedFile  ? 
          <section className="bg-gray-100 h-full w-[60%] overflow-y-auto flex-1">
            <FileView selectedFile={selectedFile} closeView={()=>{setFileView(null)}}/>
          </section>  :
          <div className="flex h-full w-[50%] justify-center items-center"> 
            <MdQueryStats className="text-[300px] text-[#1257a6] opacity-30" />
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