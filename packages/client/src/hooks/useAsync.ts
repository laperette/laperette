import {
  useCallback,
  useReducer,
  useLayoutEffect,
  useRef,
  Dispatch,
} from "react";

const useSafeDispatch = <T>(dispatch: Dispatch<T>) => {
  const mounted = useRef(false);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return useCallback((arg: T) => (mounted.current ? dispatch(arg) : void 0), [
    dispatch,
  ]);
};

enum STATUS {
  IDLE = "idle",
  PENDING = "pending",
  REJECTED = "rejected",
  RESOLVED = "resolved",
}

type State<T> = {
  status: STATUS;
  data: T | null;
  error: Error | null;
};

const initialState = { status: STATUS.IDLE, data: null, error: null };

export const useAsync = <T>() => {
  const [{ status, data, error }, setState] = useReducer(
    (s: State<T>, a: Partial<State<T>>) => ({ ...s, ...a }),
    initialState,
  );

  const safeSetState = useSafeDispatch(setState);

  const run = useCallback(
    async (promise: Promise<T | null>) => {
      safeSetState({ status: STATUS.PENDING });
      try {
        const data = await promise;
        safeSetState({ data, status: STATUS.RESOLVED });
        return data;
      } catch (error) {
        safeSetState({ status: STATUS.REJECTED, error });
        return error;
      }
    },
    [safeSetState],
  );

  const setData = useCallback((data: T | null) => safeSetState({ data }), [
    safeSetState,
  ]);
  const setError = useCallback((error) => safeSetState({ error }), [
    safeSetState,
  ]);
  const reset = useCallback(() => safeSetState(initialState), [safeSetState]);

  return {
    isIdle: status === STATUS.IDLE,
    isLoading: status === STATUS.PENDING,
    isError: status === STATUS.REJECTED,
    isSuccess: status === STATUS.RESOLVED,
    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
};
