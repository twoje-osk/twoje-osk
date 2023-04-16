import { useCallback, useReducer } from 'react';
import { assertNever } from '../../utils/asserNever';

interface ReadingQuestionState {
  type: 'reading';
  showMedia: false;
  showStartButton: true;
}

interface AnsweringQuestionState {
  type: 'answering';
  showMedia: true;
  showStartButton: false;
}

interface WatchingVideoState {
  type: 'video';
  showMedia: true;
  showStartButton: false;
}

type QuestionState =
  | AnsweringQuestionState
  | ReadingQuestionState
  | WatchingVideoState;

interface StartReadingQuestion {
  type: 'startReading';
}

interface StartAnsweringQuestion {
  type: 'startAnswering';
}

interface StartVideo {
  type: 'startVideo';
}

type ChangeQuestionStateAction =
  | StartAnsweringQuestion
  | StartReadingQuestion
  | StartVideo;

const INITIAL_STATE: QuestionState = {
  type: 'reading',
  showMedia: false,
  showStartButton: true,
};

export const useQuestionState = () => {
  const [state, dispatch] = useReducer(
    (
      previousState: QuestionState,
      action: ChangeQuestionStateAction,
    ): QuestionState => {
      switch (action.type) {
        case 'startReading':
          return { type: 'reading', showMedia: false, showStartButton: true };
        case 'startAnswering':
          return { type: 'answering', showMedia: true, showStartButton: false };
        case 'startVideo':
          return { type: 'video', showMedia: true, showStartButton: false };
        default: {
          return assertNever(action);
        }
      }
    },
    INITIAL_STATE,
  );

  const startReadingQuestion = useCallback(() => {
    dispatch({ type: 'startReading' });
  }, []);

  const startAnsweringQuestion = useCallback(() => {
    dispatch({ type: 'startAnswering' });
  }, []);

  const startVideo = useCallback(() => {
    dispatch({ type: 'startVideo' });
  }, []);

  return [
    state,
    startReadingQuestion,
    startAnsweringQuestion,
    startVideo,
  ] as const;
};
