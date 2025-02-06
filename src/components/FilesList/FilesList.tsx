import { Button, Table, TableColumnsType, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchFiles } from '../../services/fileService';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { LuFileChartColumn } from 'react-icons/lu';

interface DataType {
    key: React.Key;
    name: string;
  }
  
const defaultData: DataType[] = [
    {
        key: '1',
        name: 'export12022017',
    },
    {
        key: '2',
        name: 'testcsv'
    },
    {
        key: '3',
        name: 'donneesclient'
    },
    {
        key: '4',
        name: 'produits'
    }
];

interface FilesListProps {
    setFileView: (file: DataType) => void;
}

const FilesList: React.FC<FilesListProps> = ({ setFileView }) => {
    const [data, setData] = useState(defaultData);

    useEffect(() => {
        const loadData = async () => {
          try {
            const response = await fetchFiles(); 
            setData(response);
          } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
          }
        };
        loadData();
      }, []);
    
    const handleRowClick = (record: DataType): void => {
        setFileView(record); 
        console.log("Fichier affiché : ", record.name);
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
            <Table<DataType>
                columns={columns}
                dataSource={data}
                // onRow={(record) => ({
                //     onClick: () => {handleRowClick(record);}, 
                // })}
                className="overflow-hidden border-2 border-gray-200 rounded-lg"
            />
        </div>
    );
};

export default FilesList;
