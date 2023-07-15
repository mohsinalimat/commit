import { DocType } from "@/types/Core/DocType"
import { useFrappeGetCall } from "frappe-react-sdk"
import { nanoid } from 'nanoid';
import { TableModal } from "./TableModal";


export const GenerateGraph = (ID?: string) => {

    const { data, error, isLoading, mutate } = useFrappeGetCall<{
        message: {
            graph_name: string,
            doctypes: string[]
            json_data: DocType[]
        }
    }>('commit.commit.doctype.graph.graph.get_graph_data', {
        id: ID
    }, ID ? undefined : null)

    const { updateGraph,
        addTable,
        updateTable,
        removeTable,
        addField,
        removeField,
        addBulkFields,
        // applyVersion,
        calcXY, } = TableModal()

    const graph = addGraph();

    if (data && data.message) {

        const tableDict: any = {};
        data.message.json_data?.forEach((doctype: DocType) => {
            const table = addTable(doctype.name);
            addBulkFields(table, doctype);
            tableDict[table.id] = table;
        });

        graph.tableDict = tableDict;

        return graph
    }
    return graph
}

export const addGraph = (graph = {}, id = null) => {
    const graphId = id || nanoid();
    const now = new Date().valueOf();
    const graphJSON = {
        ...graph,
        id: graphId,
        box: {
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight,
            clientW: window.innerWidth,
            clientH: window.innerHeight,
        },
        tableDict: {},
        linkDict: {},
        createdAt: now,
        updatedAt: now,
    };
    return graphJSON
};