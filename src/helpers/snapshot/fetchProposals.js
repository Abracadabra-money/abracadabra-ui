import axios from "axios";

const subgraphUrl = "https://hub.snapshot.org/graphql";
const spaceId = "abracadabrabymerlinthemagician.eth";

export const fetchProposals = async (first = 5) => {
  const cachedData = checkAndGetCachedData("PROPOSALS");

  if (cachedData) return cachedData;

  try {
    const query = `{
      proposals(
          first: ${first},
          skip: 0,
          where: {
            space_in: ["${spaceId}"],
          },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
          scores
          quorum
        }
  }`;

    const { data } = await axios.post(subgraphUrl, { query });

    const proposals = data.data.proposals;

    saveToLocalStorage("PROPOSALS", proposals);

    return proposals;
  } catch (error) {
    console.log("getProposals err:", error);
  }
};

const checkAndGetCachedData = (storageKey, allowedTime = 10) => {
  const cachedData = localStorage.getItem(storageKey);
  if (!cachedData) return false;

  try {
    const { data, time } = JSON.parse(cachedData);

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - time;
    const minutes = Math.floor(timeDiff / 1000 / 60);
    if (minutes > allowedTime) return false;

    return data;
  } catch (error) {
    console.log("checkAndGetCachedData err:", error);
    return false;
  }
};

const saveToLocalStorage = (storageKey, data) => {
  // save to ls
  const time = new Date().getTime();
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      data,
      time,
    })
  );
};
