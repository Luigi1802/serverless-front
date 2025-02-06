import { Table, TableColumnsType, TableProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchFiles } from '../../services/fileService'

interface DataType {
    key: React.Key;
    name: string;
  }
  
const columns: TableColumnsType<DataType> = [
    {
        title: 'Nom',
        dataIndex: 'name',
        render: (text: string) => <a>{text}</a>,
    }
];

// const data: DataType[] = [
//     {
//         key: '1',
//         name: 'export12022017',
//     },
//     {
//         key: '2',
//         name: 'testcsv'
//     },
//     {
//         key: '3',
//         name: 'donneesclient'
//     },
//     {
//         key: '4',
//         name: 'produits'
//     }
// ];

const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

const FilesList = () => {
    const [data, setData] = useState([]);

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
    
    return (
        <div className="p-6">
            <Table<DataType>
                rowSelection={{ type: "checkbox", ...rowSelection }}
                columns={columns}
                dataSource={data}
                className="border-2 border-gray-200 rounded-lg"
            />
        </div>
    );
};

export default FilesList;
