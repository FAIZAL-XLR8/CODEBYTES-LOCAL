import { createSlice } from "@reduxjs/toolkit";

const codeSlice = createSlice({
    name: "code",
    initialState: {
        savedCode: {},
       initializedProblems: {}
       //initialisedProblems basically means user has written some kind of code for this and redux has previous codes for this
    },
    reducers: {
         markProblemInitialized: (state, action) => {
      const { problemId, language } = action.payload;
      
      if (!state.initializedProblems[problemId]) {
        state.initializedProblems[problemId] = {};
      }
      
      state.initializedProblems[problemId][language] = true;
     
    },
        saveCode: (state, action) => {
            const { problemId, language, code } = action.payload;
            
           
            if (!state.savedCode[problemId]) {
                state.savedCode[problemId] = {};
            }
            
           
            state.savedCode[problemId][language] = code;
           
        },
        
        
        
        clearProblemCode: (state, action) => {
            const { problemId } = action.payload;
            delete state.savedCode[problemId];
              delete state.initializedProblems[problemId]; 
            console.log(`🗑️ Cleared all code for problem ${problemId}`);
        },
        
        clearLanguageCode: (state, action) => {
            const { problemId, language } = action.payload;
            if (state.savedCode[problemId]) {
                delete state.savedCode[problemId][language];
                console.log(`🗑️ Cleared ${language} code for problem ${problemId}`);
            }
             if (state.initializedProblems[problemId]) {
        delete state.initializedProblems[problemId][language];  
      }
        },
    }
});

export const { saveCode, clearProblemCode, clearLanguageCode ,markProblemInitialized  } = codeSlice.actions;
export default codeSlice.reducer;

// Selector to get code for specific problem and language
export const selectCode = (state, problemId, language) => {
    return state.code.savedCode[problemId]?.[language] || null;
};
export const selectIsInitialized = (state, problemId, language) => {
  return state.code.initializedProblems[problemId]?.[language] || false;
};