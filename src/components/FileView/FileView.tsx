// import React from 'react';

import { Divider, Spin, Table } from "antd";
import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fetchFileData } from "../../services/fileService";
import { IoWarning } from "react-icons/io5";

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
}

const FileView: React.FC<FileViewProps> = ({ selectedFile }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);
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
                try {
                    // const response = await fetchFileData(selectedFile.name); 
                    const falseData = {
                        "statistiques": {
                            "prix": {
                                "mediane": 241.39,
                                "moyenne": 238.9789898989899,
                                "ecart-type": 149.6050691701931
                            },
                            "note_client": {
                                "mediane": 3.3,
                                "moyenne": 3.218181818181818,
                                "ecart-type": 1.3816112773522313
                            },
                            "quantite": {
                                "mediane": 28.0,
                                "moyenne": 75.68686868686869,
                                "ecart-type": 500.18073562982903
                            }
                        },
                        "anomalies": {
                            "prix": {
                                "anomalies_count": 1.0,
                                "lignes_anomalies": [
                                    "6;Produit_6;-100.0;30;3.8"
                                ]
                            },
                            "note_client": {
                                "anomalies_count": 2.0,
                                "lignes_anomalies": [
                                    "16;Produit_16;99.87;32;10.0",
                                    "100;Produit_100;62.87;36;6.0"
                                ]
                            },
                            "quantite": {
                                "anomalies_count": 1.0,
                                "lignes_anomalies": [
                                    "11;Produit_11;20.09;5000;1.5"
                                ]
                            }
                        }
                    };
                    setData(falseData);
                } catch (error) {
                    console.error("Erreur lors du chargement des données :", error);
                }
            };
            loadData();
        }
    }, []);

    return (
        <div className="min-h-full overflow-y-auto flex-1">
            {(!loading && selectedFile) ?
            <div className="h-full flex flex-col gap-2">
                {/* Title */}
                <div className="flex flex-col gap-4 px-8 pt-6 pb-4">
                    <span className="text-3xl">Analyse de {selectedFile.name}</span>
                    <span className="text-md">Compte rendu de l'analyse de {selectedFile.name}.csv</span>
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
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives au prix</span>
                        <Table pagination={false} dataSource={price_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center my-2 gap-4">
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives aux notes client</span>
                        <Table pagination={false} dataSource={ratings_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col justify-center my-2 gap-4 mb-14">
                        <span className="text-sky-900 text-md font-bold">Anomalies relatives aux quantités en stocks</span>
                        <Table pagination={false} dataSource={quantity_anomalies} columns={anomaly_columns} className="overflow-hidden pb-1 bg-white border-2 border-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
             :
            <div className="flex h-full justify-center items-center">
                <Spin className="scale-150" size="large"/>
            </div>
            }
        </div>
    );
};

export default FileView;