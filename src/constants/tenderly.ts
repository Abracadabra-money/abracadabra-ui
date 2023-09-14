export const TENDERLY_URL: string = `https://api.tenderly.co/api/v1/account/${
  import.meta.env.VITE_APP_TENDERLY_USER
}/project/${import.meta.env.VITE_APP_TENDERLY_PROJECT}/fork`;

export const TENDERLY_FORK_URL: string = "https://rpc.tenderly.co/fork/";
