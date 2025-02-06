// import React from 'react';
import './App.css';
import { Header } from 'antd/es/layout/layout';
import FilesList from '../FilesList/FilesList';
import FileView from '../FileView/FileView';
import { useState } from 'react';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { AiFillThunderbolt } from 'react-icons/ai';
import { Button, Input, message, Modal } from 'antd';
import { FiFilePlus } from 'react-icons/fi';
import Upload, { RcFile } from 'antd/es/upload';
import { addFile } from '../../services/fileService';
interface DataType {
    key: React.Key;
    name: string;
}

const App = () => {
  const [selectedFile, setFileView] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [fileList, setFileList] = useState<RcFile[]>([]); // File state

  const handleOk = async () => {
    if (fileList.length === 0) {
      message.error("Veuillez sélectionner un fichier");
      return;
    } 
    try {
      // Appel au service pour télécharger le fichier
      await addFile(fileList[0], filename);

      // Réinitialisation des états après un envoi réussi
      setIsModalOpen(false); // Ferme le modal après envoi
      setFilename(""); // Réinitialise le nom du fichier
      setFileList([]); // Réinitialise la liste de fichiers
      // TODO refresh la page
    } catch (error) {
      console.error("Erreur dans le téléchargement", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (info: any) => {
    if (info.fileList.length > 0) {
      const filenameWithoutExt = info.fileList[0].name.replace(/\.[^/.]+$/, "");
      setFilename(filenameWithoutExt); // Met à jour le nom du fichier
    }
    setFileList(info.fileList);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
          title="Ajouter un fichier .csv" 
          cancelText="Annuler"
          okText="Envoyer le fichier"
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
        >
          <div className="flex flex-col pt-4">
            <span className="text-gray-700 text-[12px] mb-2">Choisissez un nom pour le fichier (optionnel)</span>
            <Input placeholder="Nom du fichier" value={filename} onChange={(e) => setFilename(e.target.value)}/>
          </div>
          <div className="my-6">
            <Upload
              maxCount={1}
              listType="text"
              onChange={handleFileChange}
              beforeUpload={() => false} // Empêche l'upload automatique
              fileList={fileList}
            >
              <Button icon={<FiFilePlus />} style={{ width: '100%' }}>
                Sélectionner un fichier
              </Button>
            </Upload>
          </div>
        </Modal>
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
        {selectedFile && // ? 
          <section className="bg-gray-100 h-full w-[60%] overflow-y-auto flex-1">
            <FileView selectedFile={selectedFile} closeView={()=>{setFileView(null)}}/>
          </section> // :
          // <div className="flex h-full w-[50%] justify-center items-center"> 
          //   <img src="../../../public/illustration.jpg" className="h-[500px]" />
          // </div>
        }
      </div>
      {/* Floating upload button */}
      <div>

      </div>
    </div>
  );
};

export default App;