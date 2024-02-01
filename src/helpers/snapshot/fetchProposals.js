import axios from "axios";

const subgraphUrl = "https://hub.snapshot.org/graphql";
const spaceId = "abracadabrabymerlinthemagician.eth";

export const fetchProposals = async (first = 5) => {
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
        }
  }`;

    const { data } = await axios.post(subgraphUrl, { query });

    const proposals = data.data.proposals;

    return proposals;
  } catch (error) {
    console.log("getProposals err:", error);
  }
};
