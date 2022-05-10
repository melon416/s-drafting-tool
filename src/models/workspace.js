export const workspace = {
    state: {
        workspaces: [],
        activeWorkspaces: [],
    },

    reducers: {
        setWorkspaces(state, {workspaces = []}) {
            return {
                ...state,
                workspaces,
            };
        },
        setActiveWorkspaces(state, {workspaces = []}) {
            let activeWorkspaces = workspaces.filter(workspace => workspace.active === true);
            return {
                ...state,
                activeWorkspaces,
            };
        },
    },
};
