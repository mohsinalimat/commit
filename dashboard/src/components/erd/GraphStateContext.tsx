import { GraphStateContext, useGraphState } from "@/hooks/graphState";

export const GraphStateProvider = ({ children }: { children: any }) => {
    const graphState = useGraphState();

    return (
        <GraphStateContext.Provider value={graphState}>
            {children}
        </GraphStateContext.Provider>
    );
}