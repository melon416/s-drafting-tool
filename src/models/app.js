/* eslint-disable camelcase */
import {
  getAppContext, login, logout, setCurrentStep,
} from '../dataCalls/app';
import { SIDEBAR_TAB_SUGGEST } from '../consts';
import { logError } from '../errorLogger';
import { addTransportAppContext } from '../dataCalls/transport';

export const app = {
  state: {
    appContext: {
      isLoggedIn: false,
    },
    sidebarTab: SIDEBAR_TAB_SUGGEST,
    rightPanelVisible: true,
    error: null,
    teachingBubbleCodes: ['intro', 'suggest', 'pick-and-choose', 'filter', 'add-clause', 'outro'],
    currentBubbleCode: '',
    visitedTeachingBubbles: [],
  },

  reducers: {

    setAppContext(state, { appContext }) {
      const { dt_current_tutorial_step } = appContext;

      return {
        ...state,
        appContext,
        currentBubbleCode: dt_current_tutorial_step !== 'skipped' && dt_current_tutorial_step !== 'finish' ? 'intro' : '',
      };
    },

    setWorkspaceId(state, { workspaceId }) {
      return {
        ...state,
        appContext: { ...state.appContext, workspace_id: workspaceId },
      };
    },

    setChecklistSavedDate(state, { last_checklist_saved }) {
      return {
        ...state,
        appContext: {
          ...state.appContext,
          last_checklist_saved,
        },
      };
    },

    resetTutorial(state) {
      return {
        ...state,
        currentBubbleCode: 'intro',
        visitedTeachingBubbles: [],
      };
    },

    setCurrentTeachingBubbleCode(state, bubbleCode) {
      return {
        ...state,
        currentBubbleCode: bubbleCode,
      };
    },

    addBubbleCodeToVisited(state, bubbleCode) {
      return {
        ...state,
        visitedTeachingBubbles: state.visitedTeachingBubbles.includes(state.currentBubbleCode) ? state.visitedTeachingBubbles : state.visitedTeachingBubbles.concat([bubbleCode]),
      };
    },

    removeBubbleCodeFromVisited(state, bubbleCode) {
      return {
        ...state,
        visitedTeachingBubbles: state.visitedTeachingBubbles.filter((bc) => bc !== bubbleCode),
      };
    },

    startTutorial(state) {
      return {
        ...state,
        currentBubbleCode: state.teachingBubbleCodes[1],
      };
    },

    setSidebarTab(state, { sidebarTab }) {
      return {
        ...state,
        sidebarTab,
      };
    },

    setError(state, { error }) {
      return {
        ...state,
        error,
      };
    },

    setRightPanelVisible(state, rightPanelVisible) {
      return {
        ...state,
        rightPanelVisible,
      };
    },
  },

  effects: (dispatch) => ({

    async login({ username, password, token }) {
      try {

        const { appContext } = await login({ username, password, token });
        this.setAppContext({ appContext });
        dispatch.workspace.setWorkspaces({ workspaces: appContext.workspaces });
        dispatch.workspace.setActiveWorkspaces({ workspaces: appContext.workspaces });

      } catch (error) {
        this.addError({ error });
      }
    },

    async logout() {
      this.setAppContext({ appContext: { isLoggedIn: false } });

      await logout();
    },

    async requestAppContext(__, rootState) {
      const { appContext } = await getAppContext(addTransportAppContext(rootState));

      this.setAppContext({ appContext });
      dispatch.workspace.setWorkspaces({ workspaces: appContext.workspaces });
      dispatch.workspace.setActiveWorkspaces({ workspaces: appContext.workspaces });

    },

    switchWorkspace(workspaceId) {
      this.setWorkspaceId({ workspaceId });
    },

    async addError({ error }) {
      if (error) {
        logError(error);
      }

      this.setError({ error });
    },

    async showNextTeachingBubble(__, rootState) {
      this.addBubbleCodeToVisited(rootState.app.currentBubbleCode);
      const currentBubbleIndex = rootState.app.teachingBubbleCodes.indexOf(rootState.app.currentBubbleCode);
      const nextBubbleCode = currentBubbleIndex === rootState.app.teachingBubbleCodes.length - 1 ? 'outro' : rootState.app.teachingBubbleCodes[currentBubbleIndex + 1];

      this.setCurrentBubbleCode(nextBubbleCode);

      if (nextBubbleCode === 'outro') {
        await setCurrentStep({ stepCode: 'finish' });
      } else {
        await setCurrentStep({ stepCode: nextBubbleCode });
      }
    },

    async setCurrentBubbleCode(bubbleCode) {
      if (bubbleCode === 'intro') {
        this.resetTutorial();
      } else {
        this.setCurrentTeachingBubbleCode(bubbleCode);
      }
      await setCurrentStep({ stepCode: bubbleCode });
    },
  }),
};
