import { Button, Divider, Spin, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { fetchFileData } from "../../services/fileService";

interface FileType {
    "statistiques": { 
        "prix": {"mediane": number, "moyenne": number, "ecart-type": number},
        "note_client": {"mediane": number, "moyenne": number, "ecart-type": number},
        "quantite": {"mediane": number, "moyenne": number, "ecart-type": number}
    },
    "anomalies": {
        "prix": {"anomalies_count": number, "lignes_anomalies": string[]},
        "note_client": {"anomalies_count": number, "lignes_anomalies": string[]},
        "quantite": {"anomalies_count": number, "lignes_anomalies": string[]}
    }
}
interface FileViewProps {
    selectedFile: { name: string; } | null;
    closeView: () => void;
}

const FileView: React.FC<FileViewProps> = ({ selectedFile, closeView }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [fileData, setData] = useState<FileType | null>(null);
    
    const formatAnomaliesData = (lines: string[]) => {
        return lines.map((line: string, key: number) => {
            const values = line.split(";");
            return {
                key: key,
                id: values[0],
                product: values[1],
                price: values[2],
                quantity: values[3],
                ratings: values[4],
            }
        })
    }
    const price_anomalies = !fileData ? [] : formatAnomaliesData(fileData.anomalies.prix.lignes_anomalies);
    const quantity_anomalies = !fileData ? [] : formatAnomaliesData(fileData.anomalies.quantite.lignes_anomalies);
    const ratings_anomalies = !fileData ? [] : formatAnomaliesData(fileData.anomalies.note_client.lignes_anomalies);


    const anomaly_columns = [
        {
            title: '',
            width: 'min-content',
            render: () => <div className="flex justify-center"><IoWarning className="text-amber-600 text-xl"/></div>
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nom produit',
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantité',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Notes client',
            dataIndex: 'ratings',
            key: 'ratings',
        }
    ];

    useEffect(() => {
        if (selectedFile !== null) {
            const loadData = async () => {
                setLoading(true);
                try {
                    const response = await fetchFileData(selectedFile.name.replace(".csv", ".json")); 
                    setData(response);
                    setLoading(false);
                } catch (error) {
                    console.error("Erreur lors du chargement des données :", error);
                }
            };
            loadData();
        }
    }, [selectedFile]);

    return (
        <div className="min-h-full overflow-y-auto flex-1">
            {(!loading && selectedFile) ?
            <div className="h-full flex flex-col gap-2">
                {/* Title */}
                <div className="flex flex-row justify-between items-start px-8 pt-6 pb-4">
                    <div className="flex flex-col gap-4">
                        <span className="text-3xl">Analyse de {selectedFile.name.replace(".csv", "")}</span>
                        <span className="text-md">Compte rendu de l'analyse des données de <i>{selectedFile.name}</i></span>
                    </div>
                    <Button 
                        shape="circle" 
                        icon={<CloseOutlined className="text-lg" />} 
                        onClick={()=>closeView()}
                        className="border-gray-400 hover:border-gray-600 hover:text-red-500"
                    />
                </div>
                
                <Divider/>
                <span className="text-2xl py-2 px-8">📊 Statistiques générales</span>
                {/* Price statistics */}
                <div className="flex flex-row items-center gap-2 px-8 w-full py-2">
                    <span className="w-[200px]">Prix des produits</span>
                    <Divider type="vertical" className="!h-[50%] bg-slate-600"/>
                    <div className="flex flex-row items-center justify-between gap-2 flex-1 px-14">
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Moyenne</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.prix.moyenne.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Médiane</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.prix.mediane.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Écart-type</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.prix["ecart-type"].toFixed(2) : "0"}</span>
                        </div>
                    </div>
                </div>
                {/* Ratings statistics */}
                <div className="flex flex-row items-center gap-2 px-8 w-full py-2">
                    <span className="w-[200px]">Notes client</span>
                    <Divider type="vertical" className="!h-[50%] bg-slate-600"/>
                    <div className="flex flex-row items-center justify-between gap-2 flex-1 px-14">
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Moyenne</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.note_client.moyenne.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Médiane</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.note_client.mediane.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Écart-type</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.note_client["ecart-type"].toFixed(2) : "0"}</span>
                        </div>
                    </div>
                </div>
                {/* Price statistics */}
                <div className="flex flex-row items-center gap-2 px-8 w-full py-2">
                    <span className="w-[200px]">Quantités en stocks</span>
                    <Divider type="vertical" className="!h-[50%] bg-slate-600"/>
                    <div className="flex flex-row items-center justify-between gap-2 flex-1 px-14">
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Moyenne</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.quantite.moyenne.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Médiane</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.quantite.mediane.toFixed(2) : "0"}</span>
                        </div>
                        <div className="flex flex-col text-center">
                            <span className="text-sky-900 text-lg font-bold">Écart-type</span>
                            <span className="text-lg">{fileData ? fileData.statistiques.quantite["ecart-type"].toFixed(2) : "0"}</span>
                        </div>
                    </div>
                </div>
                <Divider/>
                <span className="text-2xl py-2 px-8">⚠️ Anomalies</span>   
                <div className="flex flex-col justify-center gap-4 px-8">
                    <div className="flex flex-col justify-center my-2 gap-4">
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives aux prix</span>
                        <Table locale={{ emptyText: 'Aucune anomalie' }} pagination={false} dataSource={price_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center my-2 gap-4">
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives aux notes client</span>
                        <Table locale={{ emptyText: 'Aucune anomalie' }} pagination={false} dataSource={ratings_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center my-2 gap-4 mb-14">
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives aux quantités en stocks</span>
                        <Table locale={{ emptyText: 'Aucune anomalie' }} pagination={false} dataSource={quantity_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
             :
            <div className="flex min-h-[80vh] justify-center items-center">
                <Spin className="scale-150" size="large"/>
            </div>
            }
        </div>
    );
};

export default FileView;