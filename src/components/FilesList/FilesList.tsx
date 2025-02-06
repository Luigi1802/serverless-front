import { Button, Spin, Table, TableColumnsType, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { deleteFile, fetchFiles } from '../../services/fileService';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { LuFileChartColumn } from 'react-icons/lu';

interface DataType {
    key: React.Key;
    name: string;
}

interface FilesListProps {
    setFileView: (file: DataType) => void;
}

const FilesList: React.FC<FilesListProps> = ({ setFileView }) => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = async () => {
        setLoading(true);
        try {
          const response = await fetchFiles();
          const filenames = response.map((filename: string, index: number)=>{
              return {
                  key: index,
                  name: filename
              }
          })
          setData(filenames);
          setLoading(false);
        } catch (error) {
          console.error("Erreur lors du chargement des données :", error);
        }
      };

    useEffect(() => {
        loadData();
      }, []);
    
    const handleDelete = async (name: string) => {
        try {
            await deleteFile(name); 
            loadData();
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    }
    
    const handleRowClick = (record: DataType): void => {
        setFileView(record); 
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: '',
            width: '30px',
            render: () => <div className="flex justify-center"><LuFileChartColumn className="text-xl"/></div>,
        },
        {
            title: 'Nom du fichier',
            dataIndex: 'name',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Actions',
            width: '100px',
            render: (record: DataType) => 
                <div className="flex flex-row items-center gap-2">
                    <Tooltip title="Voir le rapport">
                        <Button 
                            type="default"
                            onClick={(e) => {
                                e.stopPropagation();
                                    handleRowClick(record);
                                }
                            }
                            variant="filled" 
                            size="large" 
                            icon={<MdOutlineOpenInNew className="text-lg" />} 
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button 
                            danger 
                            onClick={()=>handleDelete(record.name)}
                            type="primary" 
                            size="large" 
                            icon={<FaRegTrashAlt className="text-lg" />} 
                        />
                    </Tooltip>
                </div>,
        }
    ];

    return (
        <div className="p-6">
            {loading ? <Spin fullscreen className="scale-150" size="large"/> :
                <Table<DataType>
                    columns={columns}
                    dataSource={data}
                    className="overflow-hidden border-2 border-gray-200 rounded-lg"
                />
            }
        </div>
    );
};

export default FilesList;
