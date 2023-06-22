import { useFrappeGetDocList } from "frappe-react-sdk"

export interface GraphListProps {
    name: string
    graph_name: string
    graph_json: string
    modified?: string
}

export const ERDList = () => {

    const { data, error, isLoading, mutate } = useFrappeGetDocList<GraphListProps>('Graph', {
        fields: ['name', 'graph_name', 'graph_json', 'modified']
    })

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    if (isLoading) {
        return (
            <div>Loading</div>
        )
    }
    if (data) {
        return (

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Graph Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Modified
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d: GraphListProps) => {
                            return (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={d.name}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {d.graph_name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {d.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {d.modified}
                                    </td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
            </div>

        )
    }
    return null

}