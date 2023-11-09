export const TENDERLY_BASE_URL: string = `https://api.tenderly.co/api/v1/account/${
  import.meta.env.VITE_APP_TENDERLY_USER
}/project/${import.meta.env.VITE_APP_TENDERLY_PROJECT}`;

export const TENDERLY_GET_INFO_URL: string = `https://api.tenderly.co/api/v2/project/${
  import.meta.env.VITE_APP_TENDERLY_PROJECT
}/forks/`;

export const TENDERLY_FORK_URL: string = "https://rpc.tenderly.co/fork/";
export const TENDERLY_EVENT_CHANGED_DATA: string = "tenderly_fork_data-changed";
export const TENDERLY_FORK_DATA: string = "tenderly_fork_data";
