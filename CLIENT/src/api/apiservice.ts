import axios from "./axiosinterceptor";
import { store } from "./../redux/store";
import { setLoadingTrue, setLoadingFalse } from "../redux/features/loadingSlice";
import toasterHelper from "../utils/toasterHelper";


type apiServiceType = {
  url: string;
  data?: unknown | [];
  customHeaders?: string;
  id?: string | number;
  showToaster?: boolean;
  showLoader?: boolean;
};

export const getApi = async (props: apiServiceType) => {
  const params = props.data || {};
  const showLoader = props.showLoader !== false;
  const showToaster = props.showToaster !== false; // true by default
  
  if (showLoader) {
    store.dispatch(setLoadingTrue());
  }
  
  try {
    const response = await axios.get(props.url, { params });
    if (showToaster && response.data?.message) {
      toasterHelper({ message: response.data.message, status: response.status });
    }
    return response.data;
  } catch (err: any) {
    if (err.response) {
      if (showToaster) {
        toasterHelper({ 
          message: err.response.data?.message || "Request failed", 
          status: err.response.status || 500 
        });
      }
    } else if (showToaster) {
      toasterHelper({ 
        message: err?.message || "Network error occurred", 
        status: 500 
      });
    }
    throw err; // Re-throw to allow caller to handle if needed
  } finally {
    if (showLoader) {
      store.dispatch(setLoadingFalse());
    }
  }
};

export const postApi = async (props: apiServiceType) => {
  const showLoader = props.showLoader !== false;
  const showToaster = props.showToaster !== false;
  
  if (showLoader) {
    store.dispatch(setLoadingTrue());
  }
  
  try {
    const response = await axios.post(`${props.url}`, props.data, {
      headers: {
        "Content-Type": props.customHeaders || "application/json",
      },
    });

    if (showToaster && response.data?.message) {
      toasterHelper({ message: response.data.message, status: response.status });
    }
    return response.data;
  } catch (err: any) {
    if (err.response) {
      if (showToaster) {
        toasterHelper({ 
          message: err.response.data?.message || "Request failed", 
          status: err.response.status || 500 
        });
      }
    } else if (showToaster) {
      toasterHelper({ 
        message: err?.message || "Network error occurred", 
        status: 500 
      });
    }
    throw err; // Re-throw to allow caller to handle if needed
  } finally {
    if (showLoader) {
      store.dispatch(setLoadingFalse());
    }
  }
};

export const putApi = async (props: apiServiceType) => {
  const showLoader = props.showLoader !== false;
  const showToaster = props.showToaster !== false;
  
  if (showLoader) {
    store.dispatch(setLoadingTrue());
  }
  
  try {
    const response = await axios.put(`${props.url}`, props.data, {
      headers: {
        "Content-Type": props.customHeaders || "application/json",
      },
    });
    
    if (showToaster && response.data?.message) {
      toasterHelper({ message: response.data.message, status: response.status });
    }
    return response.data;
  } catch (err: any) {
    if (err.response) {
      if (showToaster) {
        toasterHelper({ 
          message: err.response.data?.message || "Request failed", 
          status: err.response.status || 500 
        });
      }
    } else if (showToaster) {
      toasterHelper({ 
        message: err?.message || "Network error occurred", 
        status: 500 
      });
    }
    throw err; // Re-throw to allow caller to handle if needed
  } finally {
    if (showLoader) {
      store.dispatch(setLoadingFalse());
    }
  }
};

export const deleteApi = async (props: apiServiceType) => {
  const showLoader = props.showLoader !== false;
  const showToaster = props.showToaster !== false;
  
  if (showLoader) {
    store.dispatch(setLoadingTrue());
  }
  
  try {
    const response = await axios.delete(`${props.url}`, {
      headers: {
        "Content-Type": props.customHeaders || "application/json",
      },
    });
    
    if (showToaster && response.data?.message) {
      toasterHelper({ message: response.data.message, status: response.status });
    }
    return response.data;
  } catch (err: any) {
    if (err.response) {
      if (showToaster) {
        toasterHelper({ 
          message: err.response.data?.message || "Request failed", 
          status: err.response.status || 500 
        });
      }
    } else if (showToaster) {
      toasterHelper({ 
        message: err?.message || "Network error occurred", 
        status: 500 
      });
    }
    throw err; // Re-throw to allow caller to handle if needed
  } finally {
    if (showLoader) {
      store.dispatch(setLoadingFalse());
    }
  }
};