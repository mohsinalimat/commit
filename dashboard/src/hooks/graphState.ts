import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { addGraph } from './generateGraph';
import { json, useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { FrappeConfig, FrappeContext, useFrappeGetDoc } from 'frappe-react-sdk';
import { DocType } from '@/types/Core/DocType';
import { tableRowNumbers, tableWidth, tableMarginLeft, fieldHeight, titleHeight, commentHeight, tableMarginTop } from '@/utils/erd/settings';
import { DocField } from '@/types/Core/DocField';

/**
 * It returns a state object that contains the graph data, and a set of functions to update the graph
 * data
 * @returns An object with the following properties:
 */
export function useGraphState() {

    // const [id, setID] = useState<string>('')
    const [name, setName] = useState('Untitled graph');
    const [theme, setTheme] = useState('light');
    const [version, setVersion] = useState('currentVersion');

    // viewbox of svg
    const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0, clientW: 0, clientH: 0 });
    const [tableDict, setTableDict] = useState<any>({});
    const [linkDict, setLinkDict] = useState<any>({});

    const [editingTable, setEditingTable] = useState<any>();
    const [editingField, setEditingField] = useState<any>({});
    const [addingField, setAddingField] = useState<any>(null);

    const { id } = useParams<{ id: string }>();

    const { call } = useContext(FrappeContext) as FrappeConfig



    // const { graphName, doctypes, jsonData } = GenerateGraph('44adb82da5')



    // const graph = GenerateGraph(id)

    /* A callback function that is used to update the viewbox of the svg. */
    const resizeHandler = useCallback(() => {
        setBox(state => {
            return {
                x: state.x,
                y: state.y,
                w:
                    state.w && state.clientW
                        ? state.w * (window.innerWidth / state.clientW)
                        : window.innerWidth,
                h:
                    state.h && state.clientH
                        ? state.h * (window.innerHeight / state.clientH)
                        : window.innerHeight,
                clientW: window.innerWidth,
                clientH: window.innerHeight,
            };
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);

    /**
     * It takes a graph object and sets the state of the app to match the graph object
     */
    const loadGraph = useCallback((graph: any) => {
        if (!graph) return resizeHandler();

        if (graph.tableDict) setTableDict(graph.tableDict);
        if (graph.linkDict) setLinkDict(graph.linkDict);
        if (graph.box) {
            const { x, y, w, h, clientH, clientW } = graph.box;
            setBox({
                x,
                y,
                w: w && clientW ? w * (window.innerWidth / clientW) : window.innerWidth,
                h: h && clientH ? h * (window.innerHeight / clientH) : window.innerHeight,
                clientW: window.innerWidth,
                clientH: window.innerHeight,
            });
        }
        if (graph.name) setName(graph.name);
    }, [resizeHandler, setName, setBox, setLinkDict, setTableDict]);

    const tableList = useMemo(() => Object.values(tableDict), [tableDict]);

    const calcXY = useCallback((tables: any, start?: number) => {
        const index = start || Math.max(1, tables?.length);
        let x, y;
        if (!tables?.length) {
            x = box?.x + 196 + 72;
            y = box?.y + 72;
        } else {
            if (index < tableRowNumbers) {
                const lastTable: any = tables[index - 1];
                x = lastTable.x + tableWidth + tableMarginLeft;
                y = lastTable.y;
            } else {
                const lastTable: any = tables[index - tableRowNumbers];
                const { fields } = lastTable;
                x = lastTable.x;
                y =
                    lastTable.y +
                    fields.length * fieldHeight +
                    titleHeight +
                    commentHeight +
                    tableMarginTop;
            }
        }
        return [x, y];
    }, [box]);

    const addTable = useCallback((tableName: string, tableList: any) => {
        const [x, y] = calcXY(tableList);
        const id = nanoid();
        const newTable = {
            [id]: {
                id,
                name: tableName,
                x,
                y,
                fields: [],
            },
        };
        // setTableDict(state => ({ ...state, ...newTable }));
        setEditingTable(newTable[id]);
        return newTable[id];
    }, [calcXY]);
    const addBulkFields = (table: any, doctype: DocType) => {
        doctype.fields?.forEach((field: DocField) => {
            table.fields.push({
                id: nanoid(),
                name: field.label,
                fieldName: field.fieldname,
                type: field.fieldtype,
                unique: false,
            })
        })
        // setTableDict((state: any) => {
        //     return {
        //         ...state,
        //         [table.id]: {
        //             ...state[table.id],
        //             ...table,
        //         },
        //     };
        // })
    }

    const addTableWithField = useCallback((doctype: DocType, tableDict: any) => {
        const tableList = Object.values(tableDict);
        const table = addTable(doctype.name, tableList);
        addBulkFields(table, doctype);
        return table;
    }, [addTable])


    useEffect(() => {
        if (!id) {
            setTableDict({});
            setLinkDict({});
            setName('');
            resizeHandler();
            return;
        }

        /**
         * > If the graph is in the local storage, and the graph in the local storage is newer than the
         * graph in the database, then ask the user if they want to load the graph from the local
         * storage
         */
        const initGraph = async () => {
            // setInit(true);


            const graphData = addGraph(id);

            call.get<{
                message: {
                    graph_name: string,
                    doctypes: string[]
                    json_data: DocType[]
                }
            }>('commit.commit.doctype.graph.graph.get_graph_data', {
                id: id
            }).then((res: {
                message: {
                    graph_name: string,
                    doctypes: string[]
                    json_data: DocType[]
                }
            }) => {

                const tableDict: any = {}

                res?.message?.json_data?.forEach((doctype: DocType) => {
                    const table = addTableWithField(doctype, tableDict)
                    tableDict[table.id] = table

                })
                // console.log(tableDict)
                graphData.tableDict = tableDict
                return graphData
                // loadGraph(graph);
            }).then((graphData: any) => {
                // console.log(graphData)
                loadGraph(graphData);
            })
            // loadGraph(graphData);

            // const storageGraph = JSON.parse(window.localStorage.getItem(id));
            // if (graph?.updatedAt < storageGraph?.updatedAt) {
            //     Modal.confirm({
            //         title: 'Unsaved changes',
            //         content:
            //             'You have some unsaved changes after last version, do you want to restore them? Once you press the no button, the unsaved changes will be cleaned immediately. You can’t undo this action.',
            //         cancelButtonProps: { status: 'danger' },
            //         okText: 'Yes, restore them',
            //         cancelText: 'No, ignore them',
            //         onOk: () => {
            //             loadGraph(storageGraph);
            //         },
            //         onCancel: () => {
            //             window.localStorage.removeItem(id);
            //         },
            //     });
            // } else {
            //     resizeHandler();
            // }
        };
        // if (data) {
        //     initGraph();
        // }
        if (id) {
            initGraph();
        }
    }, [id, call, addTableWithField, loadGraph, resizeHandler]);

    // useEffect(() => {
    //     if (init) setInit(false);
    //     if (!id || init || !Object.keys(tableDict).length) return;

    //     window.localStorage.setItem(
    //         id,
    //         JSON.stringify({
    //             id,
    //             tableDict,
    //             linkDict,
    //             box,
    //             name,
    //             updatedAt: new Date().valueOf(),
    //         })
    //     );
    // }, [box, linkDict, tableDict, name]);

    useEffect(() => {
        const t = theme || window.localStorage.getItem('theme') || 'light';
        t === 'dark'
            ? document.body.setAttribute('arco-theme', 'dark')
            : document.body.removeAttribute('arco-theme');
        if (!theme) setTheme(t);
    }, [theme]);


    return {
        id,
        tableList,
        tableDict,
        setTableDict,
        linkDict,
        setLinkDict,
        box,
        setBox,
        name,
        setName,
        theme,
        setTheme,
        version,
        setVersion,
        editingTable,
        setEditingTable,
        editingField,
        setEditingField,
        addingField,
        setAddingField,
    };
}

export interface GraphStateReturns {
    id: string;
    tableList: any;
    tableDict: any;
    setTableDict: any;
    linkDict: any;
    setLinkDict: any;
    box: any;
    setBox: any;
    name: string;
    setName: any;
    theme: string;
    setTheme: any;
    version: string;
    setVersion: any;
    editingTable: any;
    setEditingTable: any;
    editingField: any;
    setEditingField: any;
    addingField: any;
    setAddingField: any
}

export const GraphStateContext = createContext<GraphStateReturns>({} as GraphStateReturns);


// export interface GraphProps {
//     name: string;
//     graph_name: string;
//     graph_json: string;
// }